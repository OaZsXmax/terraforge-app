// lib/checkout.ts
import { supabase } from '@/lib/supabase';

export async function createCheckoutSession(
  priceId: string,
  accessToken?: string
): Promise<{ url: string | null }> {
  // Use passed token first, fall back to fetching session
  let token = accessToken;
  if (!token) {
    const { data: { session } } = await supabase.auth.getSession();
    token = session?.access_token;
  }

  if (!token) {
    throw new Error('You must be logged in to upgrade. Please sign in and try again.');
  }

  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ priceId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error ?? 'Checkout failed');
  }

  return res.json();
}
