'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function NotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [hasDevice, setHasDevice] = useState<boolean | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  // On load, check whether the user is logged in and has a registered device.
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoggedIn(false);
        return;
      }
      setLoggedIn(true);
      try {
        const { data, error } = await supabase
          .from('push_tokens')
          .select('token')
          .eq('user_id', session.user.id)
          .limit(1);
        setHasDevice(!error && !!data && data.length > 0);
      } catch {
        setHasDevice(false);
      }
    })();
  }, []);

  async function sendTest() {
    setLoading(true);
    setStatus('Sending…');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setStatus('Please sign in to manage notifications.');
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
          body: 'Notifications are on. We\u2019ll remind you when it\u2019s time to plant.',
        }),
      });
      const data = await res.json();
      if (data.ok && data.sent > 0) {
        setStatus(`✅ Sent to ${data.sent} device${data.sent === 1 ? '' : 's'}. Check your notification shade.`);
      } else if (data.ok && data.sent === 0) {
        setStatus('No active devices found. Open the TerraForge app on your phone and allow notifications, then try again.');
      } else if (res.status === 404) {
        setStatus('No registered devices yet. Open the app on your phone and allow notifications.');
      } else {
        setStatus(`⚠️ ${data.error || 'Something went wrong.'}`);
      }
    } catch (e: any) {
      setStatus(`⚠️ ${e?.message || 'Request failed.'}`);
    }
    setLoading(false);
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0d2719, #040e08)',
      color: '#d2fcea',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 20px 80px',
    }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href="/dashboard/garden" style={{
          color: '#00ffaa', textDecoration: 'none', fontSize: 14, fontWeight: 600,
          display: 'inline-block', marginBottom: 28,
        }}>← Back to App</Link>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🔔</div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800,
            color: '#f2fffa', margin: '0 0 8px',
          }}>Notifications</h1>
          <p style={{ fontSize: 14, color: 'rgba(170,240,210,0.7)', margin: 0, lineHeight: 1.6 }}>
            Get seasonal planting reminders and updates for your homestead, delivered
            straight to your device.
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(160deg, rgba(14,42,26,0.9), rgba(8,20,16,0.9))',
          border: '1px solid rgba(0,255,170,0.2)', borderRadius: 16,
          padding: '24px 22px', marginBottom: 18,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f2fffa', margin: '0 0 12px' }}>
            How to enable notifications
          </h2>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.9, color: 'rgba(210,252,234,0.8)' }}>
            <li>Open the TerraForge app on your phone.</li>
            <li>When prompted, tap <strong style={{ color: '#00ffaa' }}>Allow</strong> notifications.</li>
            <li>That&rsquo;s it — you&rsquo;ll start receiving reminders.</li>
          </ol>

          {hasDevice !== null && loggedIn && (
            <div style={{
              marginTop: 16, padding: '10px 14px', borderRadius: 10, fontSize: 13,
              background: hasDevice ? 'rgba(0,255,170,0.08)' : 'rgba(255,179,64,0.08)',
              border: `1px solid ${hasDevice ? 'rgba(0,255,170,0.25)' : 'rgba(255,179,64,0.3)'}`,
              color: hasDevice ? '#00ffaa' : '#ffd591',
            }}>
              {hasDevice
                ? '✓ This account has a device registered for notifications.'
                : 'No device registered yet. Open the app on your phone and allow notifications.'}
            </div>
          )}
        </div>

        {loggedIn === false ? (
          <div style={{
            textAlign: 'center', padding: '16px', borderRadius: 12, fontSize: 14,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(210,252,234,0.7)',
          }}>
            Sign in to send a test notification to your devices.
          </div>
        ) : (
          <button onClick={sendTest} disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: 12, cursor: 'pointer', border: 'none',
            background: 'linear-gradient(135deg, #00ffaa, #00c45a)', color: '#051a0e',
            fontWeight: 800, fontSize: 15, opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Sending…' : 'Send a test notification'}
          </button>
        )}

        {status && (
          <p style={{
            marginTop: 16, fontSize: 13.5, color: '#fff', textAlign: 'center', lineHeight: 1.6,
            background: 'rgba(0,255,170,0.06)', border: '1px solid rgba(0,255,170,0.18)',
            borderRadius: 10, padding: '12px 16px',
          }}>{status}</p>
        )}
      </div>
    </main>
  );
}
