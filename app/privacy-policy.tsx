'use client';
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main style={{
      background:'#060f0a',
      minHeight:'100vh',
      color:'#c8e6d4',
      fontFamily:"'Georgia', 'Times New Roman', serif",
    }}>
      {/* Header */}
      <div style={{
        borderBottom:'1px solid rgba(0,255,130,0.12)',
        padding:'32px 0 28px',
        textAlign:'center',
        background:'linear-gradient(180deg, rgba(0,255,130,0.04) 0%, transparent 100%)',
      }}>
        <div style={{
          fontSize:11,fontWeight:700,letterSpacing:'.25em',
          color:'rgba(0,255,130,0.55)',textTransform:'uppercase',
          fontFamily:"'Courier New', monospace",marginBottom:16,
        }}>TerraForge</div>
        <h1 style={{
          fontSize:'clamp(28px,5vw,48px)',fontWeight:400,
          color:'#e8f5ee',margin:'0 0 10px',letterSpacing:'-.01em',
          lineHeight:1.15,
        }}>Privacy Policy</h1>
        <p style={{
          fontSize:13,color:'rgba(200,230,212,0.45)',
          fontFamily:"'Courier New', monospace",margin:0,
          letterSpacing:'.06em',
        }}>Effective: May 17, 2026 · Last updated: May 17, 2026</p>
      </div>

      {/* Content */}
      <div style={{
        maxWidth:760,margin:'0 auto',padding:'60px 24px 100px',
        lineHeight:1.85,fontSize:'clamp(15px,2vw,17px)',
      }}>

        <Section title="1. Who We Are">
          <P>TerraForge (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a permaculture planning application available on the web and Android platforms. We are committed to protecting your personal information and your right to privacy.</P>
          <P>If you have questions about this policy or how we handle your data, contact us at <a href="mailto:privacy@terraforge.app" style={linkStyle}>privacy@terraforge.app</a>.</P>
        </Section>

        <Section title="2. What Information We Collect">
          <SubHead>Information you provide directly</SubHead>
          <ul style={listStyle}>
            <li><strong>Account information:</strong> email address and password (stored as a secure hash — we never see your plaintext password) when you create an account.</li>
            <li><strong>Garden blueprints and plans:</strong> the permaculture designs, map configurations, and feature placements you save within the app.</li>
            <li><strong>Preferences:</strong> your selected climate zone, family size, budget, and other planning inputs.</li>
          </ul>
          <SubHead>Information collected automatically</SubHead>
          <ul style={listStyle}>
            <li><strong>Usage data:</strong> pages visited, features used, and time spent in the app — used solely to improve the product.</li>
            <li><strong>Device information:</strong> browser type, operating system, and general location (country/region) for analytics.</li>
            <li><strong>Error logs:</strong> crash reports and error traces to help us fix bugs.</li>
          </ul>
          <SubHead>Information we do NOT collect</SubHead>
          <ul style={listStyle}>
            <li>We do not collect payment information (TerraForge is free).</li>
            <li>We do not collect GPS or precise location data.</li>
            <li>We do not use advertising trackers or sell your data to advertisers.</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <P>We use the information we collect to:</P>
          <ul style={listStyle}>
            <li>Create and manage your account and authenticate you securely.</li>
            <li>Save and sync your garden plans across devices.</li>
            <li>Provide and improve the TerraForge app and its features.</li>
            <li>Respond to your support requests and questions.</li>
            <li>Send you important service announcements (not marketing, unless you opt in).</li>
            <li>Monitor for fraud, abuse, and security threats.</li>
          </ul>
          <P>We do not use your data to train AI models, sell to third parties, or serve you advertisements.</P>
        </Section>

        <Section title="4. How We Share Your Information">
          <P>We do not sell your personal information. We may share it only in these limited circumstances:</P>
          <ul style={listStyle}>
            <li><strong>Service providers:</strong> We use Supabase to store your account data and garden plans. They are contractually bound to protect your data and use it only to provide services to us.</li>
            <li><strong>Legal requirements:</strong> If required by law, court order, or to protect our rights or the safety of others.</li>
            <li><strong>Business transfers:</strong> If TerraForge is acquired or merges with another company, your data may transfer as part of that transaction. We will notify you before your data is subject to a different privacy policy.</li>
          </ul>
        </Section>

        <Section title="5. Data Storage and Security">
          <P>Your account data and garden plans are stored securely using Supabase, which uses industry-standard encryption in transit (TLS) and at rest (AES-256). Passwords are stored using bcrypt hashing — your plaintext password is never stored or accessible by us.</P>
          <P>We retain your data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where required by law to retain it.</P>
          <P>While we take reasonable steps to protect your data, no system is perfectly secure. We encourage you to use a strong, unique password.</P>
        </Section>

        <Section title="6. Your Rights and Choices">
          <P>Depending on your location, you may have the following rights regarding your personal data:</P>
          <ul style={listStyle}>
            <li><strong>Access:</strong> Request a copy of the data we hold about you.</li>
            <li><strong>Correction:</strong> Ask us to correct inaccurate data.</li>
            <li><strong>Deletion:</strong> Request that we delete your account and associated data.</li>
            <li><strong>Portability:</strong> Request your garden plans in a machine-readable format.</li>
            <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications at any time.</li>
          </ul>
          <P>To exercise any of these rights, email <a href="mailto:privacy@terraforge.app" style={linkStyle}>privacy@terraforge.app</a>. We will respond within 30 days.</P>
        </Section>

        <Section title="7. Children's Privacy">
          <P>TerraForge is not directed at children under 13 (or under 16 in the EU). We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.</P>
        </Section>

        <Section title="8. International Users">
          <P>TerraForge is operated from the United States. If you are accessing the app from outside the US — including from the European Union — your data may be transferred to and processed in the US. By using TerraForge, you consent to this transfer.</P>
          <P>For EU/EEA users: our legal basis for processing your data is the performance of a contract (providing the service you signed up for) and our legitimate interests in operating and improving the app.</P>
        </Section>

        <Section title="9. Cookies and Local Storage">
          <P>TerraForge uses browser local storage to save your session and app preferences on your device. We do not use third-party tracking cookies. We may use first-party cookies for authentication and session management only.</P>
        </Section>

        <Section title="10. Changes to This Policy">
          <P>We may update this Privacy Policy from time to time. When we do, we will update the &quot;Last updated&quot; date at the top of this page and, for material changes, notify you by email or in-app notification. Continued use of TerraForge after changes constitutes acceptance of the updated policy.</P>
        </Section>

        <Section title="11. Contact Us">
          <P>If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:</P>
          <div style={{
            background:'rgba(0,255,130,0.04)',border:'1px solid rgba(0,255,130,0.12)',
            borderRadius:12,padding:'20px 24px',marginTop:16,
            fontFamily:"'Courier New', monospace",fontSize:14,
          }}>
            <div style={{color:'rgba(0,255,130,0.7)',marginBottom:6}}>TerraForge Privacy Team</div>
            <a href="mailto:compassavail@gmail.com" style={{...linkStyle,fontSize:15}}>compassavail@gmail.com</a>
          </div>
        </Section>

        <div style={{
          marginTop:64,paddingTop:32,
          borderTop:'1px solid rgba(0,255,130,0.08)',
          textAlign:'center',
          fontSize:13,color:'rgba(200,230,212,0.3)',
          fontFamily:"'Courier New', monospace",letterSpacing:'.06em',
        }}>
          © {new Date().getFullYear()} TerraForge · <a href="/terms" style={{color:'rgba(0,255,130,0.4)',textDecoration:'none'}}>Terms of Service</a>
        </div>
      </div>
    </main>
  );
}

const linkStyle: React.CSSProperties = {
  color:'#00e87a',textDecoration:'underline',
  textDecorationColor:'rgba(0,232,122,0.3)',
};

const listStyle: React.CSSProperties = {
  paddingLeft:22,margin:'12px 0 20px',
  display:'flex',flexDirection:'column',gap:8,
};

function Section({title, children}: {title:string; children:React.ReactNode}) {
  return (
    <section style={{marginBottom:52}}>
      <h2 style={{
        fontSize:'clamp(17px,2.5vw,21px)',fontWeight:600,
        color:'#e8f5ee',marginBottom:20,paddingBottom:10,
        borderBottom:'1px solid rgba(0,255,130,0.1)',
        fontFamily:"'Georgia', serif",letterSpacing:'-.01em',
      }}>{title}</h2>
      {children}
    </section>
  );
}

function SubHead({children}: {children:React.ReactNode}) {
  return (
    <h3 style={{
      fontSize:14,fontWeight:700,letterSpacing:'.1em',
      textTransform:'uppercase',color:'rgba(0,255,130,0.6)',
      fontFamily:"'Courier New', monospace",
      margin:'24px 0 10px',
    }}>{children}</h3>
  );
}

function P({children}: {children:React.ReactNode}) {
  return <p style={{margin:'0 0 16px',color:'rgba(200,230,212,0.8)'}}>{children}</p>;
}
