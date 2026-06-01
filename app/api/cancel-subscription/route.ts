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
  try {
    const { userId, reason } = await req.json();
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    // Get subscription ID from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_subscription_id, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!profile?.stripe_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    // Cancel at period end (not immediately)
    await stripe.subscriptions.update(profile.stripe_subscription_id, {
      cancel_at_period_end: true,
      metadata: { cancellation_reason: reason ?? 'Not provided' },
    });

    // Log the reason in profiles table
    await supabase.from('profiles')
      .update({ cancellation_reason: reason ?? null })
      .eq('id', userId);

    console.log(`User ${userId} cancelled subscription. Reason: ${reason}`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Cancel subscription error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
