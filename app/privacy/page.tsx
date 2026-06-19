'use client';

import Link from 'next/link';

const UPDATED = 'June 18, 2026';

export default function PrivacyPage() {
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
        }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: 'rgba(170,240,210,0.5)', margin: '0 0 36px' }}>
          Last updated: {UPDATED}
        </p>

        <Section title="Overview">
          TerraForge (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) provides a homestead and
          permaculture planning tool available at terraforgehome.com and as a mobile
          application. This policy explains what information we collect, how we use it,
          and the choices you have. By using TerraForge you agree to the practices
          described here.
        </Section>

        <Section title="Information we collect">
          <strong>Account information.</strong> When you create an account we collect your
          email address and authentication details, handled through our authentication
          provider (Supabase).
          <br /><br />
          <strong>Property and planning data.</strong> To generate plans we collect the
          information you provide, which may include a property address, yard size,
          household size, climate zone, budget, and the layouts and blueprints you create.
          <br /><br />
          <strong>Payment information.</strong> If you subscribe, payments are processed by
          Stripe. We do not store your full card details; Stripe handles that securely on
          our behalf.
          <br /><br />
          <strong>Device &amp; push tokens.</strong> If you enable notifications in the mobile
          app, we store a device push token so we can send you the notifications you
          requested. You can disable this at any time.
          <br /><br />
          <strong>Usage &amp; diagnostic data.</strong> We use analytics (Google Analytics) and
          error monitoring (Sentry) to understand how the product is used and to fix
          problems. This may include device type, pages visited, and crash information.
        </Section>

        <Section title="How we use your information">
          We use your information to: provide and operate the planning features;
          generate AI-assisted recommendations; process subscriptions; send notifications
          you have opted into; respond to support requests; improve and secure the
          product; and comply with legal obligations.
        </Section>

        <Section title="AI processing">
          TerraForge uses third-party AI services (Anthropic) to generate planning
          recommendations. The planning inputs you provide are sent to this provider to
          produce your results. We do not sell your information, and we do not use it to
          train third-party models beyond what is required to generate your requested
          output.
        </Section>

        <Section title="How we share information">
          We share information only with service providers who help us operate TerraForge
          — including hosting (Vercel), authentication and database (Supabase), payments
          (Stripe), AI processing (Anthropic), push delivery (Google Firebase), analytics
          (Google), and error monitoring (Sentry). These providers process data on our
          behalf under their own terms. We do not sell your personal information. We may
          disclose information if required by law or to protect rights and safety.
        </Section>

        <Section title="Data retention">
          We keep your account and planning data for as long as your account is active.
          You may request deletion of your account and associated data at any time by
          contacting us at the email below. Some records may be retained where required
          for legal, accounting, or security purposes.
        </Section>

        <Section title="Your choices &amp; rights">
          You can access and update your account information from your profile. You can
          disable push notifications in the app or your device settings. You may request
          access to, correction of, or deletion of your personal data by contacting us.
          Depending on your location, you may have additional rights under laws such as
          the GDPR or CCPA.
        </Section>

        <Section title="Children">
          TerraForge is not directed to children under 13, and we do not knowingly collect
          personal information from children under 13. If you believe a child has provided
          us information, please contact us so we can remove it.
        </Section>

        <Section title="Security">
          We use industry-standard measures to protect your information, including
          encrypted connections and trusted infrastructure providers. No method of
          transmission or storage is completely secure, but we work to protect your data.
        </Section>

        <Section title="Changes to this policy">
          We may update this policy from time to time. Material changes will be reflected
          by the &ldquo;Last updated&rdquo; date above, and where appropriate we will provide
          additional notice.
        </Section>

        <Section title="Contact us">
          If you have questions about this policy or your data, contact us at{' '}
          <a href="mailto:compassavail@gmail.com" style={{ color: '#00ffaa' }}>
            compassavail@gmail.com
          </a>.
        </Section>

        <div style={{ marginTop: 40, display: 'flex', gap: 18 }}>
          <Link href="/terms" style={{ color: 'rgba(170,240,210,0.6)', fontSize: 13 }}>
            Terms of Service
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
