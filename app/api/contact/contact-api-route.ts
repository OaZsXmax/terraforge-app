import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, type, message } = await req.json();
    if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const typeLabels: Record<string, string> = {
      general: 'General question',
      bug: 'Bug report',
      feature: 'Feature request',
      billing: 'Billing issue',
      feedback: 'Feedback',
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TerraForge Contact <noreply@terraforgehome.com>',
        to: 'compassavail@gmail.com',
        reply_to: email,
        subject: `[TerraForge ${typeLabels[type] ?? type}] from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a1f15;color:#d2fcea;border-radius:16px;">
            <h2 style="color:#00ffaa;margin:0 0 24px;font-size:20px;">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr><td style="padding:8px 0;color:rgba(170,240,210,0.6);font-size:13px;width:100px">Name</td><td style="padding:8px 0;color:#d2fcea;font-size:13px">${name}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(170,240,210,0.6);font-size:13px">Email</td><td style="padding:8px 0;color:#d2fcea;font-size:13px"><a href="mailto:${email}" style="color:#00ffaa">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:rgba(170,240,210,0.6);font-size:13px">Topic</td><td style="padding:8px 0;color:#d2fcea;font-size:13px">${typeLabels[type] ?? type}</td></tr>
            </table>
            <div style="background:rgba(0,255,170,0.06);border:1px solid rgba(0,255,170,0.2);border-radius:12px;padding:20px;">
              <p style="margin:0;font-size:14px;line-height:1.7;color:#aaf0d2;white-space:pre-wrap">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
            <p style="margin-top:24px;font-size:11px;color:rgba(170,240,210,0.4)">Reply directly to this email to respond to ${name}.</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[contact]', err);
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[contact]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
