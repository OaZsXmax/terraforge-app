import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Food Forest Planner — Design a 7-Layer Food Forest with AI | TerraForge',
  description: 'Plan your food forest with AI. Get a 7-layer canopy design, plant selection by climate zone, yield estimates, and a phased planting calendar. Free to start.',
  keywords: 'food forest planner, food forest design, food forest layout, how to design a food forest, food forest plants, 7 layer food forest, backyard food forest',
  openGraph: {
    title: 'Food Forest Planner — TerraForge',
    description: 'AI-generated 7-layer food forest designs for any climate zone. Free to start.',
    url: 'https://www.terraforgehome.com/food-forest-planner',
    siteName: 'TerraForge',
    type: 'website',
  },
  alternates: { canonical: 'https://www.terraforgehome.com/food-forest-planner' },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TerraForge Food Forest Planner',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'AI food forest planner generating 7-layer canopy designs, climate-matched plant selections, yield estimates, and phased planting calendars.',
  url: 'https://www.terraforgehome.com',
};

export default function FoodForestPlannerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main style={{ background: '#0a1f15', minHeight: '100vh', color: '#d2fcea', fontFamily: "'Inter', sans-serif" }}>

        <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,255,170,0.1)', maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#00ffaa', textDecoration: 'none' }}>🌿 TerraForge</Link>
          <Link href="/dashboard/garden" style={{ padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Plan Free →</Link>
        </nav>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>

          <section style={{ textAlign: 'center', padding: '72px 0 56px' }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.2)', fontSize: 12, color: '#00ffaa', fontWeight: 600, marginBottom: 24, letterSpacing: '.06em', textTransform: 'uppercase' }}>Food Forest Planner</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: '#f2fffa', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-.02em' }}>
              Design Your Food Forest<br />in Minutes, Not Months
            </h1>
            <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#aaf0d2', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 36px' }}>
              TerraForge generates a complete 7-layer food forest design for your property — canopy trees, understory, shrubs, herbs, ground covers, climbers, and root crops — matched to your climate zone and available space.
            </p>
            <Link href="/dashboard/garden" style={{ display: 'inline-block', padding: '15px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 800, fontSize: 16, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
              Design My Food Forest →
            </Link>
            <p style={{ marginTop: 14, fontSize: 13, color: 'rgba(170,240,210,0.45)' }}>Free · Works in any climate · No design experience needed</p>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 16 }}>What Is a Food Forest?</h2>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8, marginBottom: 16 }}>
              A food forest — also called a forest garden — is a designed, multi-layered planting system that mimics the structure and function of a natural woodland, but is composed primarily of food-producing plants. Unlike a conventional orchard or vegetable garden, a food forest is largely self-maintaining once established: the layers work together to build soil, retain water, suppress weeds, and attract pollinators without constant human intervention.
            </p>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8, marginBottom: 16 }}>
              The concept draws on indigenous land management traditions from around the world, formalised into a design methodology by Robert Hart in the UK and popularised globally through the permaculture movement. A well-designed food forest can produce food for decades — even centuries — with minimal inputs.
            </p>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8 }}>
              A food forest can be established in a backyard of 200 square metres or scaled across many acres. TerraForge designs food forest components that fit within your overall homestead blueprint, sized and sited for your specific property.
            </p>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 32 }}>The 7 Layers of a Food Forest</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { num: '1', layer: 'Canopy Layer', color: '#00ffaa', plants: 'Standard fruit & nut trees', eg: 'Apple, pear, walnut, oak, chestnut', desc: 'The tallest layer — 6–12m. Forms the structural backbone of the forest. Provides shade, wind protection, and large yields of fruit and nuts.' },
                { num: '2', layer: 'Sub-Canopy Layer', color: '#00d4ff', plants: 'Dwarf fruit trees & large shrubs', eg: 'Dwarf apple, peach, mulberry, elder', desc: '3–6m tall. Fruit trees that tolerate partial shade. This is often the most productive layer per square metre in a food forest.' },
                { num: '3', layer: 'Shrub Layer', color: '#facc15', plants: 'Berry bushes & fruiting shrubs', eg: 'Blackcurrant, gooseberry, hazelnut, blueberry', desc: '1–3m. Soft fruit and nitrogen-fixing shrubs. Fills the mid-level and provides summer harvests while the canopy develops.' },
                { num: '4', layer: 'Herbaceous Layer', color: '#f472b6', plants: 'Perennial herbs & vegetables', eg: 'Comfrey, yarrow, fennel, asparagus', desc: 'Ground level to 1m. Perennial herbs, dynamic accumulators, and companion plants. Comfrey is the workhorse of this layer — chop-and-drop mulch.' },
                { num: '5', layer: 'Ground Cover Layer', color: '#a78bfa', plants: 'Low-growing spreaders', eg: 'Strawberry, mint, clover, creeping thyme', desc: 'Covers bare soil to suppress weeds, retain moisture, and provide habitat for beneficial insects and ground beetles.' },
                { num: '6', layer: 'Vine Layer', color: '#4ade80', plants: 'Climbing plants', eg: 'Grape, kiwi, passion fruit, runner bean', desc: 'Uses vertical space on trees, fences, and trellises. Often dramatically increases yield per square metre in a small food forest.' },
                { num: '7', layer: 'Root Layer', color: '#fb923c', plants: 'Root crops & underground fungi', eg: 'Jerusalem artichoke, oca, yacon, skirret', desc: 'Underground. Root crops that require minimal maintenance once established. Often overlooked but can provide substantial carbohydrate yields.' },
              ].map(l => (
                <div key={l.num} style={{ display: 'flex', gap: 16, padding: '18px 20px', borderRadius: 14, background: 'rgba(0,255,170,0.03)', border: '1px solid rgba(0,255,170,0.09)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${l.color}18`, border: `1px solid ${l.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: l.color, fontSize: 13, flexShrink: 0 }}>{l.num}</div>
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: l.color, margin: '0 0 2px' }}>{l.layer}</h3>
                    <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.5)', marginBottom: 6 }}>{l.plants} · e.g. {l.eg}</div>
                    <p style={{ fontSize: 13, color: '#aaf0d2', lineHeight: 1.7, margin: 0 }}>{l.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 16 }}>Food Forest Plants by Climate Zone</h2>
            <p style={{ fontSize: 15, color: '#aaf0d2', lineHeight: 1.8, marginBottom: 24 }}>Plant selection is the most climate-specific aspect of food forest design. TerraForge matches plants to your zone automatically:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
              {[
                { zone: 'Temperate', emoji: '🌲', canopy: 'Apple, pear, plum, walnut', shrub: 'Blackcurrant, gooseberry, hazel', ground: 'Strawberry, clover, comfrey' },
                { zone: 'Subtropical', emoji: '🌴', canopy: 'Avocado, mango, lychee', shrub: 'Banana, papaya, guava', ground: 'Sweet potato, ginger, turmeric' },
                { zone: 'Tropical', emoji: '🌿', canopy: 'Mango, breadfruit, jackfruit', shrub: 'Banana, cassava, moringa', ground: 'Taro, sweet potato, pineapple' },
                { zone: 'Arid', emoji: '🌵', canopy: 'Pomegranate, olive, carob', shrub: 'Prickly pear, agave, jujube', ground: 'Thyme, oregano, drought herbs' },
                { zone: 'Cold', emoji: '❄️', canopy: 'Hardy apple, pear, hawthorn', shrub: 'Gooseberry, hazel, elder', ground: 'Wild strawberry, wood sorrel' },
              ].map(z => (
                <div key={z.zone} style={{ padding: '18px 16px', borderRadius: 14, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.1)' }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{z.emoji}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#00ffaa', fontSize: 14, marginBottom: 10 }}>{z.zone}</div>
                  <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.6)', marginBottom: 4 }}><strong style={{ color: '#aaf0d2' }}>Canopy:</strong> {z.canopy}</div>
                  <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.6)', marginBottom: 4 }}><strong style={{ color: '#aaf0d2' }}>Shrub:</strong> {z.shrub}</div>
                  <div style={{ fontSize: 11, color: 'rgba(170,240,210,0.6)' }}><strong style={{ color: '#aaf0d2' }}>Ground:</strong> {z.ground}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 32 }}>Food Forest FAQs</h2>
            {[
              { q: 'How long does a food forest take to establish?', a: 'A food forest goes through three phases. The establishment phase (years 1–3) requires the most work — planting, watering, and mulching. The development phase (years 3–7) sees rapid growth, with soft fruit yielding heavily while canopy trees develop. The mature phase (year 7+) is when the forest becomes largely self-maintaining and canopy trees produce full harvests. Yields increase every year as the system matures.' },
              { q: 'How much space do I need for a food forest?', a: 'A meaningful food forest can begin in as little as 20–50 square metres, focusing on the shrub, herbaceous, ground cover, and vine layers with just 1–2 small canopy trees. A more complete system including full canopy trees benefits from 200+ square metres. TerraForge sizes recommendations to your available space.' },
              { q: 'Do I need to water a food forest?', a: 'Established food forests are largely drought-resilient — the canopy provides shade that reduces evaporation, deep mulch retains moisture, and extensive root systems access deep water. During the first 1–3 years of establishment, regular watering is important. After that, most temperate food forests require little to no supplemental irrigation.' },
              { q: 'Can a food forest replace a vegetable garden?', a: 'A food forest complements rather than replaces annual vegetable growing. Food forests produce perennial yields — fruit, nuts, berries, herbs — but most annual vegetables like tomatoes, beans, and salad crops grow poorly in shade. Most homesteads benefit from combining a food forest with a sunny annual vegetable zone, as TerraForge blueprints do.' },
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
                { href: '/permaculture-design', label: '🌀 Permaculture Design Tool' },
                { href: '/seasonal-planting-calendar', label: '📅 Seasonal Planting Calendar' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: 'block', padding: '16px 18px', borderRadius: 12, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.12)', color: '#00ffaa', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>{l.label}</Link>
              ))}
            </div>
          </section>

          <section style={{ textAlign: 'center', padding: '48px 32px', borderRadius: 24, background: 'linear-gradient(135deg,rgba(0,255,170,0.07),rgba(4,14,8,0.95))', border: '1px solid rgba(0,255,170,0.18)' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 800, color: '#f2fffa', margin: '0 0 14px' }}>Design Your Food Forest Today</h2>
            <p style={{ fontSize: 15, color: '#aaf0d2', margin: '0 0 28px', lineHeight: 1.6 }}>Free to start. 7-layer design in under 30 seconds.</p>
            <Link href="/dashboard/garden" style={{ display: 'inline-block', padding: '15px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 800, fontSize: 16, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
              Design My Food Forest →
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
