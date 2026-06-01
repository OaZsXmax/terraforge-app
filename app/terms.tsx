'use client';
import React from 'react';

export default function TermsOfService() {
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
        }}>Terms of Service</h1>
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

        <div style={{
          background:'rgba(0,255,130,0.04)',border:'1px solid rgba(0,255,130,0.12)',
          borderRadius:12,padding:'20px 24px',marginBottom:52,
          fontSize:15,color:'rgba(200,230,212,0.65)',lineHeight:1.7,
        }}>
          Please read these Terms carefully before using TerraForge. By creating an account or using the app, you agree to be bound by these Terms. If you do not agree, do not use TerraForge.
        </div>

        <Section title="1. Acceptance of Terms">
          <P>These Terms of Service (&quot;Terms&quot;) govern your use of TerraForge (the &quot;Service&quot;), including the web application and Android app. By accessing or using TerraForge, you confirm that you are at least 13 years old and agree to these Terms.</P>
          <P>We may update these Terms from time to time. We will notify you of significant changes by email or in-app notice. Continued use after changes constitutes acceptance.</P>
        </Section>

        <Section title="2. Description of Service">
          <P>TerraForge is a permaculture design and planning tool that helps you plan, visualise, and track sustainable garden and homestead features. The Service includes:</P>
          <ul style={listStyle}>
            <li>Interactive mapping and blueprint tools for permaculture design</li>
            <li>Calculations for yield, water savings, CO₂ sequestration, and financial returns</li>
            <li>A feature library with planting, water, energy, and biodiversity elements</li>
            <li>PDF export of your plans and regeneration reports</li>
            <li>Cloud saving and syncing of your designs via a user account</li>
          </ul>
          <P>TerraForge is a planning aid. All yield estimates, savings calculations, and recommendations are approximations for guidance only — actual results will vary based on your specific location, climate, soil, and implementation.</P>
        </Section>

        <Section title="3. User Accounts">
          <P>To save and sync your plans, you must create an account. You agree to:</P>
          <ul style={listStyle}>
            <li>Provide accurate and current information when registering</li>
            <li>Keep your password secure and not share it with others</li>
            <li>Notify us immediately if you suspect unauthorised access to your account</li>
            <li>Take responsibility for all activity that occurs under your account</li>
          </ul>
          <P>We reserve the right to suspend or terminate accounts that violate these Terms or are used for fraudulent, abusive, or harmful purposes.</P>
        </Section>

        <Section title="4. Acceptable Use">
          <P>You agree to use TerraForge only for lawful purposes and in accordance with these Terms. You agree not to:</P>
          <ul style={listStyle}>
            <li>Use the Service for any illegal or unauthorised purpose</li>
            <li>Attempt to gain unauthorised access to any part of the Service or its infrastructure</li>
            <li>Use automated tools (bots, scrapers, crawlers) to access the Service without our permission</li>
            <li>Transmit viruses, malware, or any code of a destructive nature</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Impersonate any person or entity</li>
            <li>Attempt to reverse-engineer, decompile, or extract the source code of TerraForge</li>
          </ul>
        </Section>

        <Section title="5. Your Content">
          <P>You retain ownership of the garden plans, blueprints, and designs you create using TerraForge (&quot;User Content&quot;). By saving your content to our servers, you grant us a limited, non-exclusive licence to store, display, and process it solely to provide and improve the Service.</P>
          <P>We do not claim ownership of your designs and will not share them with third parties without your consent, except as described in our <a href="/privacy" style={linkStyle}>Privacy Policy</a>.</P>
          <P>You are responsible for ensuring your User Content does not infringe the rights of others.</P>
        </Section>

        <Section title="6. Intellectual Property">
          <P>TerraForge, including its design, code, logo, and all original content not submitted by users, is owned by us and protected by copyright, trademark, and other intellectual property laws. Nothing in these Terms transfers ownership of TerraForge intellectual property to you.</P>
          <P>The TerraForge name and logo may not be used without our prior written permission.</P>
        </Section>

        <Section title="7. Disclaimers and Limitation of Liability">
          <SubHead>No professional advice</SubHead>
          <P>TerraForge provides general permaculture planning guidance. It does not constitute professional horticultural, agricultural, financial, environmental, or legal advice. Always consult qualified professionals before making significant investments or changes to your land.</P>
          <SubHead>Accuracy of estimates</SubHead>
          <P>Yield, savings, and carbon estimates are based on generalised models and published averages. They are indicative only. Actual results will vary. We make no warranty that any particular outcome will be achieved by following TerraForge recommendations.</P>
          <SubHead>Service availability</SubHead>
          <P>We aim to keep TerraForge available at all times but do not guarantee uninterrupted access. We may perform maintenance, updates, or experience outages. We are not liable for losses caused by unavailability of the Service.</P>
          <SubHead>Limitation of liability</SubHead>
          <P>To the maximum extent permitted by law, TerraForge and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising from your use of or inability to use the Service, even if advised of the possibility of such damages.</P>
          <P>Our total liability to you for any claim arising from these Terms or your use of TerraForge shall not exceed the amount you paid to us in the 12 months preceding the claim (which, as TerraForge is currently free, may be zero).</P>
        </Section>

        <Section title="8. Indemnification">
          <P>You agree to indemnify and hold harmless TerraForge and its creators from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from: (a) your use of the Service; (b) your User Content; (c) your violation of these Terms; or (d) your violation of any third-party rights.</P>
        </Section>

        <Section title="9. Termination">
          <P>You may delete your account at any time. We may suspend or terminate your access to TerraForge at any time for any reason, including violation of these Terms. Upon termination, your right to use the Service ceases immediately.</P>
          <P>Sections 5, 6, 7, 8, and 10 of these Terms survive termination.</P>
        </Section>

        <Section title="10. Governing Law">
          <P>These Terms are governed by and construed in accordance with the laws of the United States. Any disputes arising from these Terms or your use of TerraForge shall be resolved in the courts of the United States, and you consent to personal jurisdiction in those courts.</P>
        </Section>

        <Section title="11. Changes to the Service">
          <P>We reserve the right to modify, suspend, or discontinue any part of TerraForge at any time. We will provide reasonable notice for significant changes when possible. We are not liable to you or any third party for any modification, suspension, or discontinuation of the Service.</P>
        </Section>

        <Section title="12. Contact">
          <P>For questions about these Terms, please contact us:</P>
          <div style={{
            background:'rgba(0,255,130,0.04)',border:'1px solid rgba(0,255,130,0.12)',
            borderRadius:12,padding:'20px 24px',marginTop:16,
            fontFamily:"'Courier New', monospace",fontSize:14,
          }}>
            <div style={{color:'rgba(0,255,130,0.7)',marginBottom:6}}>TerraForge Legal</div>
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
          © {new Date().getFullYear()} TerraForge · <a href="/privacy" style={{color:'rgba(0,255,130,0.4)',textDecoration:'none'}}>Privacy Policy</a>
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
