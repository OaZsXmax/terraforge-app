// app/api/email/unsubscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return new NextResponse('<h2>Invalid unsubscribe link.</h2>', { status: 400, headers: { 'Content-Type': 'text/html' } });
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ email_unsubscribed: true })
    .eq('email', email.toLowerCase());

  if (error) {
    return new NextResponse('<h2>Something went wrong. Please contact support.</h2>', { status: 500, headers: { 'Content-Type': 'text/html' } });
  }

  return new NextResponse(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>Unsubscribed</title>
<style>body{font-family:sans-serif;background:#0a1f15;color:#d2fcea;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.card{background:#112e1e;border:1px solid rgba(0,255,170,0.2);border-radius:20px;padding:48px;text-align:center;max-width:480px}
h1{color:#00ffaa;margin-bottom:16px}p{color:#aaf0d2;line-height:1.6}
a{color:#00ffaa;text-decoration:none;font-weight:600}</style></head>
<body><div class="card">
  <h1>✓ Unsubscribed</h1>
  <p>You've been unsubscribed from TerraForge emails. You won't receive any more lifecycle or seasonal emails.</p>
  <p style="margin-top:24px"><a href="${process.env.NEXT_PUBLIC_APP_URL}">← Back to TerraForge</a></p>
</div></body></html>`, {
    headers: { 'Content-Type': 'text/html' },
  });
}
