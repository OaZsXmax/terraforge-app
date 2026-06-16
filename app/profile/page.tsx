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

  const card: React.CSSProperties = {
    borderRadius: 16, border: '1px solid rgba(0,255,170,0.1)', background: 'rgba(8,22,14,0.6)',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
    background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.18)',
    color: '#d2fcea', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
  };
  const btnPrimary: React.CSSProperties = {
    padding: '11px 24px', borderRadius: 11, cursor: 'pointer', border: 'none',
    background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15',
    fontWeight: 700, fontSize: 14, fontFamily: "'Space Grotesk', sans-serif",
    textDecoration: 'none', display: 'inline-block',
  };

  if (loading) return (
    <main style={{ background: '#0a1f15', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#00ffaa', fontFamily: "'Space Grotesk', sans-serif", fontSize: 15 }}>Loading…</div>
    </main>
  );

  if (!profile) return (
    <main style={{ background: '#0a1f15', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 40 }}>🌿</div>
      <p style={{ color: '#aaf0d2', fontFamily: "'Inter', sans-serif", fontSize: 15 }}>Sign in to view your profile.</p>
      <Link href="/dashboard/garden" style={btnPrimary as any}>Sign In →</Link>
    </main>
  );

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '🏡' },
    { id: 'blueprints', label: 'Blueprints', icon: '🗺️' },
    { id: 'account', label: 'Account', icon: '⚙️' },
    { id: 'billing', label: 'Billing', icon: '💳' },
  ] as const;

  return (
    <main style={{ background: 'radial-gradient(ellipse at top,#0d2719,#0a1f15)', minHeight: '100vh', color: '#d2fcea', fontFamily: "'Inter', sans-serif" }}>

      <nav style={{ padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,255,170,0.08)', maxWidth: 960, margin: '0 auto' }}>
        <Link href="/dashboard/garden" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: '#00ffaa', textDecoration: 'none' }}>🌿 TerraForge</Link>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(200,230,212,0.7)', fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
          ⏻ Log out
        </button>
      </nav>

      {msg && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 100, padding: '10px 20px', borderRadius: 11, background: 'rgba(0,255,170,0.12)', border: '1px solid rgba(0,255,170,0.3)', fontSize: 13, color: '#00ffaa', backdropFilter: 'blur(8px)' }}>{msg}</div>
      )}

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 28px 80px' }}>

        <div style={{ ...card, padding: '28px 32px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,255,170,0.25),rgba(0,196,122,0.1))', border: '2px solid rgba(0,255,170,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>🌿</div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 20, marginBottom: 3 }}>{profile.name || 'Homesteader'}</div>
            <div style={{ fontSize: 13, color: 'rgba(170,240,210,0.55)' }}>{profile.email}</div>
            {memberSince && <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.35)', marginTop: 4 }}>Member since {memberSince}</div>}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: isPro ? 'rgba(0,255,170,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isPro ? 'rgba(0,255,170,0.3)' : 'rgba(255,255,255,0.12)'}`, color: isPro ? '#00ffaa' : 'rgba(200,230,212,0.5)' }}>
            {isPro ? '✦ Pro Member' : 'Free Plan'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 11, cursor: 'pointer', fontSize: 13, fontWeight: activeSection === item.id ? 700 : 500, background: activeSection === item.id ? 'rgba(0,255,170,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeSection === item.id ? 'rgba(0,255,170,0.3)' : 'rgba(255,255,255,0.08)'}`, color: activeSection === item.id ? '#00ffaa' : 'rgba(200,230,212,0.6)', fontFamily: "'Inter', sans-serif" }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        {activeSection === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 800, color: '#f2fffa', margin: 0 }}>Welcome back, {firstName} 🌱</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {[
                { label: 'Blueprints', value: saves.length, icon: '🗺️' },
                { label: 'Plan', value: isPro ? 'Pro' : 'Free', icon: '✦' },
                { label: 'Canvas Tiles', value: (() => { try { const c = localStorage.getItem('tf-canvas-v1'); return c ? Object.keys(JSON.parse(c)).length : 0; } catch { return 0; } })(), icon: '🌿' },
              ].map(s => (
                <div key={s.label} style={{ ...card, padding: '22px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 800, color: '#f2fffa', marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.5)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {saves.length > 0 && (
              <div style={{ ...card, overflow: 'hidden' }}>
                <div style={{ padding: '14px 22px', borderBottom: '1px solid rgba(0,255,170,0.08)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: '#00ffaa' }}>Recent Blueprints</div>
                {saves.slice(0, 3).map(s => (
                  <div key={s.key} style={{ padding: '14px 22px', borderBottom: '1px solid rgba(0,255,170,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <div style={{ borderRadius: 16, padding: '26px 28px', background: 'linear-gradient(135deg,rgba(0,255,170,0.08),rgba(4,14,8,0.6))', border: '1px solid rgba(0,255,170,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 16, marginBottom: 4 }}>Unlock TerraForge Pro</div>
                  <div style={{ fontSize: 13, color: '#aaf0d2' }}>Unlimited blueprints, satellite canvas, shopping lists & more</div>
                </div>
                <button onClick={() => setShowUpgrade(true)} style={{ ...btnPrimary, whiteSpace: 'nowrap' }}>Upgrade →</button>
              </div>
            )}
          </div>
        )}

        {activeSection === 'blueprints' && (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 800, color: '#f2fffa', margin: '0 0 20px' }}>Saved Blueprints</h2>
            {saves.length === 0 ? (
              <div style={{ ...card, textAlign: 'center', padding: '48px 32px' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🗺️</div>
                <p style={{ color: '#aaf0d2', fontSize: 14, marginBottom: 20 }}>No blueprints saved yet.</p>
                <Link href="/dashboard/garden" style={btnPrimary as any}>Generate Your First Blueprint →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {saves.map(s => {
                  const tileCount = s.data?.blueprints?.flatMap((b: any) => b.tiles ?? []).length ?? 0;
                  const climate = s.data?.properties?.[0]?.climateZone ?? s.data?.formValues?.climateZone ?? null;
                  return (
                    <div key={s.key} style={{ ...card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ fontSize: 26, flexShrink: 0 }}>🌿</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</div>
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

        {activeSection === 'account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 800, color: '#f2fffa', margin: 0 }}>Account Settings</h2>

            <div style={{ ...card, padding: '22px 24px' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 14, marginBottom: 14 }}>Display Name</div>
              {editingName ? (
                <div style={{ display: 'flex', gap: 10 }}>
                  <input value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} />
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

            <div style={{ ...card, padding: '22px 24px' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 14, marginBottom: 8 }}>Email Address</div>
              <p style={{ fontSize: 14, color: '#aaf0d2', margin: 0 }}>{profile.email}</p>
              <p style={{ fontSize: 11, color: 'rgba(170,240,210,0.4)', margin: '8px 0 0' }}>To change your email, contact <a href="mailto:support@terraforgehome.com" style={{ color: 'rgba(0,255,170,0.6)', textDecoration: 'none' }}>support@terraforgehome.com</a></p>
            </div>

            <div style={{ ...card, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: 'rgba(255,130,130,0.9)', fontSize: 14 }}>Delete Account</div>
                <div style={{ fontSize: 12, color: 'rgba(170,240,210,0.4)', marginTop: 2 }}>Permanently remove your account and all data</div>
              </div>
              <button onClick={() => setShowDeleteInfo(v => !v)} style={{ padding: '8px 16px', borderRadius: 9, cursor: 'pointer', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff8080', fontWeight: 600, fontSize: 12, flexShrink: 0 }}>Delete Account</button>
            </div>
            {showDeleteInfo && (
              <div style={{ borderRadius: 12, padding: '16px 20px', background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(255,80,80,0.15)' }}>
                <p style={{ fontSize: 13, color: 'rgba(255,180,180,0.8)', margin: 0, lineHeight: 1.7 }}>
                  To permanently delete your account, email <a href="mailto:support@terraforgehome.com?subject=Delete%20My%20Account" style={{ color: '#ff8080', textDecoration: 'none', fontWeight: 600 }}>support@terraforgehome.com</a> from your registered address ({profile.email}). We'll process your request and erase all associated data within 7 days.
                </p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'billing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 800, color: '#f2fffa', margin: 0 }}>Billing & Plan</h2>

            <div style={{ borderRadius: 16, padding: '26px 28px', border: `1px solid ${isPro ? 'rgba(0,255,170,0.25)' : 'rgba(255,255,255,0.1)'}`, background: isPro ? 'rgba(0,255,170,0.05)' : 'rgba(8,22,14,0.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: isPro ? '#00ffaa' : '#f2fffa', fontSize: 20, marginBottom: 4 }}>{isPro ? '✦ Pro Plan' : 'Free Plan'}</div>
                <div style={{ fontSize: 13, color: '#aaf0d2' }}>{isPro ? 'Full access to all TerraForge features' : 'Core blueprint generator + seasonal calendar'}</div>
              </div>
              {isPro && <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: '#00ffaa', fontSize: 18 }}>Active</div>}
            </div>

            {!isPro && (
              <div style={{ ...card, padding: '24px 28px' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 16, marginBottom: 14 }}>Upgrade to Pro</div>
                <ul style={{ margin: '0 0 20px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {['Unlimited blueprint saves', 'Multiple properties', 'Satellite Property Canvas', 'AI property analysis', 'Shopping list PDF export'].map(f => (
                    <li key={f} style={{ fontSize: 13, color: '#aaf0d2' }}>{f}</li>
                  ))}
                </ul>
                <button onClick={() => setShowUpgrade(true)} style={btnPrimary}>Choose a Plan →</button>
              </div>
            )}

            {isPro && cancelFlow === 'idle' && (
              <>
                <div style={{ ...card, padding: '20px 24px' }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 14, marginBottom: 10 }}>Switch to Annual — Save 27%</div>
                  <p style={{ fontSize: 13, color: '#aaf0d2', margin: '0 0 16px' }}>$79/year instead of $108/year on monthly. Prorated automatically.</p>
                  <button onClick={() => startCheckout('annual')} disabled={upgradeLoading} style={btnPrimary}>{upgradeLoading ? 'Redirecting…' : 'Switch to Annual →'}</button>
                </div>
                <div style={{ ...card, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, borderColor: 'rgba(255,80,80,0.12)' }}>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: 'rgba(255,130,130,0.9)', fontSize: 13 }}>Cancel Subscription</div>
                    <div style={{ fontSize: 12, color: 'rgba(170,240,210,0.4)', marginTop: 2 }}>Pro access continues until end of billing period</div>
                  </div>
                  <button onClick={() => setCancelFlow('confirm')} style={{ padding: '8px 16px', borderRadius: 9, cursor: 'pointer', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff8080', fontWeight: 600, fontSize: 12, flexShrink: 0 }}>Cancel</button>
                </div>
              </>
            )}

            {isPro && cancelFlow === 'confirm' && (
              <div style={{ borderRadius: 16, padding: '22px 26px', border: '1px solid rgba(255,80,80,0.25)', background: 'rgba(255,80,80,0.05)' }}>
                <p style={{ fontSize: 14, color: '#f2fffa', margin: '0 0 16px', fontWeight: 600 }}>Are you sure you want to cancel Pro?</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={cancelSubscription} disabled={cancelLoading} style={{ padding: '10px 20px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.35)', color: '#ff8080', fontWeight: 700, fontSize: 13 }}>{cancelLoading ? 'Cancelling…' : 'Yes, Cancel'}</button>
                  <button onClick={() => setCancelFlow('idle')} style={{ padding: '10px 20px', borderRadius: 10, cursor: 'pointer', background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.2)', color: '#00ffaa', fontWeight: 700, fontSize: 13 }}>Keep Pro</button>
                </div>
              </div>
            )}

            {cancelFlow === 'done' && (
              <div style={{ ...card, padding: '20px 24px', borderColor: 'rgba(0,255,170,0.15)' }}>
                <p style={{ fontSize: 14, color: '#aaf0d2', margin: 0 }}>✓ Subscription cancelled. Pro access continues until the end of your billing period.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showUpgrade && (
        <div onClick={() => setShowUpgrade(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(4,14,8,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 440, borderRadius: 22, background: '#0d2719', border: '1px solid rgba(0,255,170,0.2)', padding: '32px 28px', position: 'relative' }}>
            <button onClick={() => setShowUpgrade(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: 'rgba(170,240,210,0.4)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>✦</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#f2fffa', margin: '0 0 6px' }}>Upgrade to Pro</h3>
              <p style={{ fontSize: 13, color: '#aaf0d2', margin: 0 }}>Choose the plan that works for you</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <button onClick={() => setUpgradePlan('annual')} style={{ textAlign: 'left', padding: '18px 20px', borderRadius: 14, cursor: 'pointer', background: upgradePlan === 'annual' ? 'rgba(0,255,170,0.1)' : 'rgba(255,255,255,0.03)', border: `2px solid ${upgradePlan === 'annual' ? 'rgba(0,255,170,0.5)' : 'rgba(255,255,255,0.08)'}`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: 'rgba(0,255,170,0.2)', color: '#00ffaa', letterSpacing: '.05em' }}>SAVE 27%</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${upgradePlan === 'annual' ? '#00ffaa' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{upgradePlan === 'annual' && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#00ffaa' }} />}</div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 15 }}>Annual</span>
                </div>
                <div style={{ fontSize: 13, color: '#aaf0d2', marginLeft: 28 }}><span style={{ fontWeight: 800, color: '#f2fffa', fontSize: 18 }}>$79</span>/year · just $6.58/mo</div>
              </button>

              <button onClick={() => setUpgradePlan('monthly')} style={{ textAlign: 'left', padding: '18px 20px', borderRadius: 14, cursor: 'pointer', background: upgradePlan === 'monthly' ? 'rgba(0,255,170,0.1)' : 'rgba(255,255,255,0.03)', border: `2px solid ${upgradePlan === 'monthly' ? 'rgba(0,255,170,0.5)' : 'rgba(255,255,255,0.08)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${upgradePlan === 'monthly' ? '#00ffaa' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{upgradePlan === 'monthly' && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#00ffaa' }} />}</div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 15 }}>Monthly</span>
                </div>
                <div style={{ fontSize: 13, color: '#aaf0d2', marginLeft: 28 }}><span style={{ fontWeight: 800, color: '#f2fffa', fontSize: 18 }}>$9</span>/month</div>
              </button>
            </div>

            <button onClick={() => startCheckout(upgradePlan)} disabled={upgradeLoading} style={{ ...btnPrimary, width: '100%', padding: '14px', fontSize: 15 }}>
              {upgradeLoading ? 'Redirecting to checkout…' : `Continue with ${upgradePlan === 'annual' ? 'Annual' : 'Monthly'} →`}
            </button>
            <p style={{ fontSize: 11, color: 'rgba(170,240,210,0.4)', textAlign: 'center', margin: '14px 0 0' }}>Secure checkout via Stripe · Cancel anytime</p>
          </div>
        </div>
      )}
    </main>
  );
}
