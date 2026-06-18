// app/api/push/send/route.ts
// Server endpoint that sends a push notification to a user's devices via FCM.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// ---- Initialise the Firebase Admin SDK once (reused across invocations) ----
function ensureFirebase() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Vercel stores the key with literal \n — turn them into real newlines.
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  }
}

// Service-role Supabase client (server only) to read tokens past RLS.
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    // --- Authenticate the caller ---
    const authHeader = req.headers.get('authorization') || '';
    const accessToken = authHeader.replace('Bearer ', '').trim();
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const supaAdmin = getSupabaseAdmin();
    const { data: userData, error: userErr } = await supaAdmin.auth.getUser(accessToken);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    const userId = userData.user.id;

    // --- Read the message (with safe defaults for a test) ---
    const body = await req.json().catch(() => ({}));
    const title: string = body.title || '🌿 TerraForge';
    const message: string = body.body || 'Your homestead is waiting.';

    // --- Look up this user's device tokens ---
    const { data: tokens, error: tokErr } = await supaAdmin
      .from('push_tokens')
      .select('token')
      .eq('user_id', userId);

    if (tokErr) {
      return NextResponse.json({ error: 'Could not read tokens' }, { status: 500 });
    }
    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ error: 'No registered devices' }, { status: 404 });
    }

    // --- Send to every token via FCM ---
    ensureFirebase();
    const tokenList = tokens.map((t) => t.token);
    const res = await getMessaging().sendEachForMulticast({
      tokens: tokenList,
      notification: { title, body: message },
      android: { priority: 'high', notification: { channelId: 'default' } },
    });

    // --- Clean up any tokens FCM reports as invalid ---
    const stale: string[] = [];
    res.responses.forEach((r, i) => {
      if (!r.success) {
        const code = r.error?.code || '';
        if (
          code.includes('registration-token-not-registered') ||
          code.includes('invalid-registration-token') ||
          code.includes('invalid-argument')
        ) {
          stale.push(tokenList[i]);
        }
      }
    });
    if (stale.length) {
      await supaAdmin.from('push_tokens').delete().in('token', stale);
    }

    return NextResponse.json({
      ok: true,
      sent: res.successCount,
      failed: res.failureCount,
      cleaned: stale.length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Send failed' }, { status: 500 });
  }
}
