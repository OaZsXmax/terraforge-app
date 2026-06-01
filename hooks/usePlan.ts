'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type Plan = 'free' | 'pro';

const ADMIN_EMAILS = ['compassavail@gmail.com'];

let cachedPlan: Plan | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000;

export function usePlan(userEmail?: string): { plan: Plan; loading: boolean; refresh: () => void } {
  const [plan, setPlan] = useState<Plan>(cachedPlan ?? 'free');
  const [loading, setLoading] = useState(!cachedPlan);

  const fetchPlan = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setPlan('free'); setLoading(false); return; }

      // Admin override
      if (ADMIN_EMAILS.includes(session.user.email ?? '')) {
        cachedPlan = 'pro'; cacheTime = Date.now();
        setPlan('pro'); setLoading(false); return;
      }

      const res = await fetch('/api/subscription', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const { plan: p } = await res.json();
      cachedPlan = p as Plan;
      cacheTime = Date.now();
      setPlan(p);
    } catch {
      setPlan('free');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cachedPlan && Date.now() - cacheTime < CACHE_TTL) {
      setPlan(cachedPlan); setLoading(false); return;
    }
    fetchPlan();
  }, [userEmail]); // re-fetch when user changes

  const refresh = () => {
    cachedPlan = null; cacheTime = 0;
    setLoading(true); fetchPlan();
  };

  return { plan, loading, refresh };
}
