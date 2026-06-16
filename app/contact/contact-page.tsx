'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', type: 'general', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    try {
      // Send to Resend via our email API
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setStatus('sent');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  const types = [
    { value: 'general', label: '💬 General question' },
    { value: 'bug', label: '🐛 Bug report' },
    { value: 'feature', label: '✨ Feature request' },
    { value: 'billing', label: '💳 Billing issue' },
    { value: 'feedback', label: '🌿 Feedback' },
  ];

  return (
    <main style={{ background: '#0a1f15', minHeight: '100vh', color: '#d2fcea', fontFamily: "'Inter', sans-serif" }}>

      <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,255,170,0.1)', maxWidth: 1100, margin: '0 auto' }}>
        <Link href="/" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#00ffaa', textDecoration: 'none' }}>🌿 TerraForge</Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/faq" style={{ fontSize: 13, color: 'rgba(0,255,170,0.6)', textDecoration: 'none' }}>FAQ</Link>
          <Link href="/dashboard/garden" style={{ padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Open App →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px' }}>

        <section style={{ textAlign: 'center', padding: '64px 0 48px' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#f2fffa', margin: '0 0 16px', letterSpacing: '-.02em' }}>
            Contact & Feedback
          </h1>
          <p style={{ fontSize: 16, color: '#aaf0d2', lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>
            Got a question, bug report, or idea? We read every message and typically reply within 24 hours.
          </p>
        </section>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '48px 32px', borderRadius: 20, background: 'rgba(0,255,170,0.06)', border: '1px solid rgba(0,255,170,0.2)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#f2fffa', margin: '0 0 12px' }}>Message sent!</h2>
            <p style={{ fontSize: 14, color: '#aaf0d2', margin: '0 0 28px', lineHeight: 1.7 }}>
              Thanks for reaching out. We'll get back to you at <strong style={{ color: '#d2fcea' }}>{form.email}</strong> within 24 hours.
            </p>
            <Link href="/dashboard/garden" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
              Back to App →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Name + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(0,255,170,0.7)', marginBottom: 8, letterSpacing: '.06em', textTransform: 'uppercase' }}>Your Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Smith"
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.18)', color: '#d2fcea', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(0,255,170,0.7)', marginBottom: 8, letterSpacing: '.06em', textTransform: 'uppercase' }}>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="jane@example.com"
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.18)', color: '#d2fcea', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(0,255,170,0.7)', marginBottom: 8, letterSpacing: '.06em', textTransform: 'uppercase' }}>Topic</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {types.map(t => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setForm(f => ({ ...f, type: t.value }))}
                    style={{
                      padding: '7px 14px', borderRadius: 99, fontSize: 13, cursor: 'pointer', fontWeight: 600,
                      background: form.type === t.value ? 'rgba(0,255,170,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${form.type === t.value ? 'rgba(0,255,170,0.45)' : 'rgba(255,255,255,0.1)'}`,
                      color: form.type === t.value ? '#00ffaa' : 'rgba(200,230,212,0.55)',
                    }}
                  >{t.label}</button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(0,255,170,0.7)', marginBottom: 8, letterSpacing: '.06em', textTransform: 'uppercase' }}>Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Tell us what's on your mind…"
                required
                rows={6}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.18)', color: '#d2fcea', outline: 'none', fontFamily: "'Inter', sans-serif", resize: 'vertical', lineHeight: 1.7, boxSizing: 'border-box' }}
              />
            </div>

            {status === 'error' && (
              <p style={{ fontSize: 13, color: '#ff8080', margin: 0 }}>Something went wrong — please try again or email us at <strong>support@terraforgehome.com</strong></p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              style={{ padding: '14px 32px', borderRadius: 12, cursor: status === 'sending' ? 'wait' : 'pointer', background: 'linear-gradient(135deg,#00ffaa,#00c47a)', border: 'none', color: '#0a1f15', fontWeight: 800, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif", opacity: status === 'sending' ? 0.7 : 1 }}
            >
              {status === 'sending' ? 'Sending…' : 'Send Message →'}
            </button>

            <p style={{ fontSize: 12, color: 'rgba(170,240,210,0.4)', margin: 0, textAlign: 'center' }}>
              Or email us directly at <a href="mailto:support@terraforgehome.com" style={{ color: 'rgba(0,255,170,0.6)', textDecoration: 'none' }}>support@terraforgehome.com</a>
            </p>
          </form>
        )}

        <div style={{ marginTop: 48, padding: '24px', borderRadius: 16, background: 'rgba(0,255,170,0.03)', border: '1px solid rgba(0,255,170,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(170,240,210,0.5)', margin: 0 }}>
            Looking for answers? Check the <Link href="/faq" style={{ color: 'rgba(0,255,170,0.7)', textDecoration: 'none', fontWeight: 600 }}>FAQ →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
