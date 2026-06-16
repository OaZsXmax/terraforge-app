import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Seasonal Planting Calendar — Month-by-Month Guide by Climate Zone | TerraForge',
  description: 'Free seasonal planting calendar for Temperate, Arid, Subtropical, Tropical, and Cold climates. Know exactly what to plant, harvest, and build every month of the year.',
  keywords: 'seasonal planting calendar, planting calendar by zone, when to plant vegetables, homestead planting schedule, permaculture planting calendar, monthly planting guide',
  openGraph: {
    title: 'Seasonal Planting Calendar — TerraForge',
    description: 'Month-by-month planting calendars for every climate zone. Free for homesteaders and permaculture growers.',
    url: 'https://www.terraforgehome.com/seasonal-planting-calendar',
    siteName: 'TerraForge',
    type: 'website',
  },
  alternates: { canonical: 'https://www.terraforgehome.com/seasonal-planting-calendar' },
};

const CALENDARS: Record<string, { season: string; color: string; plant: string[]; harvest: string[]; build: string }[]> = {
  Temperate: [
    { season: 'Winter (Dec–Feb)', color: '#93c5fd', plant: ['Garlic (early)', 'Broad beans', 'Overwintering onions'], harvest: ['Leeks', 'Parsnips', 'Winter greens', 'Brussels sprouts'], build: 'Plan rotations, order seeds, prune dormant fruit trees, build new beds' },
    { season: 'Spring (Mar–May)', color: '#4ade80', plant: ['Tomatoes (indoors)', 'Peppers', 'Cucumbers', 'Lettuce', 'Peas', 'Potatoes'], harvest: ['Asparagus', 'Rhubarb', 'Spring greens', 'Radishes'], build: 'Prepare beds, install rain tanks before rains, plant bare-root fruit trees' },
    { season: 'Summer (Jun–Aug)', color: '#facc15', plant: ['Beans (direct sow)', 'Corn', 'Squash', 'Late brassicas'], harvest: ['Tomatoes', 'Cucumbers', 'Courgettes', 'Beans', 'Berries', 'Garlic'], build: 'Mulch all beds deeply, set up drip irrigation, harvest and dry herbs' },
    { season: 'Autumn (Sep–Nov)', color: '#fb923c', plant: ['Garlic', 'Winter salads', 'Cover crops', 'Spring bulbs'], harvest: ['Squash', 'Root vegetables', 'Apples', 'Pears', 'Late tomatoes'], build: 'Plant food forest trees, build compost, install earthworks before winter rains' },
  ],
  Arid: [
    { season: 'Winter (Dec–Feb)', color: '#93c5fd', plant: ['Tomatoes', 'Peppers', 'Brassicas', 'Root veg', 'Citrus'], harvest: ['Citrus', 'Root vegetables', 'Winter greens', 'Herbs'], build: 'Main infrastructure season — earthworks, swales, water systems in mild weather' },
    { season: 'Spring (Mar–May)', color: '#4ade80', plant: ['Heat-tolerant crops early', 'Melons', 'Sweet potato'], harvest: ['Spring brassicas', 'Root crops', 'Citrus finish'], build: 'Install shade cloth, plant windbreaks, mulch to 6 inches before heat arrives' },
    { season: 'Summer (Jun–Aug)', color: '#facc15', plant: ['Drought-hardy varieties only', 'Okra', 'Amaranth'], harvest: ['Melons', 'Peppers', 'Figs', 'Summer fruits'], build: 'Water only at dawn and dusk, maintain mulch depth, monitor tank levels' },
    { season: 'Autumn (Sep–Nov)', color: '#fb923c', plant: ['Brassicas', 'Root veg', 'Leafy greens', 'Legumes'], harvest: ['Pomegranate', 'Late peppers', 'Winter squash'], build: 'Second major planting season — soil building, earthworks, tree planting' },
  ],
  Subtropical: [
    { season: 'Cool Dry (May–Aug)', color: '#93c5fd', plant: ['Most vegetables thrive', 'Brassicas', 'Root veg', 'Salads'], harvest: ['Avocado', 'Citrus', 'Pineapple', 'Leafy greens'], build: 'Best building season — establish new perennials, sheet mulch, build ponds' },
    { season: 'Build-Up (Sep–Nov)', color: '#4ade80', plant: ['Fast-maturing crops', 'Sweet corn', 'Beans'], harvest: ['Dry season crops finishing', 'Pawpaw', 'Bananas'], build: 'Prepare for wet — clear drains, stake tall plants, harvest and store seeds' },
    { season: 'Wet Season (Dec–Mar)', color: '#facc15', plant: ['Taro', 'Ginger', 'Turmeric', 'Water-loving crops'], harvest: ['Mango', 'Lychee', 'Bananas', 'Pawpaw', 'Tropical fruits'], build: 'Establish food forest trees in wet, control erosion, mulch paths heavily' },
    { season: 'Dry Season (Apr)', color: '#fb923c', plant: ['Tomatoes', 'Peppers', 'Eggplant', 'Cucumbers'], harvest: ['Root crops', 'Leafy greens', 'Citrus'], build: 'Irrigation systems, prune fruit trees after harvest, soil building' },
  ],
  Cold: [
    { season: 'Winter (Nov–Mar)', color: '#93c5fd', plant: ['Start seeds indoors (late Feb)', 'Overwintering garlic'], harvest: ['Stored root veg', 'Forage greens under snow', 'Kale after frost'], build: 'Plan and order seeds, repair tools, insulate compost, prune dormant trees' },
    { season: 'Spring (Apr–May)', color: '#4ade80', plant: ['Cold-hardy starts under cover', 'Peas', 'Spinach', 'Radishes'], harvest: ['Rhubarb', 'Asparagus (year 3+)', 'Overwintered greens'], build: 'Prepare beds as soon as workable, plant bare-root stock, cold frames' },
    { season: 'Summer (Jun–Aug)', color: '#facc15', plant: ['Everything — short season focus', 'Beans', 'Corn', 'Squash', 'Tomatoes outdoors'], harvest: ['Berries', 'Peas', 'Salads', 'Herbs', 'Early root veg'], build: 'Intensive season — plant, maintain, harvest. Preserve everything possible.' },
    { season: 'Autumn (Sep–Oct)', color: '#fb923c', plant: ['Garlic before ground freezes', 'Cover crops'], harvest: ['Apples', 'Root veg', 'Squash', 'All tender crops before frost'], build: 'Heavy mulch perennials, store root crops, plant garlic, build root cellar' },
  ],
};

export default function SeasonalPlantingCalendarPage() {
  return (
    <>
      <main style={{ background: '#0a1f15', minHeight: '100vh', color: '#d2fcea', fontFamily: "'Inter', sans-serif" }}>

        <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,255,170,0.1)', maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#00ffaa', textDecoration: 'none' }}>🌿 TerraForge</Link>
          <Link href="/dashboard/garden" style={{ padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Get My Calendar →</Link>
        </nav>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>

          <section style={{ textAlign: 'center', padding: '72px 0 56px' }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, background: 'rgba(0,255,170,0.08)', border: '1px solid rgba(0,255,170,0.2)', fontSize: 12, color: '#00ffaa', fontWeight: 600, marginBottom: 24, letterSpacing: '.06em', textTransform: 'uppercase' }}>Seasonal Planting Calendar</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: '#f2fffa', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-.02em' }}>
              Know Exactly What to Plant<br />Every Month of the Year
            </h1>
            <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#aaf0d2', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 36px' }}>
              Seasonal planting calendars for Temperate, Arid, Subtropical, and Cold climates — covering what to plant, what to harvest, and what to build each season. Get your personalised calendar inside TerraForge.
            </p>
            <Link href="/dashboard/garden" style={{ display: 'inline-block', padding: '15px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 800, fontSize: 16, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
              Get My Personalised Calendar →
            </Link>
            <p style={{ marginTop: 14, fontSize: 13, color: 'rgba(170,240,210,0.45)' }}>Free · Matched to your climate zone · Updates with your blueprint</p>
          </section>

          {/* Calendar tables by zone */}
          {Object.entries(CALENDARS).map(([zone, seasons]) => (
            <section key={zone} style={{ marginBottom: 64 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: '#f2fffa', marginBottom: 24 }}>
                {zone === 'Temperate' ? '🌲' : zone === 'Arid' ? '🌵' : zone === 'Subtropical' ? '🌴' : '❄️'} {zone} Planting Calendar
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {seasons.map(s => (
                  <div key={s.season} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,255,170,0.1)' }}>
                    <div style={{ padding: '12px 20px', background: `${s.color}18`, borderBottom: '1px solid rgba(0,255,170,0.08)' }}>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: s.color, fontSize: 15 }}>{s.season}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 0 }}>
                      <div style={{ padding: '16px 20px', borderRight: '1px solid rgba(0,255,170,0.07)' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#00ffaa', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>🌱 Plant Now</div>
                        {s.plant.map(p => <div key={p} style={{ fontSize: 13, color: '#aaf0d2', lineHeight: 1.8 }}>{p}</div>)}
                      </div>
                      <div style={{ padding: '16px 20px', borderRight: '1px solid rgba(0,255,170,0.07)' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#facc15', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>🧺 Harvest</div>
                        {s.harvest.map(h => <div key={h} style={{ fontSize: 13, color: '#aaf0d2', lineHeight: 1.8 }}>{h}</div>)}
                      </div>
                      <div style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>🔨 Build & Maintain</div>
                        <div style={{ fontSize: 13, color: '#aaf0d2', lineHeight: 1.8 }}>{s.build}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#f2fffa', marginBottom: 32 }}>Planting Calendar FAQs</h2>
            {[
              { q: 'Why do planting calendars vary so much between zones?', a: 'Frost dates, rainfall patterns, day length, and temperature ranges differ dramatically between climate zones. A tomato planted outdoors in March thrives in subtropical Queensland but would be killed by frost in Canada. Effective planting calendars are always zone-specific — generic calendars are often misleading.' },
              { q: 'How do I know which climate zone I\'m in?', a: 'TerraForge uses five zones: Temperate (four seasons, mild winters — UK, Pacific Northwest, New Zealand), Arid (hot dry summers, mild winters — SW USA, Mediterranean, outback Australia), Subtropical (wet/dry seasons, frost-rare — SE USA, coastal Queensland), Tropical (year-round heat and high rainfall — Hawaii, Far North Queensland, SE Asia), and Cold (short growing season, hard winters — Canada, Scandinavia, highland regions).' },
              { q: 'When should I start seeds indoors vs. direct sow?', a: 'Slow-growing crops that need a long season — tomatoes, peppers, eggplant, celery — should be started indoors 6–10 weeks before the last frost date. Fast-growing crops with sensitive roots — beans, corn, carrots, beetroot — are best direct-sown after the last frost. TerraForge\'s calendar specifies the method for each crop in your zone.' },
              { q: 'What is the most important thing to plant first on a homestead?', a: 'Perennials first, always. Fruit trees, food forest trees, and berry bushes should go in as early as possible because they take the longest to produce. Every year you delay planting a fruit tree is a year of lost harvest in year 5, 6, and 7. Annual vegetables can be planted any season — but that apple tree needs to go in now.' },
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
                { href: '/food-forest-planner', label: '🌳 Food Forest Planner' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: 'block', padding: '16px 18px', borderRadius: 12, background: 'rgba(0,255,170,0.04)', border: '1px solid rgba(0,255,170,0.12)', color: '#00ffaa', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>{l.label}</Link>
              ))}
            </div>
          </section>

          <section style={{ textAlign: 'center', padding: '48px 32px', borderRadius: 24, background: 'linear-gradient(135deg,rgba(0,255,170,0.07),rgba(4,14,8,0.95))', border: '1px solid rgba(0,255,170,0.18)' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 800, color: '#f2fffa', margin: '0 0 14px' }}>Get Your Personalised Planting Calendar</h2>
            <p style={{ fontSize: 15, color: '#aaf0d2', margin: '0 0 28px', lineHeight: 1.6 }}>Generate a blueprint and TerraForge builds your calendar automatically — matched to your zone, your plants, and your property.</p>
            <Link href="/dashboard/garden" style={{ display: 'inline-block', padding: '15px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#00ffaa,#00c47a)', color: '#0a1f15', fontWeight: 800, fontSize: 16, textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif" }}>
              Generate My Calendar →
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
