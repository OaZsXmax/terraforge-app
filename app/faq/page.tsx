import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ — TerraForge Homestead Planner',
  description: 'Answers to common questions about TerraForge — blueprints, climate zones, Pro plan, billing, and how the AI works.',
  alternates: { canonical: 'https://www.terraforgehome.com/faq' },
};

const FAQS = [
  {
    section: '🌿 Getting Started',
    items: [
      { q: 'What is TerraForge?', a: 'TerraForge is an AI-powered homestead and permaculture planning tool. You enter your property details — size, location, climate zone, and goals — and TerraForge generates a complete homestead blueprint with a tile-by-tile layout, seasonal planting calendar, ROI projections, and a satellite property canvas.' },
      { q: 'Do I need any experience to use TerraForge?', a: 'No experience needed. TerraForge is built for complete beginners and experienced homesteaders alike. The AI handles the design logic — you just describe your property and goals.' },
      { q: 'Is TerraForge free?', a: 'Yes, the core app is free. You can generate blueprints, explore the seasonal calendar, and use the ROI tracker at no cost. Pro features — unlimited blueprints, multiple properties, satellite canvas, shopping list export, and AI property analysis — are available for $9/month or $79/year.' },
      { q: 'Does TerraForge work on mobile?', a: 'Yes. TerraForge is fully responsive and works on any device — desktop, tablet, and mobile — right in your web browser.' },
    ],
  },
  {
    section: '🗺️ Blueprints & Planning',
    items: [
      { q: 'How does the blueprint generator work?', a: 'You fill in a short form with your property size, climate zone, primary goals (food, water, energy, or full self-sufficiency), and any specific features you want. TerraForge\'s AI then generates a tile-by-tile layout using permaculture zone principles, climate-appropriate plant selections, and your stated priorities.' },
      { q: 'How accurate are the blueprints?', a: 'Blueprints are intelligent starting points, not professional site surveys. They apply well-established permaculture principles and conservative yield estimates to your property details. Treat them as a strong design foundation to adapt based on your specific site conditions.' },
      { q: 'Can I edit my blueprint after generating it?', a: 'Yes. You can add, remove, and reposition tiles on your blueprint. You can also regenerate at any time with different settings to explore alternative layouts.' },
      { q: 'How many blueprints can I save?', a: 'Free accounts can save one blueprint. Pro accounts have unlimited saves, which is useful for comparing different layout options or managing multiple properties.' },
      { q: 'What is the Property Canvas?', a: 'The Property Canvas is a satellite map of your actual property — pulled from Google Maps — with a grid overlay. You can drag and drop tiles from the palette onto the satellite image to visualise exactly where each element will go on your real land. It opens automatically in the Property tab after you run an AI property analysis.' },
    ],
  },
  {
    section: '🌍 Climate Zones',
    items: [
      { q: 'Which climate zones does TerraForge support?', a: 'TerraForge supports five zones: Temperate (UK, Pacific Northwest, New Zealand), Arid (SW USA, Mediterranean, outback Australia), Subtropical (SE USA, coastal Queensland), Tropical (Hawaii, Far North Queensland, SE Asia), and Cold (Canada, Scandinavia, highland regions). Each zone has its own plant selections, yield multipliers, and seasonal calendar.' },
      { q: 'How do I know which climate zone I\'m in?', a: 'A rough guide: if you have four clear seasons with snow possible, you\'re Temperate or Cold. If summers are very hot and dry with mild winters, you\'re Arid. If you have a wet/dry season pattern with no frost, you\'re Subtropical or Tropical. The AI property analysis can also detect your likely zone from your address.' },
      { q: 'Can TerraForge handle microclimates?', a: 'The blueprint generator works at a zone level and doesn\'t model microclimates (frost pockets, wind shadows, etc). The Property Canvas lets you plan placement on your actual satellite image, where you can account for microclimates you know about from observation.' },
    ],
  },
  {
    section: '📈 ROI & Yield Estimates',
    items: [
      { q: 'How are yield estimates calculated?', a: 'Yields use conservative US-average figures per plant type, adjusted for climate zone (Tropical gets the highest multiplier at 1.45×, Cold the lowest at 0.65×). New plantings are discounted 30–50% in years 1–2 to reflect establishment. Actual yields depend on your soil, management, and local conditions.' },
      { q: 'Are the financial projections reliable?', a: 'They\'re realistic planning estimates, not guarantees. TerraForge uses conservative assumptions: $0.80/lb produce (farm-gate equivalent), $0.005/gallon water, $0.023/lb CO₂, and 3% annual compounding. See the footer disclaimers for full methodology. Always verify local rates before making investment decisions.' },
      { q: 'Why does my ROI increase so much in later years?', a: 'Perennial systems are slow starters and strong finishers. A fruit tree costs money in years 1–3 and produces heavily from year 5 onward — for 20–50 years. The ROI curve reflects this maturation: early years show net investment, later years show compounding yield as the system reaches full productivity.' },
    ],
  },
  {
    section: '💳 Pro Plan & Billing',
    items: [
      { q: 'What\'s included in Pro?', a: 'Pro includes: unlimited blueprint saves, multiple property support, satellite Property Canvas, AI property analysis (Google satellite + Claude Vision), shopping list PDF export, and priority support. Pro is $9/month or $79/year (save 27%).' },
      { q: 'Can I switch from monthly to annual?', a: 'Yes. Go to your account (the person icon in the top nav) and click "Switch to Annual — Save 27%". The switch is prorated — you\'ll only pay the difference.' },
      { q: 'How do I cancel?', a: 'Open your account panel and click "Cancel Subscription". Your Pro access continues until the end of the current billing period. No questions asked.' },
      { q: 'Is my payment information secure?', a: 'Yes. TerraForge uses Stripe for all payments. We never store your card details — Stripe handles all payment processing with bank-level encryption.' },
    ],
  },
  {
    section: '🔒 Account & Data',
    items: [
      { q: 'How is my data stored?', a: 'Your blueprints and property data are stored securely in Supabase (PostgreSQL). Property Canvas tile layouts are stored locally in your browser\'s localStorage. We don\'t sell your data to third parties.' },
      { q: 'Can I use TerraForge without an account?', a: 'Yes, for basic blueprint generation. Creating a free account lets you save blueprints, access them from any device, and unlock account-based features.' },
      { q: 'How do I delete my account?', a: 'Email us at support@terraforgehome.com with your account email and we\'ll delete your account and all associated data within 7 days.' },
    ],
  },
];

export default function FAQPage() {
  return (
    <main style={{ background: '#0a1f15', minHeight: '100vh', color: '#d2fcea', fontFamily: "'Inter', sans-serif" }}>

      <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,255,170,0.1)', maxWidth: 1100, margin: '0 auto' }}>
        <Link href="/" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#00ffaa', textDecoration: 'none' }}>🌿 TerraForge</Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/contact" style={{ fontSize: 13, color: 'rgba(0,255,170,0.6)', textDecoration: 'none' }}>Contact</Link>
          <Link href="/dashboard/garden" style={{ padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Open App →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px' }}>

        <section style={{ textAlign: 'center', padding: '64px 0 48px' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#f2fffa', margin: '0 0 16px', letterSpacing: '-.02em' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: 16, color: '#aaf0d2', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            Everything you need to know about TerraForge. Can't find your answer? <Link href="/contact" style={{ color: '#00ffaa', textDecoration: 'none', fontWeight: 600 }}>Contact us →</Link>
          </p>
        </section>

        {FAQS.map(section => (
          <section key={section.section} style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#00ffaa', marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid rgba(0,255,170,0.12)' }}>
              {section.section}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {section.items.map((faq, i) => (
                <div key={faq.q} style={{ padding: '20px 0', borderBottom: i < section.items.length - 1 ? '1px solid rgba(0,255,170,0.07)' : 'none' }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: '#f2fffa', margin: '0 0 10px' }}>{faq.q}</h3>
                  <p style={{ fontSize: 14, color: '#aaf0d2', lineHeight: 1.8, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section style={{ textAlign: 'center', padding: '40px 32px', borderRadius: 20, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.14)' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#f2fffa', margin: '0 0 12px' }}>Still have questions?</h2>
          <p style={{ fontSize: 14, color: '#aaf0d2', margin: '0 0 24px' }}>We're happy to help. Send us a message and we'll get back to you.</p>
          <Link href="/contact" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
            Contact Us →
          </Link>
        </section>
      </div>
    </main>
  );
}
