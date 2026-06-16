import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Homestead Planner — Design Your Self-Sufficient Property | TerraForge',
  description: 'Plan your homestead with AI-generated blueprints, seasonal planting calendars, ROI tracking, and a satellite property canvas. Free to start. No experience needed.',
  keywords: 'homestead planner, homestead planning app, how to plan a homestead, homestead design tool, self sufficiency planner, backyard homestead planner',
  openGraph: {
    title: 'Free Homestead Planner — TerraForge',
    description: 'AI-powered homestead planning. Generate a complete blueprint for your property in 30 seconds.',
    url: 'https://www.terraforgehome.com/homestead-planner',
    siteName: 'TerraForge',
    type: 'website',
  },
  alternates: { canonical: 'https://www.terraforgehome.com/homestead-planner' },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TerraForge Homestead Planner',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'AI-powered homestead planning tool that generates tile-by-tile property blueprints, seasonal planting calendars, ROI projections, and satellite property canvases.',
  url: 'https://www.terraforgehome.com',
};

export default function HomesteadPlannerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main style={{ background: '#0a1f15', minHeight: '100vh', color: '#d2fcea', fontFamily: "'Inter', sans-serif" }}>

        {/* Nav */}
        <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,255,170,0.1)', maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#00ffaa', textDecoration: 'none' }}>🌿 TerraForge</Link>
          <Link href="/dashboard/garden" style={{ padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Start Planning Free →</Link>
        </nav>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>

          {/* Hero */}
          <section style={{ textAlign: 'center', padding: '72px 0 56px' }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.2)', fontSize: 12, color: '#00ffaa', fontWeight: 600, marginBottom: 24, letterSpacing: '.06em', textTransform: 'uppercase' }}>Free Homestead Planner</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: '#f2fffa', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-.02em' }}>
              Plan Your Homestead in<br />30 Seconds with AI
            </h1>
            <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#aaf0d2', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 36px' }}>
              TerraForge generates a complete homestead blueprint for your property — tile-by-tile layout, seasonal planting calendar, estimated food yield, and 20-year ROI — instantly.
            </p>
            <Link href="/dashboard/garden" style={{ display: 'inline-block', padding: '15px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 800, fontSize: 16, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
              Generate My Homestead Plan →
            </Link>
            <p style={{ marginTop: 14, fontSize: 13, color: 'rgba(170,240,210,0.45)' }}>Free to start · No credit card · Works on any device</p>
          </section>

          {/* What is a homestead planner */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 16 }}>What Is a Homestead Planner?</h2>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8, marginBottom: 16 }}>
              A homestead planner is a tool that helps you design, organise, and implement a self-sufficient property — whether you have a quarter-acre backyard or a 50-acre rural plot. A good homestead plan covers food production zones, water harvesting systems, energy infrastructure, animal areas, and soil-building strategies.
            </p>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8, marginBottom: 16 }}>
              Traditional homestead planning involved hand-drawn maps, multiple spreadsheets, and expensive consultants. TerraForge replaces that entire process with an AI system that understands your climate zone, property size, and goals — and produces a detailed, actionable plan in under a minute.
            </p>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8 }}>
              Unlike generic garden planners, TerraForge is built specifically for homesteaders and permaculture practitioners who want to design a whole-system property — not just a vegetable bed.
            </p>
          </section>

          {/* Features grid */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 32 }}>Everything Your Homestead Plan Needs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
              {[
                { icon: '🗺️', title: 'AI Blueprint Generator', desc: 'Describe your property and goals. TerraForge generates a tile-by-tile layout covering food, water, energy, soil, animals, and biodiversity zones.' },
                { icon: '📅', title: 'Seasonal Planting Calendar', desc: 'Month-by-month planting and harvest guide matched to your exact climate zone — Temperate, Arid, Subtropical, Tropical, or Cold.' },
                { icon: '📈', title: '20-Year ROI Tracker', desc: 'See your estimated annual food value, water savings, CO₂ sequestered, and financial return over 20 years as your homestead matures.' },
                { icon: '🛰️', title: 'Satellite Property Canvas', desc: 'Drop tiles directly onto a satellite view of your actual property. See exactly where your food forest, swales, and chicken coops will go.' },
                { icon: '🛒', title: 'Shopping List Export', desc: 'Generate a print-ready shopping list with every plant, material, and structure you need — grouped by category with cost estimates.' },
                { icon: '🌍', title: 'Multi-Property Support', desc: 'Plan multiple properties or layout alternatives simultaneously. Compare designs and track ROI across different configurations.' },
              ].map(f => (
                <div key={f.title} style={{ padding: '24px 20px', borderRadius: 16, background: 'linear-gradient(135deg,rgba(0,255,170,0.05),rgba(4,14,8,0.9))', border: '1px solid rgba(0,255,170,0.13)' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: '#f2fffa', margin: '0 0 8px' }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: '#aaf0d2', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 32 }}>How to Plan Your Homestead with TerraForge</h2>
            {[
              { step: '1', title: 'Enter your property details', desc: 'Tell TerraForge your property size, climate zone, and primary goals — food production, water independence, energy generation, or full self-sufficiency.' },
              { step: '2', title: 'Generate your AI blueprint', desc: 'Click generate. Within seconds, TerraForge produces a complete tile-by-tile homestead layout using permaculture zone principles and your climate data.' },
              { step: '3', title: 'Review your ROI and calendar', desc: 'Explore your 20-year financial projection, annual yield estimates, CO₂ sequestration, and month-by-month seasonal planting calendar.' },
              { step: '4', title: 'Map it to your actual property', desc: 'Open the satellite Property Canvas and drag your planned zones onto a live aerial view of your land. See exactly how your homestead fits.' },
              { step: '5', title: 'Export and implement', desc: 'Download your shopping list, print your planting calendar, and start building. TerraForge saves your plan so you can return to it any time.' },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,255,170,0.12)', border: '1px solid rgba(0,255,170,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: '#00ffaa', fontSize: 14, flexShrink: 0 }}>{s.step}</div>
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: '#f2fffa', margin: '4px 0 6px' }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: '#aaf0d2', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Climate zones */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 16 }}>Homestead Planning for Every Climate</h2>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8, marginBottom: 24 }}>
              Effective homestead planning is climate-specific. A swale system that works in temperate Oregon will fail in arid Arizona. TerraForge generates plans tailored to five distinct climate zones, each with appropriate plant selections, water strategies, and seasonal calendars.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
              {[
                { zone: 'Temperate', emoji: '🌲', eg: 'UK, Pacific NW, NZ', tip: 'Four seasons. Ideal for food forests, annual vegetables, rainwater harvesting.' },
                { zone: 'Arid', emoji: '🌵', eg: 'SW USA, Australia outback', tip: 'Water harvesting is everything. Swales, earthworks, and drought-hardy perennials.' },
                { zone: 'Subtropical', emoji: '🌴', eg: 'SE USA, coastal AU', tip: 'Year-round growing. Food forests thrive. Wet/dry season timing is critical.' },
                { zone: 'Tropical', emoji: '🌿', eg: 'Hawaii, Queensland, SE Asia', tip: 'Highest yields on earth. Cassava, banana, taro. Design for wet season flooding.' },
                { zone: 'Cold', emoji: '❄️', eg: 'Canada, Scandinavia, Alaska', tip: 'Short season demands fast crops, root cellars, and heavy mulching strategies.' },
              ].map(z => (
                <div key={z.zone} style={{ padding: '18px 16px', borderRadius: 14, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.1)' }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{z.emoji}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#00ffaa', fontSize: 14, marginBottom: 4 }}>{z.zone}</div>
                  <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.5)', marginBottom: 8 }}>{z.eg}</div>
                  <p style={{ fontSize: 12, color: '#aaf0d2', lineHeight: 1.6, margin: 0 }}>{z.tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 32 }}>Homestead Planning — Common Questions</h2>
            {[
              { q: 'How much land do I need to start a homestead?', a: 'You can begin homesteading on as little as a quarter acre. A well-designed quarter-acre property can produce 40–60% of a family\'s fresh produce. TerraForge\'s blueprints are calibrated to your actual property size, so you get realistic plans whether you have 0.1 acres or 100 acres.' },
              { q: 'What should I plan first on a new homestead?', a: 'Water comes first — always. Before planting anything, design your rainwater harvesting, swales, and storage. Next establish perennial trees and food forest zones, since they take the longest to mature. Annual vegetable beds come last. TerraForge\'s AI follows this permaculture priority order automatically.' },
              { q: 'How long does it take for a homestead to become productive?', a: 'Annual vegetables produce in the first season. Berry bushes take 2–3 years. Fruit trees typically take 4–7 years to full production, though dwarf varieties can fruit in year 2–3. A well-designed homestead reaches meaningful self-sufficiency (50%+ of fresh produce) within 3–5 years. TerraForge\'s ROI tracker shows this maturation curve.' },
              { q: 'Is TerraForge free to use?', a: 'TerraForge\'s core blueprint generator, dashboard, and seasonal calendar are free. Pro features including unlimited blueprints, multiple properties, satellite canvas, shopping list export, and AI property analysis are available for $9/month or $79/year.' },
              { q: 'Can I use TerraForge for a small backyard, not a rural homestead?', a: 'Absolutely. TerraForge is designed for properties of all sizes, from urban backyards to large rural plots. The AI scales its recommendations to your available space and produces realistic yield estimates regardless of size.' },
            ].map(faq => (
              <div key={faq.q} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,255,170,0.08)' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: '#f2fffa', margin: '0 0 10px' }}>{faq.q}</h3>
                <p style={{ fontSize: 14, color: '#aaf0d2', lineHeight: 1.8, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </section>

          {/* Internal links */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#f2fffa', marginBottom: 20 }}>More Planning Tools</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
              {[
                { href: '/permaculture-design', label: '🌀 Permaculture Design Tool' },
                { href: '/food-forest-planner', label: '🌳 Food Forest Planner' },
                { href: '/seasonal-planting-calendar', label: '📅 Seasonal Planting Calendar' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: 'block', padding: '16px 18px', borderRadius: 12, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.12)', color: '#00ffaa', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>{l.label}</Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={{ textAlign: 'center', padding: '48px 32px', borderRadius: 24, background: 'linear-gradient(135deg,rgba(0,255,170,0.07),rgba(4,14,8,0.95))', border: '1px solid rgba(0,255,170,0.18)' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 800, color: '#f2fffa', margin: '0 0 14px' }}>Start Planning Your Homestead Today</h2>
            <p style={{ fontSize: 15, color: '#aaf0d2', margin: '0 0 28px', lineHeight: 1.6 }}>Free to start. Generate your first blueprint in under 30 seconds.</p>
            <Link href="/dashboard/garden" style={{ display: 'inline-block', padding: '15px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 800, fontSize: 16, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
              Generate My Homestead Plan →
            </Link>
          </section>

        </div>
      </main>
    </>
  );
}
