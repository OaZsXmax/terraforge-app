'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'loading'|'ready'|'success'|'error'>('loading');
  const [message, setMessage] = useState('');
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash
    // onAuthStateChange fires with 'PASSWORD_RECOVERY' event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStatus('ready');
      }
    });

    // Also handle if already in recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setStatus('ready');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (!password) { setMessage('Please enter a password.'); return; }
    if (password.length < 6) { setMessage('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setMessage('Passwords do not match.'); return; }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('success');
      setMessage('Password updated! Redirecting to app…');
      setTimeout(() => { window.location.href = '/dashboard/garden'; }, 2000);
    }
  };

  const strength = password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
    : password.length >= 8 ? 2 : password.length >= 6 ? 1 : 0;
  const strengthColors = ['#ef4444','#f59e0b','#00ffaa','#00d4ff'];
  const strengthLabels = ['Too short','Weak','Good','Strong'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0e2818, #122d2a, #141c38, #1a0e3a)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 420, borderRadius: 22,
        background: 'rgba(6,14,10,0.90)',
        border: '1px solid rgba(0,255,170,0.24)',
        boxShadow: '0 0 80px rgba(0,255,170,0.08), 0 40px 80px rgba(0,0,0,0.60)',
        overflow: 'hidden', position: 'relative',
      }}>
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, #00ffaa 40%, #00d4ff 70%, transparent)',
        }}/>

        <div style={{ padding: '32px 28px' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 24 }}>🌱</span>
              <span style={{
                fontSize: 20, fontWeight: 900, color: '#00ffaa',
                fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '.02em',
              }}>TerraForge</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(200,230,220,0.55)', margin: 0 }}>
              Set your new password
            </p>
          </div>

          {status === 'loading' && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', margin: '0 auto 12px',
                border: '3px solid rgba(0,255,170,0.20)',
                borderTop: '3px solid #00ffaa',
                animation: 'spin 0.8s linear infinite',
              }}/>
              <p style={{ color: 'rgba(200,230,220,0.55)', fontSize: 13 }}>
                Verifying reset link…
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {status === 'ready' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* New password */}
              <div>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600,
                  color: 'rgba(200,230,220,0.55)', letterSpacing: '.05em',
                  marginBottom: 6, textTransform: 'uppercase',
                }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    style={{
                      width: '100%', padding: '10px 42px 10px 12px',
                      borderRadius: 10, fontSize: 14,
                      background: 'rgba(0,255,170,0.03)',
                      border: '1px solid rgba(0,255,170,0.15)',
                      color: '#fff', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{
                      position: 'absolute', right: 10, top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 14, color: 'rgba(200,230,220,0.50)',
                    }}
                  >{showPw ? '🙈' : '👁'}</button>
                </div>
                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                      {[0,1,2,3].map(i => (
                        <div key={i} style={{
                          flex: 1, height: 3, borderRadius: 99,
                          background: i <= strength - 1 ? strengthColors[strength - 1] : 'rgba(255,255,255,0.08)',
                          transition: 'background 0.2s',
                        }}/>
                      ))}
                    </div>
                    <span style={{ fontSize: 10, color: strengthColors[strength - 1] || 'rgba(200,230,220,0.40)' }}>
                      {strengthLabels[strength] || 'Too short'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label style={{
                  display: 'block', fontSize: 11, fontWeight: 600,
                  color: 'rgba(200,230,220,0.55)', letterSpacing: '.05em',
                  marginBottom: 6, textTransform: 'uppercase',
                }}>Confirm Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  style={{
                    width: '100%', padding: '10px 12px',
                    borderRadius: 10, fontSize: 14,
                    background: 'rgba(0,255,170,0.03)',
                    border: `1px solid ${confirm && confirm !== password ? 'rgba(239,68,68,0.45)' : confirm && confirm === password ? 'rgba(0,255,170,0.40)' : 'rgba(0,255,170,0.15)'}`,
                    color: '#fff', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Error message */}
              {message && (
                <div style={{
                  padding: '9px 13px', borderRadius: 9, fontSize: 12,
                  background: 'rgba(239,68,68,0.10)',
                  border: '1px solid rgba(239,68,68,0.28)',
                  color: '#f87171',
                }}>⚠ {message}</div>
              )}

              {/* Submit */}
              <button
                onClick={handleReset}
                style={{
                  width: '100%', padding: '13px', borderRadius: 13,
                  background: 'linear-gradient(135deg, #005535, #00ffaa)',
                  border: 'none', color: '#051a0e', fontSize: 14,
                  fontWeight: 800, cursor: 'pointer', marginTop: 4,
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '.02em',
                }}
              >
                Set New Password
              </button>
            </div>
          )}

          {status === 'success' && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <p style={{ color: '#00ffaa', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                Password updated!
              </p>
              <p style={{ color: 'rgba(200,230,220,0.55)', fontSize: 13 }}>
                Redirecting you to the app…
              </p>
            </div>
          )}

          {status === 'error' && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
              <p style={{ color: '#f87171', fontSize: 14, marginBottom: 16 }}>{message}</p>
              <a href="/dashboard/garden" style={{
                color: '#00ffaa', fontSize: 13, textDecoration: 'none',
              }}>← Back to TerraForge</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
