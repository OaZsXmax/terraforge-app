'use client';
import React, { useState } from 'react';
import { createCheckoutSession } from '@/lib/checkout';

interface PaywallProps {
  feature?: string;
  onClose?: () => void;
  isLoggedIn?: boolean;
  onLogin?: () => void;
  accessToken?: string;
}

const FEATURES = [
  { label: 'Unlimited maps & blueprints', pro: false },
  { label: 'Full feature library (91 items)', pro: false },
  { label: 'Yield & savings calculations', pro: false },
  { label: 'AI-powered configuration', pro: false },
  { label: '1 saved blueprint', pro: false },
  { label: '1 PDF export', pro: false },
  { label: 'Unlimited blueprint saves', pro: true },
  { label: 'Unlimited PDF exports', pro: true },
  { label: 'ROI & 20-year projections', pro: true },
  { label: 'Phase-by-phase deploy plan', pro: true },
  { label: 'Seasonal planting calendar', pro: true },
  { label: 'Sync across devices', pro: true },
];

export default function Paywall({ feature, onClose, isLoggedIn, onLogin, accessToken }: PaywallProps) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleUpgrade = async () => {
    // Must be logged in so webhook can identify the user
    if (!isLoggedIn || !accessToken) {
      onClose?.();
      onLogin?.();
      return;
    }
    setLoading(true);
    setErr('');
    try {
      const { url } = await createCheckoutSession('price_1TYXogBsMVXXOrRdRwPuUx7K', accessToken);
      if (url) window.location.href = url;
    } catch (e: any) {
      setErr(e?.message ?? 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const needsLogin = !isLoggedIn;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(4,12,8,0.90)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '12px',
        overflowY: 'auto',
      }}
    >
      <div style={{
        background: 'linear-gradient(160deg,#0d2218 0%,#081a10 100%)',
        border: '1px solid rgba(0,255,130,0.18)',
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        position: 'relative',
        margin: 'auto',
      }}>

        {/* Close */}
        {onClose && (
          <button onClick={onClose} style={{
            position: 'absolute', top: 10, right: 10,
            width: 26, height: 26, borderRadius: 99,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: 'rgba(255,255,255,0.5)', fontSize: 15,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        )}

        {/* Header */}
        <div style={{ padding: '24px 24px 0', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,255,130,0.08)',
            border: '1px solid rgba(0,255,130,0.20)',
            borderRadius: 99, padding: '4px 12px', marginBottom: 12,
          }}>
            <span style={{
              fontSize: 9, color: '#00ff82', fontWeight: 700,
              letterSpacing: '.15em', textTransform: 'uppercase',
              fontFamily: "'Courier New', monospace",
            }}>TerraForge Pro</span>
          </div>

          <h2 style={{
            fontSize: 20, fontWeight: 700, color: '#e8f5ee',
            margin: '0 0 6px', letterSpacing: '-.02em',
            fontFamily: "'Georgia', serif",
          }}>
            {feature ? `${feature} is Pro` : 'Upgrade to Pro'}
          </h2>

          {needsLogin && (
            <p style={{
              fontSize: 11, color: 'rgba(0,255,130,0.70)',
              fontFamily: "'Courier New', monospace",
              margin: '0 0 8px', lineHeight: 1.5,
            }}>
              Sign in first so we can activate your plan instantly.
            </p>
          )}

          <div style={{
            display: 'flex', alignItems: 'baseline',
            justifyContent: 'center', gap: 3, margin: '10px 0 16px',
          }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: '#00ff82', letterSpacing: '-.03em' }}>$9</span>
            <span style={{ fontSize: 13, color: 'rgba(200,230,212,0.45)' }}>/month</span>
          </div>
        </div>

        {/* Features — two columns */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.20)', borderRadius: 12,
            padding: '12px 14px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '7px 8px',
          }}>
            {FEATURES.map(({ label, pro }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{
                  marginTop: 2, width: 14, height: 14, borderRadius: 99,
                  flexShrink: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 8, fontWeight: 700,
                  background: pro ? 'rgba(0,255,130,0.15)' : 'rgba(0,212,180,0.10)',
                  border: pro ? '1px solid rgba(0,255,130,0.35)' : '1px solid rgba(0,212,180,0.25)',
                  color: pro ? '#00ff82' : '#00d4b4',
                }}>
                  {pro ? '★' : '✓'}
                </span>
                <span style={{
                  fontSize: 10, lineHeight: 1.35,
                  color: pro ? 'rgba(180,255,220,0.90)' : 'rgba(0,212,180,0.75)',
                  fontFamily: "'Courier New', monospace",
                }}>
                  {label}
                  {pro && (
                    <span style={{
                      marginLeft: 3, fontSize: 7, fontWeight: 700,
                      color: '#00ff82', letterSpacing: '.1em', textTransform: 'uppercase',
                    }}>PRO</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '0 16px 20px' }}>
          {err && (
            <p style={{
              color: '#ff6b6b', fontSize: 11, textAlign: 'center',
              marginBottom: 8, fontFamily: "'Courier New', monospace",
            }}>{err}</p>
          )}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading
                ? 'rgba(0,255,130,0.15)'
                : needsLogin
                ? 'linear-gradient(135deg,#00aaff 0%,#0077cc 100%)'
                : 'linear-gradient(135deg,#00e87a 0%,#00c45a 100%)',
              border: 'none', borderRadius: 12,
              color: loading ? 'rgba(0,255,130,0.4)' : '#051a0e',
              fontSize: 13, fontWeight: 800,
              letterSpacing: '.05em',
              cursor: loading ? 'wait' : 'pointer',
              fontFamily: "'Courier New', monospace",
              boxShadow: loading ? 'none' : needsLogin
                ? '0 4px 20px rgba(0,170,255,0.30)'
                : '0 4px 20px rgba(0,232,122,0.30)',
            }}
          >
            {loading
              ? 'Redirecting to Stripe…'
              : needsLogin
              ? 'Sign In to Upgrade — $9/mo'
              : 'Upgrade to Pro — $9/mo'}
          </button>
          <p style={{
            textAlign: 'center', fontSize: 9,
            color: 'rgba(200,230,212,0.22)', marginTop: 10,
            fontFamily: "'Courier New', monospace", letterSpacing: '.05em', lineHeight: 1.6,
          }}>
            {needsLogin
              ? 'Account required to activate Pro features'
              : 'Cancel anytime · Secure checkout via Stripe'}
          </p>
        </div>
      </div>
    </div>
  );
}
