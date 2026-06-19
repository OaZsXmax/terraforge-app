'use client';

import Link from 'next/link';

const UPDATED = 'June 18, 2026';

export default function TermsPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0d2719, #040e08)',
      color: '#d2fcea',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 20px 80px',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <Link href="/" style={{
          color: '#00ffaa', textDecoration: 'none', fontSize: 14, fontWeight: 600,
          display: 'inline-block', marginBottom: 28,
        }}>← Back to TerraForge</Link>

        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 34, fontWeight: 800,
          color: '#f2fffa', margin: '0 0 8px',
        }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: 'rgba(170,240,210,0.5)', margin: '0 0 36px' }}>
          Last updated: {UPDATED}
        </p>

        <Section title="Acceptance of terms">
          By accessing or using TerraForge (the &ldquo;Service&rdquo;), available at
          terraforgehome.com and as a mobile application, you agree to be bound by these
          Terms of Service. If you do not agree, please do not use the Service.
        </Section>

        <Section title="Description of the service">
          TerraForge is a homestead and permaculture planning tool that provides
          AI-assisted recommendations, property layout planning, and related features.
          The Service is provided for informational and planning purposes.
        </Section>

        <Section title="Accounts">
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activity under your account. You agree to provide
          accurate information and to keep it up to date. You must be at least 13 years
          old to use the Service.
        </Section>

        <Section title="Subscriptions &amp; payments">
          Certain features require a paid subscription. Prices and billing terms are
          presented at the point of purchase. Payments are processed by Stripe.
          Subscriptions renew automatically unless cancelled before the renewal date. You
          can manage or cancel your subscription from your account. Except where required
          by law, payments are non-refundable.
        </Section>

        <Section title="Acceptable use">
          You agree not to misuse the Service, including by: attempting to disrupt or
          compromise its security; reverse engineering or scraping it; using it for
          unlawful purposes; or infringing the rights of others. We may suspend or
          terminate accounts that violate these terms.
        </Section>

        <Section title="AI-generated content &amp; no professional advice">
          The Service uses AI to generate planning suggestions. These outputs are provided
          for general informational purposes and may contain inaccuracies. They are not
          professional horticultural, agricultural, financial, legal, or engineering
          advice. You are responsible for independently verifying any information before
          acting on it. Always consult qualified professionals where appropriate.
        </Section>

        <Section title="Intellectual property">
          The Service, including its software, design, and content (excluding content you
          provide), is owned by TerraForge and protected by applicable laws. You retain
          ownership of the planning data and content you create, and grant us the limited
          rights necessary to operate the Service and provide it to you.
        </Section>

        <Section title="Disclaimers">
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties
          of any kind, whether express or implied, including merchantability, fitness for
          a particular purpose, and non-infringement. We do not warrant that the Service
          will be uninterrupted, error-free, or that results will meet your expectations.
        </Section>

        <Section title="Limitation of liability">
          To the maximum extent permitted by law, TerraForge and its providers will not be
          liable for any indirect, incidental, special, consequential, or punitive
          damages, or any loss of profits, data, or goodwill, arising from your use of the
          Service. Our total liability for any claim will not exceed the amount you paid
          us in the twelve months before the claim.
        </Section>

        <Section title="Termination">
          You may stop using the Service at any time. We may suspend or terminate your
          access if you violate these terms or if we discontinue the Service. Provisions
          that by their nature should survive termination will survive.
        </Section>

        <Section title="Changes to these terms">
          We may update these terms from time to time. Material changes will be reflected
          by the &ldquo;Last updated&rdquo; date above. Continued use of the Service after changes
          take effect constitutes acceptance of the revised terms.
        </Section>

        <Section title="Contact us">
          Questions about these terms? Contact us at{' '}
          <a href="mailto:compassavail@gmail.com" style={{ color: '#00ffaa' }}>
            compassavail@gmail.com
          </a>.
        </Section>

        <div style={{ marginTop: 40, display: 'flex', gap: 18 }}>
          <Link href="/privacy" style={{ color: 'rgba(170,240,210,0.6)', fontSize: 13 }}>
            Privacy Policy
          </Link>
          <Link href="/" style={{ color: 'rgba(170,240,210,0.6)', fontSize: 13 }}>
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 30 }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700,
        color: '#00ffaa', margin: '0 0 10px',
      }}>{title}</h2>
      <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(210,252,234,0.82)', margin: 0 }}>
        {children}
      </p>
    </section>
  );
}
