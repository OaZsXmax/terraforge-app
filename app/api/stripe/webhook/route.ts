import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message);
    return NextResponse.json({ error: `Signature failed: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const userId = session.metadata?.supabase_user_id;
      const subscriptionId = session.subscription as string;

      console.log('checkout.session.completed:', { userId, subscriptionId, metadata: session.metadata });

      if (!userId || !subscriptionId) {
        console.error('Missing userId or subscriptionId', { userId, subscriptionId });
        // Still return 200 so Stripe doesn't keep retrying
        return NextResponse.json({ received: true, warning: 'Missing userId or subscriptionId' });
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
      const periodEnd = subscription.current_period_end ?? subscription.items?.data?.[0]?.current_period_end;
      const expiresAt = periodEnd ? new Date(periodEnd * 1000).toISOString() : new Date(Date.now() + 30*24*60*60*1000).toISOString();

      const { error: upsertErr } = await supabase.from('profiles').upsert({
        id: userId,
        plan: 'pro',
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: session.customer,
        plan_expires_at: expiresAt,
      });

      if (upsertErr) {
        console.error('Supabase upsert failed:', upsertErr);
        return NextResponse.json({ error: `DB error: ${upsertErr.message}` }, { status: 500 });
      }

      console.log(`✓ Upgraded user ${userId} to pro, expires ${expiresAt}`);
    }

    if (event.type === 'invoice.paid') {
      const invoice = event.data.object as any;
      const subId = invoice.subscription as string;
      if (!subId) return NextResponse.json({ received: true });
      const subscription = await stripe.subscriptions.retrieve(subId) as any;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) return NextResponse.json({ received: true });
      const pe = subscription.current_period_end ?? subscription.items?.data?.[0]?.current_period_end;
      const expiresAt = pe ? new Date(pe * 1000).toISOString() : new Date(Date.now() + 30*24*60*60*1000).toISOString();
      await supabase.from('profiles').update({ plan: 'pro', plan_expires_at: expiresAt }).eq('id', userId);
    }

    if (event.type === 'customer.subscription.deleted' || event.type === 'invoice.payment_failed') {
      const obj = event.data.object as any;
      const subId = 'subscription' in obj ? obj.subscription : obj.id;
      if (!subId) return NextResponse.json({ received: true });
      const subscription = await stripe.subscriptions.retrieve(subId) as any;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) return NextResponse.json({ received: true });
      await supabase.from('profiles').update({ plan: 'free', stripe_subscription_id: null, plan_expires_at: null }).eq('id', userId);
    }

  } catch (err: any) {
    console.error('Webhook processing error:', err.message, err.stack);
    return NextResponse.json({ error: `Webhook handler failed: ${err.message}` }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
