'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function NotificationsPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [enabled, setEnabled] = useState(false);      // notifications on for this account?
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [isNative, setIsNative] = useState(false);

  // Detect native shell + load current state (token presence = enabled).
  useEffect(() => {
    try {
      const cap = (window as any)?.Capacitor;
      setIsNative(!!cap?.isNativePlatform?.());
    } catch { /* web */ }

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoggedIn(false); return; }
      setLoggedIn(true);
      await refreshState(session.user.id);
    })();
  }, []);

  async function refreshState(userId: string) {
    try {
      const { data } = await supabase
        .from('push_tokens')
        .select('token')
        .eq('user_id', userId)
        .limit(1);
      setEnabled(!!data && data.length > 0);
    } catch {
      setEnabled(false);
    }
  }

  async function turnOn() {
    setBusy(true);
    setStatus('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setStatus('Please sign in first.'); setBusy(false); return; }

      if (!isNative) {
        setStatus('Open the TerraForge app on your phone to enable notifications \u2014 they\u2019re delivered to your device.');
        setBusy(false);
        return;
      }

      // Native: register (asks permission, creates channel, stores token).
      const { registerPush } = await import('@/lib/push');
      await registerPush(session.user.id);

      // Give registration a moment, then re-check for a stored token.
      setTimeout(async () => {
        await refreshState(session.user.id);
        setStatus('\u2705 Notifications enabled.');
        setBusy(false);
      }, 1200);
    } catch (e: any) {
      setStatus(`\u26a0\ufe0f ${e?.message || 'Could not enable notifications.'}`);
      setBusy(false);
    }
  }

  async function turnOff() {
    setBusy(true);
    setStatus('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setStatus('Please sign in first.'); setBusy(false); return; }

      // Remove this account's tokens so no further notifications are delivered.
      await supabase.from('push_tokens').delete().eq('user_id', session.user.id);
      setEnabled(false);
      setStatus('Notifications turned off. You can turn them back on anytime.');
    } catch (e: any) {
      setStatus(`\u26a0\ufe0f ${e?.message || 'Could not turn off notifications.'}`);
    }
    setBusy(false);
  }

  async function sendTest() {
    setBusy(true);
    setStatus('Sending\u2026');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setStatus('Please sign in first.'); setBusy(false); return; }
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: '\ud83c\udf3f TerraForge',
          body: 'Notifications are working. We\u2019ll remind you when it\u2019s time to plant.',
        }),
      });
      const data = await res.json();
      if (data.ok && data.sent > 0) {
        setStatus(`\u2705 Sent to ${data.sent} device${data.sent === 1 ? '' : 's'}.`);
      } else {
        setStatus('No active devices found. Make sure the app is installed and notifications are on.');
      }
    } catch (e: any) {
      setStatus(`\u26a0\ufe0f ${e?.message || 'Request failed.'}`);
    }
    setBusy(false);
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
        }}>\u2190 Back to App</Link>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>\ud83d\udd14</div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800,
            color: '#f2fffa', margin: '0 0 8px',
          }}>Notifications</h1>
          <p style={{ fontSize: 14, color: 'rgba(170,240,210,0.7)', margin: 0, lineHeight: 1.6 }}>
            Get seasonal planting reminders and updates for your homestead.
          </p>
        </div>

        {/* The toggle card */}
        <div style={{
          background: 'linear-gradient(160deg, rgba(14,42,26,0.9), rgba(8,20,16,0.9))',
          border: '1px solid rgba(0,255,170,0.2)', borderRadius: 16,
          padding: '20px 22px', marginBottom: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f2fffa' }}>
              Push notifications
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(170,240,210,0.6)', marginTop: 3, lineHeight: 1.5 }}>
              {enabled ? 'On \u2014 you\u2019ll receive reminders' : 'Off \u2014 no notifications'}
            </div>
          </div>

          {/* Toggle switch */}
          <button
            onClick={enabled ? turnOff : turnOn}
            disabled={busy || loggedIn === false}
            aria-label="Toggle notifications"
            style={{
              flexShrink: 0, width: 54, height: 30, borderRadius: 999, border: 'none',
              cursor: busy || loggedIn === false ? 'default' : 'pointer',
              background: enabled ? '#00ffaa' : 'rgba(255,255,255,0.15)',
              position: 'relative', transition: 'background 0.2s', opacity: busy ? 0.6 : 1,
            }}>
            <span style={{
              position: 'absolute', top: 3, left: enabled ? 27 : 3, width: 24, height: 24,
              borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }} />
          </button>
        </div>

        {/* Guidance / state messaging */}
        {loggedIn === false && (
          <p style={{
            fontSize: 13.5, textAlign: 'center', color: 'rgba(210,252,234,0.7)',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '12px 16px', margin: '0 0 14px',
          }}>
            Sign in to manage your notification settings.
          </p>
        )}

        {loggedIn && !isNative && (
          <p style={{
            fontSize: 13, textAlign: 'center', color: '#ffd591',
            background: 'rgba(255,179,64,0.08)', border: '1px solid rgba(255,179,64,0.3)',
            borderRadius: 10, padding: '12px 16px', margin: '0 0 14px', lineHeight: 1.6,
          }}>
            Notifications are delivered to the TerraForge mobile app. Install the app and
            enable notifications there to start receiving reminders.
          </p>
        )}

        {/* Test button — only meaningful when enabled */}
        {loggedIn && enabled && (
          <button onClick={sendTest} disabled={busy} style={{
            width: '100%', padding: '12px', borderRadius: 12, cursor: 'pointer',
            background: 'rgba(0,255,170,0.1)', border: '1px solid rgba(0,255,170,0.3)',
            color: '#00ffaa', fontWeight: 700, fontSize: 14, opacity: busy ? 0.6 : 1,
          }}>
            {busy ? 'Working\u2026' : 'Send a test notification'}
          </button>
        )}

        {status && (
          <p style={{
            marginTop: 16, fontSize: 13.5, color: '#fff', textAlign: 'center', lineHeight: 1.6,
            background: 'rgba(0,255,170,0.06)', border: '1px solid rgba(0,255,170,0.18)',
            borderRadius: 10, padding: '12px 16px',
          }}>{status}</p>
        )}

        <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center', gap: 18 }}>
          <Link href="/privacy" style={{ color: 'rgba(170,240,210,0.6)', fontSize: 13 }}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ color: 'rgba(170,240,210,0.6)', fontSize: 13 }}>
            Terms
          </Link>
        </div>
      </div>
    </main>
  );
}
