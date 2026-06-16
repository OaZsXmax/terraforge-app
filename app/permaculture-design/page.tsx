import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Permaculture Design Tool — AI-Powered Zone Planning | TerraForge',
  description: 'Design your permaculture property with AI. Generate zone maps, food forest layouts, water harvesting plans, and seasonal calendars for any climate. Free to start.',
  keywords: 'permaculture design tool, permaculture design software, permaculture zone planning, permaculture garden planner, permaculture site design, AI permaculture',
  openGraph: {
    title: 'Permaculture Design Tool — TerraForge',
    description: 'AI-powered permaculture zone planning. Generate complete site designs in seconds.',
    url: 'https://www.terraforgehome.com/permaculture-design',
    siteName: 'TerraForge',
    type: 'website',
  },
  alternates: { canonical: 'https://www.terraforgehome.com/permaculture-design' },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TerraForge Permaculture Design Tool',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'AI-powered permaculture design tool for zone planning, food forest design, water harvesting, and whole-system property layouts.',
  url: 'https://www.terraforgehome.com',
};

export default function PermacultureDesignPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main style={{ background: '#0a1f15', minHeight: '100vh', color: '#d2fcea', fontFamily: "'Inter', sans-serif" }}>

        <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,255,170,0.1)', maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#00ffaa', textDecoration: 'none' }}>🌿 TerraForge</Link>
          <Link href="/dashboard/garden" style={{ padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Design Free →</Link>
        </nav>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>

          <section style={{ textAlign: 'center', padding: '72px 0 56px' }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.2)', fontSize: 12, color: '#00ffaa', fontWeight: 600, marginBottom: 24, letterSpacing: '.06em', textTransform: 'uppercase' }}>Permaculture Design Tool</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: '#f2fffa', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-.02em' }}>
              AI Permaculture Design<br />for Any Property
            </h1>
            <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#aaf0d2', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 36px' }}>
              TerraForge applies permaculture zone principles to your actual property — generating detailed zone maps, food forest plans, water harvesting designs, and biodiversity strategies tailored to your climate.
            </p>
            <Link href="/dashboard/garden" style={{ display: 'inline-block', padding: '15px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 800, fontSize: 16, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
              Start My Design →
            </Link>
            <p style={{ marginTop: 14, fontSize: 13, color: 'rgba(170,240,210,0.45)' }}>Free · No CAD skills needed · Instant results</p>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 16 }}>What Is Permaculture Design?</h2>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8, marginBottom: 16 }}>
              Permaculture design is a whole-systems approach to land planning that works with natural patterns rather than against them. Developed by Bill Mollison and David Holmgren in the 1970s, permaculture organises a property into zones based on how frequently different areas are visited and how much energy they require to maintain.
            </p>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8, marginBottom: 16 }}>
              Zone 0 is the house. Zone 1 — directly adjacent to the house — contains the most intensively managed elements: herbs, salad beds, and compost. Zone 2 holds food forest edges and annual vegetable gardens. Zone 3 is for main crop production and orchards. Zones 4 and 5 become progressively wilder, transitioning to managed woodland and fully wild habitat.
            </p>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8 }}>
              Traditional permaculture design required trained consultants, hand-drawn maps, and weeks of site analysis. TerraForge automates the design process — applying zone principles, companion planting logic, water flow analysis, and climate-specific plant selection to produce a complete site design in seconds.
            </p>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 32 }}>Permaculture Zones — What Goes Where</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { zone: 'Zone 0 — The House', color: '#00ffaa', desc: 'Your home is the centre of the design. TerraForge positions all other zones relative to your house, optimising for energy efficiency, solar orientation, and ease of access.' },
                { zone: 'Zone 1 — Intensive Kitchen Garden', color: '#00d4ff', desc: 'Herbs, salad crops, tomatoes, and daily-harvest vegetables. This zone is visited multiple times a day and sits directly outside the kitchen door. Raised beds, herb spirals, and cold frames belong here.' },
                { zone: 'Zone 2 — Food Forest Edge & Polyculture', color: '#facc15', desc: 'Soft fruit bushes, dwarf fruit trees, larger annual beds, and composting systems. Visited daily, but less intensively than Zone 1. This is where food forest understory plants establish.' },
                { zone: 'Zone 3 — Main Crop Production', color: '#f472b6', desc: 'Standard fruit trees, main crop vegetables, grain crops, and larger infrastructure like rain tanks and swales. Visited weekly rather than daily.' },
                { zone: 'Zone 4 — Managed Woodland', color: '#a78bfa', desc: 'Timber trees, nut trees, forage crops, and larger water features like ponds. Semi-wild, managed seasonally for harvests rather than daily maintenance.' },
                { zone: 'Zone 5 — Wild Reserve', color: '#4ade80', desc: 'Left to nature. Wildflower meadows, native habitat, woodland. Zone 5 provides biodiversity refuges, predator habitat, and the ecological foundation that makes the whole system resilient.' },
              ].map(z => (
                <div key={z.zone} style={{ display: 'flex', gap: 16, padding: '18px 20px', borderRadius: 14, background: 'rgba(0,255,170,0.03)', border: '1px solid rgba(0,255,170,0.09)' }}>
                  <div style={{ width: 4, borderRadius: 99, background: z.color, flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: z.color, margin: '0 0 6px' }}>{z.zone}</h3>
                    <p style={{ fontSize: 14, color: '#aaf0d2', lineHeight: 1.7, margin: 0 }}>{z.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 16 }}>Key Permaculture Design Elements in TerraForge</h2>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8, marginBottom: 24 }}>
              TerraForge's AI understands and applies the core permaculture design elements across every blueprint it generates:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
              {[
                { icon: '🌊', title: 'Water Harvesting', desc: 'Swales, rain tanks, ponds, cisterns, and rain gardens sized to your rainfall and property grade.' },
                { icon: '🌳', title: 'Food Forest Design', desc: 'Seven-layer canopy structure — canopy, sub-canopy, shrub, herb, ground cover, vine, and root layers.' },
                { icon: '♻️', title: 'Nutrient Cycling', desc: 'Compost, hugelkultur, cover crops, and mulch zones placed to close nutrient loops across the whole site.' },
                { icon: '🌸', title: 'Biodiversity', desc: 'Native plants, wildflower zones, hedgerows, and insect habitat integrated throughout the design.' },
                { icon: '☀️', title: 'Energy Integration', desc: 'Solar panels, wind turbines, and solar pumps sited relative to sun exposure and proximity to energy loads.' },
                { icon: '🐔', title: 'Animal Integration', desc: 'Chicken tractors, duck ponds, and rabbit systems positioned to maximise their role in nutrient cycling.' },
              ].map(e => (
                <div key={e.title} style={{ padding: '20px 18px', borderRadius: 14, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.1)' }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{e.icon}</div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: '#f2fffa', margin: '0 0 6px' }}>{e.title}</h3>
                  <p style={{ fontSize: 12, color: '#aaf0d2', lineHeight: 1.7, margin: 0 }}>{e.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 32 }}>Permaculture Design — Frequently Asked Questions</h2>
            {[
              { q: 'Do I need a permaculture certificate to design my property?', a: 'No. A Permaculture Design Certificate (PDC) is valuable for professional designers and educators, but for designing your own property, the principles are straightforward to apply. TerraForge embeds the design logic so you get PDC-quality plans without needing to take a course first.' },
              { q: 'How is permaculture design different from organic gardening?', a: 'Organic gardening focuses on growing food without synthetic inputs. Permaculture design is a whole-system design methodology — it determines what to grow, where to put it, how to manage water, which animals to integrate, how to build soil, and how to create a self-sustaining ecosystem. Organic gardening is one tool within permaculture.' },
              { q: 'Can permaculture work in a small urban garden?', a: 'Absolutely. Many permaculture principles apply regardless of scale — stacking functions, using edges, companion planting, composting, and rainwater harvesting all work in a 10m² urban garden. TerraForge scales its designs accordingly.' },
              { q: 'How long does permaculture design take to implement?', a: 'Most permaculture designs are implemented in phases over 3–10 years. Year 1 focuses on water, soil, and perennial establishment. Years 2–5 on filling out food forests and annual systems. Years 5–10 on refinement and expansion. TerraForge\'s deploy planner breaks this into manageable phases.' },
            ].map(faq => (
              <div key={faq.q} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,255,170,0.08)' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: '#f2fffa', margin: '0 0 10px' }}>{faq.q}</h3>
                <p style={{ fontSize: 14, color: '#aaf0d2', lineHeight: 1.8, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#f2fffa', marginBottom: 20 }}>Related Tools</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
              {[
                { href: '/homestead-planner', label: '🏡 Homestead Planner' },
                { href: '/food-forest-planner', label: '🌳 Food Forest Planner' },
                { href: '/seasonal-planting-calendar', label: '📅 Seasonal Planting Calendar' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: 'block', padding: '16px 18px', borderRadius: 12, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.12)', color: '#00ffaa', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>{l.label}</Link>
              ))}
            </div>
          </section>

          <section style={{ textAlign: 'center', padding: '48px 32px', borderRadius: 24, background: 'linear-gradient(135deg,rgba(0,255,170,0.07),rgba(4,14,8,0.95))', border: '1px solid rgba(0,255,170,0.18)' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 800, color: '#f2fffa', margin: '0 0 14px' }}>Design Your Permaculture Property</h2>
            <p style={{ fontSize: 15, color: '#aaf0d2', margin: '0 0 28px', lineHeight: 1.6 }}>Free to start. Full zone map in under 30 seconds.</p>
            <Link href="/dashboard/garden" style={{ display: 'inline-block', padding: '15px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 800, fontSize: 16, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
              Start My Permaculture Design →
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
