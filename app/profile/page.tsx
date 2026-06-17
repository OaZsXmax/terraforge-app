'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Save = { key: string; label: string; savedAt: string; data: any };
type Profile = { name: string; email: string; plan: string; saves: Save[]; created_at?: string };

const MONTHLY_PRICE = 'price_1TYXogBsMVXXOrRdRwPuUx7K';
const ANNUAL_PRICE = 'price_1ThhtXBsMVXXOrRddpHo3AHs';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'blueprints' | 'account' | 'billing'>('overview');
  const [editName, setEditName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [cancelFlow, setCancelFlow] = useState<'idle' | 'confirm' | 'done'>('idle');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState<'annual' | 'monthly'>('annual');
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [showDeleteInfo, setShowDeleteInfo] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) { setProfile(data); setEditName(data.name ?? ''); }
      setLoading(false);
    }
    load();
  }, []);

  async function saveName() {
    if (!profile || !editName.trim()) return;
    setSavingName(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from('profiles').update({ name: editName.trim() }).eq('id', user.id);
    setProfile(p => p ? { ...p, name: editName.trim() } : p);
    setEditingName(false);
    setSavingName(false);
    flash('Name updated');
  }

  async function logout() {
    try { await supabase.auth.signOut(); } catch {}
    window.location.href = '/dashboard/garden';
  }

  async function startCheckout(plan: 'annual' | 'monthly') {
    setUpgradeLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setUpgradeLoading(false); return; }
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ priceId: plan === 'annual' ? ANNUAL_PRICE : MONTHLY_PRICE }),
      });
      const d = await res.json().catch(() => ({}));
      if (d.url) { window.location.href = d.url; return; }
      flash(d.error || 'Could not start checkout');
    } catch {
      flash('Could not start checkout');
    }
    setUpgradeLoading(false);
  }

  async function cancelSubscription() {
    setCancelLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch('/api/cancel-subscription', { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` } });
    const d = await res.json();
    if (d.ok) { setCancelFlow('done'); setProfile(p => p ? { ...p, plan: 'free' } : p); }
    else flash(d.error || 'Error cancelling');
    setCancelLoading(false);
  }

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000); }

  const isPro = profile?.plan === 'pro';
  const saves: Save[] = Array.isArray(profile?.saves) ? profile!.saves : [];
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null;
  const firstName = (profile?.name || 'Homesteader').split(' ')[0];

  // ── design tokens mirroring the main app ──
  const HEAD = "'Space Grotesk', sans-serif";
  const BODY = "'Inter', sans-serif";
  const glass: React.CSSProperties = {
    borderRadius: 20,
    background: 'linear-gradient(135deg,rgba(0,255,170,0.05) 0%,rgba(12,28,18,0.55) 45%,rgba(6,14,10,0.6) 100%)',
    border: '1px solid rgba(0,255,170,0.12)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.28)',
  };
  const input: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
    background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.18)',
    color: '#d2fcea', outline: 'none', fontFamily: BODY, boxSizing: 'border-box',
  };
  const btn: React.CSSProperties = {
    padding: '11px 24px', borderRadius: 12, cursor: 'pointer', border: 'none',
    background: 'linear-gradient(135deg,#00ffaa,#00c45a)', color: '#051a0e',
    fontWeight: 800, fontSize: 14, fontFamily: HEAD, textDecoration: 'none',
    display: 'inline-block', boxShadow: '0 4px 20px rgba(0,255,170,0.22)',
  };
  const btnGhost: React.CSSProperties = {
    padding: '9px 18px', borderRadius: 11, cursor: 'pointer',
    background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.22)',
    color: '#00ffaa', fontWeight: 700, fontSize: 13, fontFamily: HEAD,
    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7,
  };

  const Atmosphere = () => (
    <>
      <style>{`
        @keyframes tfFloat { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-30px)} }
        @keyframes tfFloat2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-25px,20px)} }
        @keyframes tfFade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .tf-up { animation: tfFade .5s ease both; }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,255,170,0.10),transparent 70%)', filter: 'blur(40px)', animation: 'tfFloat 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,196,90,0.08),transparent 70%)', filter: 'blur(50px)', animation: 'tfFloat2 22s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '40%', left: '60%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,255,170,0.05),transparent 70%)', filter: 'blur(40px)', animation: 'tfFloat 26s ease-in-out infinite' }} />
      </div>
    </>
  );

  if (loading) return (
    <main style={{ background: '#040e08', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#00ffaa', fontFamily: HEAD, fontSize: 15 }}>Loading…</div>
    </main>
  );

  if (!profile) return (
    <main style={{ background: '#040e08', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, position: 'relative' }}>
      <Atmosphere />
      <div style={{ fontSize: 40, zIndex: 1 }}>🌿</div>
      <p style={{ color: '#aaf0d2', fontFamily: BODY, fontSize: 15, zIndex: 1 }}>Sign in to view your profile.</p>
      <Link href="/dashboard/garden" style={{ ...btn, zIndex: 1 }}>Sign In →</Link>
    </main>
  );

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '🏡' },
    { id: 'blueprints', label: 'Blueprints', icon: '🗺️' },
    { id: 'account', label: 'Account', icon: '⚙️' },
    { id: 'billing', label: 'Billing', icon: '💳' },
  ] as const;

  return (
    <main style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%,#0c2418,#040e08 60%)', minHeight: '100vh', color: '#d2fcea', fontFamily: BODY, position: 'relative', WebkitFontSmoothing: 'antialiased' }}>
      <Atmosphere />

      {/* Top nav — Back to App restored */}
      <nav style={{ position: 'relative', zIndex: 2, padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,255,170,0.08)', maxWidth: 980, margin: '0 auto' }}>
        <Link href="/dashboard/garden" style={btnGhost}>← Back to App</Link>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 11, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(200,230,212,0.7)', fontSize: 13, fontWeight: 600, fontFamily: BODY }}>
          ⏻ Log out
        </button>
      </nav>

      {msg && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 100, padding: '10px 20px', borderRadius: 12, background: 'rgba(0,255,170,0.14)', border: '1px solid rgba(0,255,170,0.35)', fontSize: 13, color: '#00ffaa', backdropFilter: 'blur(10px)', fontWeight: 600 }}>{msg}</div>
      )}

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 980, margin: '0 auto', padding: '36px 28px 90px' }}>

        {/* Hero header */}
        <div className="tf-up" style={{ ...glass, padding: '30px 34px', marginBottom: 26, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,255,170,0.4),transparent)' }} />
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,255,170,0.28),rgba(0,196,122,0.08))', border: '2px solid rgba(0,255,170,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0, boxShadow: '0 0 30px rgba(0,255,170,0.15)' }}>🌿</div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, color: '#f2fffa', fontSize: 22, marginBottom: 4, letterSpacing: '-.01em' }}>{profile.name || 'Homesteader'}</div>
            <div style={{ fontSize: 13, color: 'rgba(170,240,210,0.55)' }}>{profile.email}</div>
            {memberSince && <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.35)', marginTop: 5 }}>Member since {memberSince}</div>}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 99, fontSize: 12, fontWeight: 700, fontFamily: HEAD, background: isPro ? 'rgba(0,255,170,0.14)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isPro ? 'rgba(0,255,170,0.35)' : 'rgba(255,255,255,0.12)'}`, color: isPro ? '#00ffaa' : 'rgba(200,230,212,0.5)' }}>
            {isPro ? '✦ Pro Member' : 'Free Plan'}
          </div>
        </div>

        {/* Nav pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 26, flexWrap: 'wrap' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: activeSection === item.id ? 700 : 500, fontFamily: HEAD, background: activeSection === item.id ? 'rgba(0,255,170,0.13)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeSection === item.id ? 'rgba(0,255,170,0.32)' : 'rgba(255,255,255,0.07)'}`, color: activeSection === item.id ? '#00ffaa' : 'rgba(200,230,212,0.6)', boxShadow: activeSection === item.id ? '0 0 16px rgba(0,255,170,0.12)' : 'none', transition: 'all .15s' }}>
              <span style={{ fontFamily: BODY }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeSection === 'overview' && (
          <div className="tf-up" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h1 style={{ fontFamily: HEAD, fontSize: 25, fontWeight: 800, color: '#f2fffa', margin: 0, letterSpacing: '-.02em' }}>Welcome back, {firstName} 🌱</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {[
                { label: 'Blueprints', value: saves.length, icon: '🗺️' },
                { label: 'Plan', value: isPro ? 'Pro' : 'Free', icon: '✦' },
                { label: 'Canvas Tiles', value: (() => { try { const c = localStorage.getItem('tf-canvas-v1'); return c ? Object.keys(JSON.parse(c)).length : 0; } catch { return 0; } })(), icon: '🌿' },
              ].map(s => (
                <div key={s.label} style={{ ...glass, padding: '24px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: HEAD, fontSize: 25, fontWeight: 800, color: '#f2fffa', marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.5)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {saves.length > 0 && (
              <div style={{ ...glass, overflow: 'hidden' }}>
                <div style={{ padding: '15px 24px', borderBottom: '1px solid rgba(0,255,170,0.08)', fontFamily: HEAD, fontWeight: 700, fontSize: 13, color: '#00ffaa' }}>Recent Blueprints</div>
                {saves.slice(0, 3).map(s => (
                  <div key={s.key} style={{ padding: '15px 24px', borderBottom: '1px solid rgba(0,255,170,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#d2fcea', marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.4)' }}>{new Date(s.savedAt).toLocaleDateString()}</div>
                    </div>
                    <Link href="/dashboard/garden" style={{ fontSize: 12, color: '#00ffaa', textDecoration: 'none', fontWeight: 600 }}>Open →</Link>
                  </div>
                ))}
              </div>
            )}

            {!isPro && (
              <div style={{ ...glass, padding: '28px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, border: '1px solid rgba(0,255,170,0.22)' }}>
                <div>
                  <div style={{ fontFamily: HEAD, fontWeight: 800, color: '#f2fffa', fontSize: 17, marginBottom: 5 }}>Unlock TerraForge Pro</div>
                  <div style={{ fontSize: 13, color: '#aaf0d2' }}>Unlimited blueprints, satellite canvas, shopping lists & more</div>
                </div>
                <button onClick={() => setShowUpgrade(true)} style={{ ...btn, whiteSpace: 'nowrap' }}>Upgrade →</button>
              </div>
            )}
          </div>
        )}

        {/* ── Blueprints ── */}
        {activeSection === 'blueprints' && (
          <div className="tf-up">
            <h2 style={{ fontFamily: HEAD, fontSize: 21, fontWeight: 800, color: '#f2fffa', margin: '0 0 20px', letterSpacing: '-.01em' }}>Saved Blueprints</h2>
            {saves.length === 0 ? (
              <div style={{ ...glass, textAlign: 'center', padding: '52px 32px' }}>
                <div style={{ fontSize: 38, marginBottom: 14 }}>🗺️</div>
                <p style={{ color: '#aaf0d2', fontSize: 14, marginBottom: 22 }}>No blueprints saved yet.</p>
                <Link href="/dashboard/garden" style={btn}>Generate Your First Blueprint →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {saves.map(s => {
                  const tileCount = s.data?.blueprints?.flatMap((b: any) => b.tiles ?? []).length ?? 0;
                  const climate = s.data?.properties?.[0]?.climateZone ?? s.data?.formValues?.climateZone ?? null;
                  return (
                    <div key={s.key} style={{ ...glass, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 16, borderRadius: 16 }}>
                      <div style={{ fontSize: 26, flexShrink: 0 }}>🌿</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: HEAD, fontWeight: 700, color: '#f2fffa', fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, color: 'rgba(170,240,210,0.5)' }}>{new Date(s.savedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          {tileCount > 0 && <span style={{ fontSize: 11, color: 'rgba(170,240,210,0.5)' }}>· {tileCount} tiles</span>}
                          {climate && <span style={{ fontSize: 11, color: 'rgba(170,240,210,0.5)' }}>· {climate}</span>}
                        </div>
                      </div>
                      <Link href="/dashboard/garden" style={{ fontSize: 12, color: '#00ffaa', textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}>Load →</Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Account ── */}
        {activeSection === 'account' && (
          <div className="tf-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontFamily: HEAD, fontSize: 21, fontWeight: 800, color: '#f2fffa', margin: 0, letterSpacing: '-.01em' }}>Account Settings</h2>

            <div style={{ ...glass, padding: '24px 26px' }}>
              <div style={{ fontFamily: HEAD, fontWeight: 700, color: '#f2fffa', fontSize: 14, marginBottom: 14 }}>Display Name</div>
              {editingName ? (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <input value={editName} onChange={e => setEditName(e.target.value)} style={{ ...input, flex: 1, minWidth: 160 }} />
                  <button onClick={saveName} disabled={savingName} style={{ padding: '11px 18px', borderRadius: 10, cursor: 'pointer', background: 'rgba(0,255,170,0.15)', border: '1px solid rgba(0,255,170,0.3)', color: '#00ffaa', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{savingName ? '…' : 'Save'}</button>
                  <button onClick={() => setEditingName(false)} style={{ padding: '11px 18px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(200,230,212,0.5)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: '#aaf0d2' }}>{profile.name || '(not set)'}</span>
                  <button onClick={() => setEditingName(true)} style={{ padding: '7px 14px', borderRadius: 8, cursor: 'pointer', background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.2)', color: '#00ffaa', fontWeight: 600, fontSize: 12 }}>Edit</button>
                </div>
              )}
            </div>

            <div style={{ ...glass, padding: '24px 26px' }}>
              <div style={{ fontFamily: HEAD, fontWeight: 700, color: '#f2fffa', fontSize: 14, marginBottom: 8 }}>Email Address</div>
              <p style={{ fontSize: 14, color: '#aaf0d2', margin: 0 }}>{profile.email}</p>
              <p style={{ fontSize: 11, color: 'rgba(170,240,210,0.4)', margin: '8px 0 0' }}>To change your email, contact <a href="mailto:support@terraforgehome.com" style={{ color: 'rgba(0,255,170,0.6)', textDecoration: 'none' }}>support@terraforgehome.com</a></p>
            </div>

            <div style={{ ...glass, padding: '18px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, border: '1px solid rgba(255,90,90,0.14)' }}>
              <div>
                <div style={{ fontFamily: HEAD, fontWeight: 700, color: 'rgba(255,130,130,0.92)', fontSize: 14 }}>Delete Account</div>
                <div style={{ fontSize: 12, color: 'rgba(170,240,210,0.4)', marginTop: 2 }}>Permanently remove your account and all data</div>
              </div>
              <button onClick={() => setShowDeleteInfo(v => !v)} style={{ padding: '8px 16px', borderRadius: 9, cursor: 'pointer', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff8080', fontWeight: 600, fontSize: 12, flexShrink: 0 }}>Delete Account</button>
            </div>
            {showDeleteInfo && (
              <div style={{ borderRadius: 14, padding: '16px 22px', background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(255,80,80,0.15)' }}>
                <p style={{ fontSize: 13, color: 'rgba(255,180,180,0.82)', margin: 0, lineHeight: 1.7 }}>
                  To permanently delete your account, email <a href="mailto:support@terraforgehome.com?subject=Delete%20My%20Account" style={{ color: '#ff8080', textDecoration: 'none', fontWeight: 600 }}>support@terraforgehome.com</a> from your registered address ({profile.email}). We'll process your request and erase all associated data within 7 days.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Billing ── */}
        {activeSection === 'billing' && (
          <div className="tf-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ fontFamily: HEAD, fontSize: 21, fontWeight: 800, color: '#f2fffa', margin: 0, letterSpacing: '-.01em' }}>Billing & Plan</h2>

            <div style={{ ...glass, padding: '28px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, border: isPro ? '1px solid rgba(0,255,170,0.25)' : '1px solid rgba(0,255,170,0.12)' }}>
              <div>
                <div style={{ fontFamily: HEAD, fontWeight: 800, color: isPro ? '#00ffaa' : '#f2fffa', fontSize: 21, marginBottom: 4 }}>{isPro ? '✦ Pro Plan' : 'Free Plan'}</div>
                <div style={{ fontSize: 13, color: '#aaf0d2' }}>{isPro ? 'Full access to all TerraForge features' : 'Core blueprint generator + seasonal calendar'}</div>
              </div>
              {isPro && <div style={{ fontFamily: HEAD, fontWeight: 800, color: '#00ffaa', fontSize: 18 }}>Active</div>}
            </div>

            {!isPro && (
              <div style={{ ...glass, padding: '26px 30px' }}>
                <div style={{ fontFamily: HEAD, fontWeight: 800, color: '#f2fffa', fontSize: 16, marginBottom: 16 }}>Upgrade to Pro</div>
                <ul style={{ margin: '0 0 22px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Unlimited blueprint saves', 'Multiple properties', 'Satellite Property Canvas', 'AI property analysis', 'Shopping list PDF export'].map(f => (
                    <li key={f} style={{ fontSize: 13, color: '#aaf0d2' }}>{f}</li>
                  ))}
                </ul>
                <button onClick={() => setShowUpgrade(true)} style={btn}>Choose a Plan →</button>
              </div>
            )}

            {isPro && cancelFlow === 'idle' && (
              <>
                <div style={{ ...glass, padding: '22px 26px' }}>
                  <div style={{ fontFamily: HEAD, fontWeight: 700, color: '#f2fffa', fontSize: 14, marginBottom: 10 }}>Switch to Annual — Save 27%</div>
                  <p style={{ fontSize: 13, color: '#aaf0d2', margin: '0 0 18px' }}>$79/year instead of $108/year on monthly. Prorated automatically.</p>
                  <button onClick={() => startCheckout('annual')} disabled={upgradeLoading} style={btn}>{upgradeLoading ? 'Redirecting…' : 'Switch to Annual →'}</button>
                </div>
                <div style={{ ...glass, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, border: '1px solid rgba(255,90,90,0.12)' }}>
                  <div>
                    <div style={{ fontFamily: HEAD, fontWeight: 700, color: 'rgba(255,130,130,0.92)', fontSize: 13 }}>Cancel Subscription</div>
                    <div style={{ fontSize: 12, color: 'rgba(170,240,210,0.4)', marginTop: 2 }}>Pro access continues until end of billing period</div>
                  </div>
                  <button onClick={() => setCancelFlow('confirm')} style={{ padding: '8px 16px', borderRadius: 9, cursor: 'pointer', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff8080', fontWeight: 600, fontSize: 12, flexShrink: 0 }}>Cancel</button>
                </div>
              </>
            )}

            {isPro && cancelFlow === 'confirm' && (
              <div style={{ borderRadius: 18, padding: '24px 28px', border: '1px solid rgba(255,80,80,0.25)', background: 'rgba(255,80,80,0.05)' }}>
                <p style={{ fontSize: 14, color: '#f2fffa', margin: '0 0 16px', fontWeight: 600 }}>Are you sure you want to cancel Pro?</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={cancelSubscription} disabled={cancelLoading} style={{ padding: '10px 20px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.35)', color: '#ff8080', fontWeight: 700, fontSize: 13 }}>{cancelLoading ? 'Cancelling…' : 'Yes, Cancel'}</button>
                  <button onClick={() => setCancelFlow('idle')} style={{ padding: '10px 20px', borderRadius: 10, cursor: 'pointer', background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.2)', color: '#00ffaa', fontWeight: 700, fontSize: 13 }}>Keep Pro</button>
                </div>
              </div>
            )}

            {cancelFlow === 'done' && (
              <div style={{ ...glass, padding: '22px 26px', border: '1px solid rgba(0,255,170,0.15)' }}>
                <p style={{ fontSize: 14, color: '#aaf0d2', margin: 0 }}>✓ Subscription cancelled. Pro access continues until the end of your billing period.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Upgrade Modal ── */}
      {showUpgrade && (
        <div onClick={() => setShowUpgrade(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(4,14,8,0.82)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 440, borderRadius: 24, background: 'linear-gradient(160deg,rgba(12,36,24,0.96),rgba(6,16,11,0.98))', border: '1px solid rgba(0,255,170,0.22)', padding: '34px 30px', position: 'relative', boxShadow: '0 24px 70px rgba(0,0,0,0.5)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,255,170,0.4),transparent)' }} />
            <button onClick={() => setShowUpgrade(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: 'rgba(170,240,210,0.4)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: 26 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>✦</div>
              <h3 style={{ fontFamily: HEAD, fontSize: 23, fontWeight: 800, color: '#f2fffa', margin: '0 0 6px' }}>Upgrade to Pro</h3>
              <p style={{ fontSize: 13, color: '#aaf0d2', margin: 0 }}>Choose the plan that works for you</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <button onClick={() => setUpgradePlan('annual')} style={{ textAlign: 'left', padding: '18px 20px', borderRadius: 16, cursor: 'pointer', background: upgradePlan === 'annual' ? 'rgba(0,255,170,0.1)' : 'rgba(255,255,255,0.03)', border: `2px solid ${upgradePlan === 'annual' ? 'rgba(0,255,170,0.5)' : 'rgba(255,255,255,0.08)'}`, position: 'relative', transition: 'all .15s' }}>
                <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: 'rgba(0,255,170,0.2)', color: '#00ffaa', letterSpacing: '.05em', fontFamily: HEAD }}>SAVE 27%</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${upgradePlan === 'annual' ? '#00ffaa' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{upgradePlan === 'annual' && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#00ffaa' }} />}</div>
                  <span style={{ fontFamily: HEAD, fontWeight: 700, color: '#f2fffa', fontSize: 15 }}>Annual</span>
                </div>
                <div style={{ fontSize: 13, color: '#aaf0d2', marginLeft: 28 }}><span style={{ fontWeight: 800, color: '#f2fffa', fontSize: 18 }}>$79</span>/year · just $6.58/mo</div>
              </button>

              <button onClick={() => setUpgradePlan('monthly')} style={{ textAlign: 'left', padding: '18px 20px', borderRadius: 16, cursor: 'pointer', background: upgradePlan === 'monthly' ? 'rgba(0,255,170,0.1)' : 'rgba(255,255,255,0.03)', border: `2px solid ${upgradePlan === 'monthly' ? 'rgba(0,255,170,0.5)' : 'rgba(255,255,255,0.08)'}`, transition: 'all .15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${upgradePlan === 'monthly' ? '#00ffaa' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{upgradePlan === 'monthly' && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#00ffaa' }} />}</div>
                  <span style={{ fontFamily: HEAD, fontWeight: 700, color: '#f2fffa', fontSize: 15 }}>Monthly</span>
                </div>
                <div style={{ fontSize: 13, color: '#aaf0d2', marginLeft: 28 }}><span style={{ fontWeight: 800, color: '#f2fffa', fontSize: 18 }}>$9</span>/month</div>
              </button>
            </div>

            <button onClick={() => startCheckout(upgradePlan)} disabled={upgradeLoading} style={{ ...btn, width: '100%', padding: '14px', fontSize: 15 }}>
              {upgradeLoading ? 'Redirecting to checkout…' : `Continue with ${upgradePlan === 'annual' ? 'Annual' : 'Monthly'} →`}
            </button>
            <p style={{ fontSize: 11, color: 'rgba(170,240,210,0.4)', textAlign: 'center', margin: '14px 0 0' }}>Secure checkout via Stripe · Cancel anytime</p>
          </div>
        </div>
      )}
    </main>
  );
}
