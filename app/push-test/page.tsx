// app/push-test/page.tsx
// Temporary test page to fire a push notification to your own devices.
// Visit /push-test while logged in, tap the button. DELETE this file before
// the public Play Store launch (or keep it — it's harmless and login-gated).

'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PushTestPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function sendTest() {
    setLoading(true);
    setStatus('Sending…');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus('❌ Not logged in. Sign in first, then come back.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: '🌿 TerraForge',
          body: 'Push notifications are working!',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus(`✅ Sent to ${data.sent} device(s), ${data.failed} failed. Check your device!`);
      } else {
        setStatus(`⚠️ ${data.error || 'Something went wrong'} (status ${res.status})`);
      }
    } catch (e: any) {
      setStatus(`❌ ${e?.message || 'Request failed'}`);
    }
    setLoading(false);
  }

  return (
    <main style={{
      minHeight: '100vh', background: 'radial-gradient(ellipse at top,#0d2719,#0a1f15)',
      color: '#d2fcea', fontFamily: 'system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 20, padding: 24,
    }}>
      <div style={{ fontSize: 40 }}>🔔</div>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#f2fffa' }}>Push Test</h1>
      <p style={{ fontSize: 14, color: '#aaf0d2', textAlign: 'center', maxWidth: 360, margin: 0 }}>
        Tap below to send a test notification to every device registered to your account.
      </p>
      <button onClick={sendTest} disabled={loading} style={{
        padding: '14px 32px', borderRadius: 12, cursor: 'pointer', border: 'none',
        background: 'linear-gradient(135deg,#00ffaa,#00c45a)', color: '#051a0e',
        fontWeight: 800, fontSize: 16,
      }}>
        {loading ? 'Sending…' : 'Send Test Notification'}
      </button>
      {status && (
        <p style={{
          fontSize: 13, color: '#fff', textAlign: 'center', maxWidth: 380,
          background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.2)',
          borderRadius: 10, padding: '12px 16px', margin: 0,
        }}>{status}</p>
      )}
    </main>
  );
}
