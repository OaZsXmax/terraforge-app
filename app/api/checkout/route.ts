import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY)
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY not configured' }, { status: 500 });
    if (!process.env.NEXT_PUBLIC_APP_URL)
      return NextResponse.json({ error: 'NEXT_PUBLIC_APP_URL not configured' }, { status: 500 });
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
      return NextResponse.json({ error: 'Supabase env vars not configured' }, { status: 500 });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { priceId } = await req.json();
    if (!priceId)
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });

    const token = req.headers.get('authorization')?.replace('Bearer ', '').trim();
    if (!token)
      return NextResponse.json({ error: 'No auth token provided' }, { status: 401 });

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user)
      return NextResponse.json({ error: 'Invalid or expired session. Please sign in again.' }, { status: 401 });

    const userId = user.id;
    const userEmail = user.email ?? null;

    let customerId: string | undefined;
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: userEmail ?? undefined,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
      await supabase.from('profiles').upsert({
        id: userId,
        email: userEmail,
        stripe_customer_id: customer.id,
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL.startsWith('http')
      ? process.env.NEXT_PUBLIC_APP_URL
      : `https://${process.env.NEXT_PUBLIC_APP_URL}`;

    // ── Check for an existing active subscription ──
    // If the customer already subscribes, switch the price (with proration)
    // instead of creating a second subscription, which would double-charge them.
    const existingSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (existingSubs.data.length > 0) {
      const sub = existingSubs.data[0];
      const currentItem = sub.items.data[0];

      // Already on the requested price? Nothing to do.
      if (currentItem.price.id === priceId) {
        return NextResponse.json({
          error: 'You are already subscribed to this plan.',
        }, { status: 400 });
      }

      // Switch the existing subscription to the new price with proration.
      await stripe.subscriptions.update(sub.id, {
        items: [{ id: currentItem.id, price: priceId }],
        proration_behavior: 'create_prorations',
        metadata: { supabase_user_id: userId },
      });

      // No redirect needed — the change is applied immediately.
      // Return a success URL so the client can show confirmation.
      return NextResponse.json({
        url: `${appUrl}/success?switched=1`,
        switched: true,
      });
    }

    // ── No existing subscription — normal new checkout ──
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/garden?cancelled=1`,
      metadata: { supabase_user_id: userId },
      subscription_data: {
        metadata: { supabase_user_id: userId },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('[Checkout error]', err?.message);
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
