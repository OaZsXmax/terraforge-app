// app/api/email/cron/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.terraforgehome.com';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Auth guard (Vercel Cron sends CRON_SECRET as Bearer token) ───────────────
function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization') ?? '';
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

async function callSendRoute(payload: object) {
  const res = await fetch(`${APP_URL}/api/email/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// ─── Day-3 nudge: users with no blueprint saves, signed up 3 days ago ────────
async function runDay3Nudge() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const fourDaysAgo  = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();

  // Get users created 3–4 days ago
  const { data: users, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name, saves, email_unsubscribed')
    .gte('created_at', fourDaysAgo)
    .lte('created_at', threeDaysAgo);

  if (error) throw error;

  const results = [];
  for (const user of users ?? []) {
    if (user.email_unsubscribed) continue;
    // Only nudge if they have no saves
    const hasSaves = Array.isArray(user.saves) && user.saves.length > 0;
    if (hasSaves) continue;

    const result = await callSendRoute({
      type: 'nudge_day3',
      userId: user.id,
      email: user.email,
      name: user.name ?? user.email,
    });
    results.push({ userId: user.id, result });
  }
  return results;
}

// ─── Pro nudge: free users who've hit paywall (tracked via email_log) ─────────
async function runProNudge() {
  // Find free users who've had paywall_hits >= 2 tracked but never got pro_nudge email
  const { data: candidates, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name, plan, email_unsubscribed, paywall_hits')
    .eq('plan', 'free')
    .gte('paywall_hits', 2);

  if (error) throw error;

  const results = [];
  for (const user of candidates ?? []) {
    if (user.email_unsubscribed) continue;
    const result = await callSendRoute({
      type: 'pro_nudge',
      userId: user.id,
      email: user.email,
      name: user.name ?? user.email,
    });
    results.push({ userId: user.id, result });
  }
  return results;
}

// ─── Seasonal reminders: all users with a climate zone set ───────────────────
async function runSeasonalReminders() {
  const { data: users, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name, email_unsubscribed, saves')
    .not('saves', 'is', null);

  if (error) throw error;

  const results = [];
  for (const user of users ?? []) {
    if (user.email_unsubscribed) continue;

    // Extract climate zone from most recent save
    const saves = Array.isArray(user.saves) ? user.saves : [];
    if (saves.length === 0) continue;
    const latestSave = saves[0];
    const climateZone = latestSave?.data?.properties?.[0]?.climateZone
      ?? latestSave?.data?.formValues?.climateZone
      ?? null;
    if (!climateZone) continue;

    const result = await callSendRoute({
      type: 'seasonal',
      userId: user.id,
      email: user.email,
      name: user.name ?? user.email,
      climateZone,
    });
    results.push({ userId: user.id, climateZone, result });
  }
  return results;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const job = searchParams.get('job');

  try {
    if (job === 'day3') {
      const results = await runDay3Nudge();
      return NextResponse.json({ ok: true, job: 'day3', sent: results.length, results });
    }
    if (job === 'pro_nudge') {
      const results = await runProNudge();
      return NextResponse.json({ ok: true, job: 'pro_nudge', sent: results.length, results });
    }
    if (job === 'seasonal') {
      const results = await runSeasonalReminders();
      return NextResponse.json({ ok: true, job: 'seasonal', sent: results.length, results });
    }
    return NextResponse.json({ error: 'Unknown job. Use ?job=day3|pro_nudge|seasonal' }, { status: 400 });
  } catch (err: any) {
    console.error('[email/cron]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
