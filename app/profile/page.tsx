'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Save = { key: string; label: string; savedAt: string; data: any };
type Profile = { name: string; email: string; plan: string; saves: Save[]; created_at?: string };

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'blueprints' | 'account' | 'billing'>('overview');
  const [editName, setEditName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [cancelFlow, setCancelFlow] = useState<'idle' | 'confirm' | 'done'>('idle');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [annualLoading, setAnnualLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        setEditName(data.name ?? '');
      }
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
    setMsg('Name updated!');
    setTimeout(() => setMsg(''), 3000);
  }

  async function upgradeToAnnual() {
    setAnnualLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ priceId: 'price_1ThhtXBsMVXXOrRddpHo3AHs' }),
    });
    const d = await res.json();
    if (d.url) window.location.href = d.url;
    else { setMsg(d.error ?? 'Error'); setAnnualLoading(false); }
  }

  async function cancelSubscription() {
    setCancelLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const d = await res.json();
    if (d.ok) { setCancelFlow('done'); setProfile(p => p ? { ...p, plan: 'free' } : p); }
    else setMsg(d.error ?? 'Error cancelling');
    setCancelLoading(false);
  }

  const isPro = profile?.plan === 'pro';
  const saves: Save[] = Array.isArray(profile?.saves) ? profile!.saves : [];
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
    background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.18)',
    color: '#d2fcea', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
  };

  if (loading) return (
    <main style={{ background: '#0a1f15', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#00ffaa', fontFamily: "'Space Grotesk', sans-serif", fontSize: 16 }}>Loading…</div>
    </main>
  );

  if (!profile) return (
    <main style={{ background: '#0a1f15', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 40 }}>🌿</div>
      <p style={{ color: '#aaf0d2', fontFamily: "'Inter', sans-serif", fontSize: 15 }}>You need to be signed in to view your profile.</p>
      <Link href="/dashboard/garden" style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
        Sign In →
      </Link>
    </main>
  );

  const navItems = [
    { id: 'overview', label: '🏡 Overview' },
    { id: 'blueprints', label: '🗺️ Blueprints' },
    { id: 'account', label: '⚙️ Account' },
    { id: 'billing', label: '💳 Billing' },
  ] as const;

  return (
    <main style={{ background: '#0a1f15', minHeight: '100vh', color: '#d2fcea', fontFamily: "'Inter', sans-serif" }}>

      {/* Top nav */}
      <nav style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,255,170,0.1)', maxWidth: 1100, margin: '0 auto' }}>
        <Link href="/" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#00ffaa', textDecoration: 'none' }}>🌿 TerraForge</Link>
        <Link href="/dashboard/garden" style={{ padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>← Back to App</Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>

        {/* Sidebar */}
        <aside>
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(0,255,170,0.2),rgba(0,196,122,0.1))', border: '2px solid rgba(0,255,170,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28 }}>
              🌿
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 15, marginBottom: 4 }}>{profile.name || 'Homesteader'}</div>
            <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.5)', marginBottom: 8 }}>{profile.email}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: isPro ? 'rgba(0,255,170,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isPro ? 'rgba(0,255,170,0.3)' : 'rgba(255,255,255,0.12)'}`, color: isPro ? '#00ffaa' : 'rgba(200,230,212,0.5)' }}>
              {isPro ? '✦ Pro' : 'Free'}
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                style={{ padding: '10px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: activeSection === item.id ? 700 : 500, background: activeSection === item.id ? 'rgba(0,255,170,0.1)' : 'transparent', border: `1px solid ${activeSection === item.id ? 'rgba(0,255,170,0.25)' : 'transparent'}`, color: activeSection === item.id ? '#00ffaa' : 'rgba(200,230,212,0.6)' }}>
                {item.label}
              </button>
            ))}
          </nav>

          {memberSince && (
            <p style={{ fontSize: 10, color: 'rgba(170,240,210,0.3)', textAlign: 'center', marginTop: 24 }}>Member since {memberSince}</p>
          )}
        </aside>

        {/* Main content */}
        <div>
          {msg && <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 10, background: 'rgba(0,255,170,0.1)', border: '1px solid rgba(0,255,170,0.25)', fontSize: 13, color: '#00ffaa' }}>{msg}</div>}

          {/* ── Overview ── */}
          {activeSection === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 800, color: '#f2fffa', margin: 0 }}>
                Welcome back, {(profile.name || 'Homesteader').split(' ')[0]} 🌱
              </h1>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                {[
                  { label: 'Blueprints Saved', value: saves.length, icon: '🗺️' },
                  { label: 'Plan', value: isPro ? 'Pro' : 'Free', icon: '✦' },
                  { label: 'Canvas Tiles', value: (() => { try { const c = localStorage.getItem('tf-canvas-v1'); return c ? Object.keys(JSON.parse(c)).length : 0; } catch { return 0; } })(), icon: '🌿' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '20px 16px', borderRadius: 16, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#f2fffa', marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.5)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent saves */}
              {saves.length > 0 && (
                <div style={{ borderRadius: 16, border: '1px solid rgba(0,255,170,0.1)', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(0,255,170,0.08)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: '#00ffaa' }}>Recent Blueprints</div>
                  {saves.slice(0, 3).map(s => (
                    <div key={s.key} style={{ padding: '14px 20px', borderBottom: '1px solid rgba(0,255,170,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <div style={{ padding: '24px', borderRadius: 16, background: 'linear-gradient(135deg,rgba(0,255,170,0.07),rgba(4,14,8,0.9))', border: '1px solid rgba(0,255,170,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 15, marginBottom: 4 }}>Upgrade to Pro</div>
                    <div style={{ fontSize: 13, color: '#aaf0d2' }}>Unlimited blueprints, satellite canvas, shopping list & more</div>
                  </div>
                  <Link href="/dashboard/garden" style={{ padding: '10px 22px', borderRadius: 10, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif", whiteSpace: 'nowrap' }}>
                    Upgrade — from $9/mo →
                  </Link>
                </div>
              )}

              <Link href="/dashboard/garden" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 12, background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.2)', color: '#00ffaa', textDecoration: 'none', fontWeight: 700, fontSize: 14, fontFamily: "'Space Grotesk', sans-serif" }}>
                Open TerraForge App →
              </Link>
            </div>
          )}

          {/* ── Blueprints ── */}
          {activeSection === 'blueprints' && (
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#f2fffa', margin: '0 0 20px' }}>Saved Blueprints</h2>
              {saves.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 32px', borderRadius: 16, background: 'rgba(0,255,170,0.03)', border: '1px solid rgba(0,255,170,0.1)' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🗺️</div>
                  <p style={{ color: '#aaf0d2', fontSize: 14, marginBottom: 20 }}>No blueprints saved yet.</p>
                  <Link href="/dashboard/garden" style={{ padding: '10px 22px', borderRadius: 10, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Generate Your First Blueprint →</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {saves.map(s => {
                    const tileCount = s.data?.blueprints?.flatMap((b: any) => b.tiles ?? []).length ?? 0;
                    const climate = s.data?.properties?.[0]?.climateZone ?? s.data?.formValues?.climateZone ?? null;
                    return (
                      <div key={s.key} style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(0,255,170,0.03)', border: '1px solid rgba(0,255,170,0.1)', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ fontSize: 28, flexShrink: 0 }}>🌿</div>
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

          {/* ── Account ── */}
          {activeSection === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#f2fffa', margin: 0 }}>Account Settings</h2>

              <div style={{ padding: '24px', borderRadius: 16, border: '1px solid rgba(0,255,170,0.12)', background: 'rgba(0,255,170,0.02)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 14, marginBottom: 16 }}>Display Name</div>
                {editingName ? (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} />
                    <button onClick={saveName} disabled={savingName} style={{ padding: '10px 18px', borderRadius: 10, cursor: 'pointer', background: 'rgba(0,255,170,0.15)', border: '1px solid rgba(0,255,170,0.3)', color: '#00ffaa', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {savingName ? '…' : 'Save'}
                    </button>
                    <button onClick={() => setEditingName(false)} style={{ padding: '10px 18px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(200,230,212,0.5)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: '#aaf0d2' }}>{profile.name || '(not set)'}</span>
                    <button onClick={() => setEditingName(true)} style={{ padding: '7px 14px', borderRadius: 8, cursor: 'pointer', background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.2)', color: '#00ffaa', fontWeight: 600, fontSize: 12 }}>Edit</button>
                  </div>
                )}
              </div>

              <div style={{ padding: '24px', borderRadius: 16, border: '1px solid rgba(0,255,170,0.12)', background: 'rgba(0,255,170,0.02)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 14, marginBottom: 8 }}>Email Address</div>
                <p style={{ fontSize: 14, color: '#aaf0d2', margin: 0 }}>{profile.email}</p>
                <p style={{ fontSize: 11, color: 'rgba(170,240,210,0.4)', margin: '8px 0 0' }}>To change your email, contact <a href="mailto:support@terraforgehome.com" style={{ color: 'rgba(0,255,170,0.6)', textDecoration: 'none' }}>support@terraforgehome.com</a></p>
              </div>

              <div style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(255,80,80,0.15)', background: 'rgba(255,80,80,0.04)' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#ff8080', fontSize: 14, marginBottom: 8 }}>Delete Account</div>
                <p style={{ fontSize: 13, color: 'rgba(255,170,170,0.7)', margin: '0 0 12px', lineHeight: 1.6 }}>To permanently delete your account and all data, email <a href="mailto:support@terraforgehome.com" style={{ color: '#ff8080', textDecoration: 'none' }}>support@terraforgehome.com</a>. We'll process it within 7 days.</p>
              </div>
            </div>
          )}

          {/* ── Billing ── */}
          {activeSection === 'billing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#f2fffa', margin: 0 }}>Billing & Plan</h2>

              {/* Current plan */}
              <div style={{ padding: '24px', borderRadius: 16, border: `1px solid ${isPro ? 'rgba(0,255,170,0.25)' : 'rgba(255,255,255,0.1)'}`, background: isPro ? 'rgba(0,255,170,0.05)' : 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: isPro ? '#00ffaa' : '#f2fffa', fontSize: 20, marginBottom: 4 }}>
                      {isPro ? '✦ Pro Plan' : 'Free Plan'}
                    </div>
                    <div style={{ fontSize: 13, color: '#aaf0d2' }}>
                      {isPro ? 'Full access to all TerraForge features' : 'Core blueprint generator + seasonal calendar'}
                    </div>
                  </div>
                  {isPro && <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: '#00ffaa', fontSize: 22 }}>Active</div>}
                </div>
              </div>

              {isPro && cancelFlow === 'idle' && (
                <div style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(0,255,170,0.12)', background: 'rgba(0,255,170,0.02)' }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 14, marginBottom: 12 }}>Switch to Annual — Save 27%</div>
                  <p style={{ fontSize: 13, color: '#aaf0d2', margin: '0 0 16px' }}>$79/year instead of $108/year on monthly. Prorated automatically.</p>
                  <button onClick={upgradeToAnnual} disabled={annualLoading} style={{ padding: '10px 22px', borderRadius: 10, cursor: 'pointer', background: 'linear-gradient(135deg,#00ffaa,#00c47a)', border: 'none', color: '#0a1f15', fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {annualLoading ? 'Redirecting…' : 'Switch to Annual →'}
                  </button>
                </div>
              )}

              {!isPro && (
                <div style={{ padding: '24px', borderRadius: 16, background: 'linear-gradient(135deg,rgba(0,255,170,0.07),rgba(4,14,8,0.9))', border: '1px solid rgba(0,255,170,0.2)' }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#f2fffa', fontSize: 16, marginBottom: 8 }}>Upgrade to Pro</div>
                  <ul style={{ margin: '0 0 20px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['Unlimited blueprint saves','Multiple properties','Satellite Property Canvas','AI property analysis','Shopping list PDF export'].map(f => (
                      <li key={f} style={{ fontSize: 13, color: '#aaf0d2' }}>{f}</li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Link href="/dashboard/garden" style={{ padding: '10px 22px', borderRadius: 10, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>Annual — $79/yr (Save 27%)</Link>
                    <Link href="/dashboard/garden" style={{ padding: '10px 22px', borderRadius: 10, background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.25)', color: '#00ffaa', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Monthly — $9/mo</Link>
                  </div>
                </div>
              )}

              {isPro && cancelFlow === 'idle' && (
                <div style={{ padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(255,80,80,0.15)', background: 'rgba(255,80,80,0.03)' }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#ff8080', fontSize: 13, marginBottom: 6 }}>Cancel Subscription</div>
                  <p style={{ fontSize: 12, color: 'rgba(255,170,170,0.6)', margin: '0 0 12px' }}>Your Pro access continues until end of the current billing period.</p>
                  <button onClick={() => setCancelFlow('confirm')} style={{ padding: '8px 16px', borderRadius: 8, cursor: 'pointer', background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff8080', fontWeight: 600, fontSize: 12 }}>Cancel Subscription</button>
                </div>
              )}

              {isPro && cancelFlow === 'confirm' && (
                <div style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(255,80,80,0.25)', background: 'rgba(255,80,80,0.05)' }}>
                  <p style={{ fontSize: 14, color: '#f2fffa', margin: '0 0 16px', fontWeight: 600 }}>Are you sure you want to cancel Pro?</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={cancelSubscription} disabled={cancelLoading} style={{ padding: '10px 20px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.35)', color: '#ff8080', fontWeight: 700, fontSize: 13 }}>
                      {cancelLoading ? 'Cancelling…' : 'Yes, Cancel'}
                    </button>
                    <button onClick={() => setCancelFlow('idle')} style={{ padding: '10px 20px', borderRadius: 10, cursor: 'pointer', background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.2)', color: '#00ffaa', fontWeight: 700, fontSize: 13 }}>Keep Pro</button>
                  </div>
                </div>
              )}

              {cancelFlow === 'done' && (
                <div style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(0,255,170,0.15)', background: 'rgba(0,255,170,0.04)' }}>
                  <p style={{ fontSize: 14, color: '#aaf0d2', margin: 0 }}>✓ Subscription cancelled. Your Pro access continues until end of the billing period.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
