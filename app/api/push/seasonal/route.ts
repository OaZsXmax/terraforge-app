// app/api/push/seasonal/route.ts
// Monthly seasonal planting reminder. Triggered by Vercel Cron on the 1st.
// Sends one notification to every opted-in device telling users what's
// sow-able this month, pulling them back into the app for personalized detail.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// Crop sow/harvest windows by zone: [sowStart, sowEnd, harvestStart, harvestEnd]
// Months are 1-13 (a value >12 wraps into the next year). Mirrors the app's data.
const CROP_MONTHS: Record<string, Record<string, [number, number, number, number]>> = {
  '🍅 tomatoes': { Temperate: [2, 4, 6, 9], Arid: [1, 3, 5, 8], Subtropical: [1, 3, 4, 8], Cold: [3, 4, 7, 9] },
  '🥕 carrots': { Temperate: [2, 4, 7, 10], Arid: [8, 10, 11, 13], Subtropical: [8, 10, 11, 13], Cold: [3, 4, 8, 10] },
  '🥬 lettuce': { Temperate: [1, 3, 8, 10], Arid: [8, 10, 11, 13], Subtropical: [8, 10, 11, 13], Cold: [2, 3, 8, 10] },
  '🥦 broccoli': { Temperate: [1, 2, 8, 9], Arid: [8, 9, 11, 12], Subtropical: [8, 9, 11, 12], Cold: [2, 3, 8, 9] },
  '🥒 cucumbers': { Temperate: [3, 5, 6, 9], Arid: [2, 4, 5, 8], Subtropical: [2, 4, 5, 8], Cold: [4, 5, 7, 9] },
  '🌽 corn': { Temperate: [3, 5, 7, 9], Arid: [2, 4, 6, 8], Subtropical: [2, 4, 6, 8], Cold: [4, 5, 8, 9] },
  '🫘 beans': { Temperate: [3, 5, 7, 9], Arid: [2, 3, 5, 7], Subtropical: [2, 3, 5, 7], Cold: [4, 5, 8, 9] },
  '🧅 onions': { Temperate: [1, 3, 6, 8], Arid: [8, 10, 1, 3], Subtropical: [8, 10, 1, 3], Cold: [2, 3, 7, 9] },
  '🥔 potatoes': { Temperate: [2, 4, 7, 9], Arid: [1, 2, 5, 7], Subtropical: [1, 2, 5, 7], Cold: [3, 4, 8, 9] },
  '🎃 pumpkins': { Temperate: [3, 5, 8, 10], Arid: [2, 4, 7, 9], Subtropical: [2, 4, 7, 9], Cold: [4, 5, 8, 10] },
  '🍓 strawberries': { Temperate: [2, 3, 5, 7], Arid: [1, 2, 4, 6], Subtropical: [1, 2, 4, 6], Cold: [3, 4, 6, 8] },
  '🌿 herbs': { Temperate: [2, 4, 5, 10], Arid: [1, 3, 4, 10], Subtropical: [1, 3, 4, 10], Cold: [3, 5, 6, 10] },
  '🍆 eggplant': { Temperate: [3, 5, 7, 9], Arid: [2, 4, 6, 8], Subtropical: [2, 4, 6, 8], Cold: [4, 5, 7, 9] },
  '🌶️ peppers': { Temperate: [3, 5, 7, 9], Arid: [2, 4, 6, 8], Subtropical: [2, 4, 6, 8], Cold: [4, 5, 7, 9] },
};

// Is `month` (1-12) within a sow window [start,end] that may wrap past 12?
function inWindow(month: number, start: number, end: number): boolean {
  // normalise wrapped windows (e.g. 9..13 means Sep..Jan)
  if (end <= 12 && start <= end) return month >= start && month <= end;
  // wrapped: start..12 or 1..(end-12)
  const wrappedEnd = end > 12 ? end - 12 : end;
  return month >= start || month <= wrappedEnd;
}

// Build a friendly list of crops sow-able this month across any zone.
function cropsToSowThisMonth(month: number): string[] {
  const names = new Set<string>();
  for (const [label, zones] of Object.entries(CROP_MONTHS)) {
    for (const z of Object.values(zones)) {
      const [sowStart, sowEnd] = z;
      if (inWindow(month, sowStart, sowEnd)) {
        names.add(label);
        break;
      }
    }
  }
  return Array.from(names);
}

function ensureFirebase() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  }
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  // --- Protect the endpoint: only Vercel Cron (with the secret) may run it ---
  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const month = new Date().getMonth() + 1; // 1-12
    const crops = cropsToSowThisMonth(month);

    // Craft the message. Show up to 3 example crops, else a generic nudge.
    let body: string;
    if (crops.length > 0) {
      const sample = crops.slice(0, 3).map((c) => c.split(' ')[0]).join(' '); // just the emojis
      const names = crops.slice(0, 3).map((c) => c.split(' ').slice(1).join(' ')).join(', ');
      body = `${sample} Time to sow ${names} and more this month. Tap to see your planting calendar.`;
    } else {
      body = 'A new planting month is here — open TerraForge to see what to sow and harvest.';
    }
    const title = '🌱 Your monthly planting reminder';

    // --- Gather every opted-in device token ---
    const supaAdmin = getSupabaseAdmin();
    const { data: rows, error } = await supaAdmin.from('push_tokens').select('token');
    if (error) {
      return NextResponse.json({ error: 'Could not read tokens' }, { status: 500 });
    }
    if (!rows || rows.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, note: 'no devices' });
    }

    const allTokens = rows.map((r) => r.token);

    // --- FCM multicast in batches of 500 (the API limit) ---
    ensureFirebase();
    const messaging = getMessaging();
    let sent = 0, failed = 0;
    const stale: string[] = [];

    for (let i = 0; i < allTokens.length; i += 500) {
      const batch = allTokens.slice(i, i + 500);
      const res = await messaging.sendEachForMulticast({
        tokens: batch,
        notification: { title, body },
        android: { priority: 'high', notification: { channelId: 'default' } },
      });
      sent += res.successCount;
      failed += res.failureCount;
      res.responses.forEach((r, idx) => {
        if (!r.success) {
          const code = r.error?.code || '';
          if (
            code.includes('registration-token-not-registered') ||
            code.includes('invalid-registration-token') ||
            code.includes('invalid-argument')
          ) {
            stale.push(batch[idx]);
          }
        }
      });
    }

    if (stale.length) {
      await supaAdmin.from('push_tokens').delete().in('token', stale);
    }

    return NextResponse.json({ ok: true, month, crops: crops.length, sent, failed, cleaned: stale.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Cron failed' }, { status: 500 });
  }
}
