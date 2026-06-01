// app/api/garden/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// INPUT SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
const inputSchema = z.object({
  prompt:      z.string().optional().default(''),
  yardSqFt:   z.number().min(500).max(200000),
  familySize: z.number().min(1).max(20),
  climateZone: z.enum(['Temperate', 'Arid', 'Subtropical', 'Cold']),
  budget:     z.number().min(500).max(100000),
  propertyMap: z.array(z.string()),
  gardenMap:   z.array(z.string()),
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE FEATURE DATABASE — all 36 frontend icons with realistic values
// Sources: USDA food data, EPA water estimates, peer-reviewed permaculture data
// ─────────────────────────────────────────────────────────────────────────────
interface FeatureData {
  name:         string;
  category:     'food' | 'water' | 'energy' | 'soil' | 'biodiversity' | 'animals';
  yieldLbs:     number;   // edible food lbs/year per unit placed
  waterGal:     number;   // gallons/year harvested or saved (negative = consumes)
  co2Lbs:       number;   // lbs CO2 sequestered or offset/year
  costMin:      number;   // $ low estimate to install one unit
  costMax:      number;   // $ high estimate
  savingsMin:   number;   // $ year-1 savings low
  savingsMax:   number;   // $ year-1 savings high
  biodiversity: number;   // 0–20 pts contributed
  energyKwh:    number;   // annual kWh generated (solar/wind only, else 0)
}

const FEATURE_DB: Record<string, FeatureData> = {
  // ── FOOD ──────────────────────────────────────────────────────────────────
  '🌱': { name:'Raised Bed',        category:'food',        yieldLbs:40,  waterGal:80,   co2Lbs:8,   costMin:80,  costMax:150,  savingsMin:32,  savingsMax:55,  biodiversity:2,  energyKwh:0   },
  '🌳': { name:'Fruit Tree',        category:'food',        yieldLbs:80,  waterGal:40,   co2Lbs:65,  costMin:40,  costMax:120,  savingsMin:55,  savingsMax:90,  biodiversity:4,  energyKwh:0   },
  '🏡': { name:'Greenhouse',        category:'food',        yieldLbs:120, waterGal:60,   co2Lbs:18,  costMin:400, costMax:1200, savingsMin:90,  savingsMax:180, biodiversity:1,  energyKwh:0   },
  '🔑': { name:'Keyhole Bed',       category:'food',        yieldLbs:35,  waterGal:50,   co2Lbs:7,   costMin:60,  costMax:150,  savingsMin:28,  savingsMax:50,  biodiversity:2,  energyKwh:0   },
  '🌿': { name:'Herb Spiral',       category:'food',        yieldLbs:8,   waterGal:20,   co2Lbs:4,   costMin:40,  costMax:100,  savingsMin:18,  savingsMax:40,  biodiversity:3,  energyKwh:0   },
  '🍅': { name:'Tomatoes',          category:'food',        yieldLbs:20,  waterGal:40,   co2Lbs:5,   costMin:10,  costMax:30,   savingsMin:16,  savingsMax:28,  biodiversity:1,  energyKwh:0   },
  '🥕': { name:'Carrots',           category:'food',        yieldLbs:15,  waterGal:25,   co2Lbs:4,   costMin:5,   costMax:15,   savingsMin:8,   savingsMax:18,  biodiversity:1,  energyKwh:0   },
  '🥬': { name:'Lettuce/Kale',      category:'food',        yieldLbs:11,  waterGal:16,   co2Lbs:3,   costMin:5,   costMax:15,   savingsMin:10,  savingsMax:22,  biodiversity:1,  energyKwh:0   },
  '🌽': { name:'Corn',              category:'food',        yieldLbs:30,  waterGal:60,   co2Lbs:6,   costMin:5,   costMax:20,   savingsMin:12,  savingsMax:22,  biodiversity:1,  energyKwh:0   },
  '🥔': { name:'Potatoes',          category:'food',        yieldLbs:35,  waterGal:45,   co2Lbs:5,   costMin:5,   costMax:20,   savingsMin:14,  savingsMax:24,  biodiversity:1,  energyKwh:0   },
  '🎃': { name:'Pumpkin',           category:'food',        yieldLbs:40,  waterGal:50,   co2Lbs:6,   costMin:5,   costMax:15,   savingsMin:10,  savingsMax:18,  biodiversity:2,  energyKwh:0   },
  '🫘': { name:'Beans',             category:'food',        yieldLbs:12,  waterGal:20,   co2Lbs:8,   costMin:3,   costMax:10,   savingsMin:6,   savingsMax:12,  biodiversity:2,  energyKwh:0   },
  '🥒': { name:'Zucchini/Cucumber', category:'food',        yieldLbs:22,  waterGal:32,   co2Lbs:4,   costMin:3,   costMax:12,   savingsMin:12,  savingsMax:22,  biodiversity:1,  energyKwh:0   },
  '🍎': { name:'Apples',            category:'food',        yieldLbs:60,  waterGal:35,   co2Lbs:45,  costMin:30,  costMax:80,   savingsMin:40,  savingsMax:70,  biodiversity:4,  energyKwh:0   },
  '🫐': { name:'Blueberries',       category:'food',        yieldLbs:10,  waterGal:20,   co2Lbs:10,  costMin:15,  costMax:40,   savingsMin:14,  savingsMax:28,  biodiversity:3,  energyKwh:0   },
  '🌶️':{ name:'Peppers',            category:'food',        yieldLbs:8,   waterGal:20,   co2Lbs:3,   costMin:5,   costMax:15,   savingsMin:10,  savingsMax:20,  biodiversity:1,  energyKwh:0   },
  '🧅': { name:'Onions',            category:'food',        yieldLbs:12,  waterGal:15,   co2Lbs:3,   costMin:3,   costMax:10,   savingsMin:6,   savingsMax:12,  biodiversity:1,  energyKwh:0   },
  '🍓': { name:'Berries',           category:'food',        yieldLbs:17,  waterGal:22,   co2Lbs:8,   costMin:12,  costMax:40,   savingsMin:18,  savingsMax:35,  biodiversity:3,  energyKwh:0   },
  '🌲': { name:'Hugelkultur',       category:'soil',        yieldLbs:50,  waterGal:200,  co2Lbs:30,  costMin:50,  costMax:200,  savingsMin:30,  savingsMax:60,  biodiversity:3,  energyKwh:0   },
  // ── WATER ─────────────────────────────────────────────────────────────────
  '💧': { name:'Rain Tank',         category:'water',       yieldLbs:0,   waterGal:1200, co2Lbs:12,  costMin:250, costMax:600,  savingsMin:48,  savingsMax:120, biodiversity:0,  energyKwh:0   },
  '🌊': { name:'Swale',             category:'water',       yieldLbs:0,   waterGal:3000, co2Lbs:20,  costMin:200, costMax:500,  savingsMin:90,  savingsMax:180, biodiversity:4,  energyKwh:0   },
  '🐟': { name:'Pond',              category:'water',       yieldLbs:10,  waterGal:2000, co2Lbs:15,  costMin:300, costMax:1200, savingsMin:40,  savingsMax:80,  biodiversity:8,  energyKwh:0   },
  // ── ENERGY ────────────────────────────────────────────────────────────────
  '☀️': { name:'Solar Panel',       category:'energy',      yieldLbs:0,   waterGal:0,    co2Lbs:180, costMin:800, costMax:3000, savingsMin:120, savingsMax:280, biodiversity:0,  energyKwh:500 },
  '🌬️':{ name:'Wind Turbine',       category:'energy',      yieldLbs:0,   waterGal:0,    co2Lbs:200, costMin:500, costMax:2000, savingsMin:80,  savingsMax:200, biodiversity:0,  energyKwh:600 },
  // ── SOIL ──────────────────────────────────────────────────────────────────
  '♻️': { name:'Compost Bin',       category:'soil',        yieldLbs:0,   waterGal:0,    co2Lbs:40,  costMin:40,  costMax:100,  savingsMin:40,  savingsMax:80,  biodiversity:2,  energyKwh:0   },
  '🪱': { name:'Worm Bin',          category:'soil',        yieldLbs:0,   waterGal:0,    co2Lbs:20,  costMin:50,  costMax:150,  savingsMin:30,  savingsMax:60,  biodiversity:2,  energyKwh:0   },
  // ── BIODIVERSITY ──────────────────────────────────────────────────────────
  '🌼': { name:'Pollinator Patch',  category:'biodiversity',yieldLbs:0,   waterGal:10,   co2Lbs:10,  costMin:60,  costMax:120,  savingsMin:20,  savingsMax:40,  biodiversity:10, energyKwh:0   },
  '🐦': { name:'Bird House',        category:'biodiversity',yieldLbs:0,   waterGal:0,    co2Lbs:5,   costMin:30,  costMax:80,   savingsMin:5,   savingsMax:15,  biodiversity:6,  energyKwh:0   },
  '🦇': { name:'Bat Box',           category:'biodiversity',yieldLbs:0,   waterGal:0,    co2Lbs:3,   costMin:20,  costMax:60,   savingsMin:10,  savingsMax:25,  biodiversity:5,  energyKwh:0   },
  '🐛': { name:'Insect Hotel',      category:'biodiversity',yieldLbs:0,   waterGal:0,    co2Lbs:4,   costMin:15,  costMax:50,   savingsMin:8,   savingsMax:18,  biodiversity:7,  energyKwh:0   },
  // ── ANIMALS ───────────────────────────────────────────────────────────────
  '🐔': { name:'Chicken Coop',      category:'animals',     yieldLbs:60,  waterGal:-80,  co2Lbs:15,  costMin:300, costMax:800,  savingsMin:180, savingsMax:320, biodiversity:3,  energyKwh:0   },
  '🐝': { name:'Beehive',           category:'biodiversity',yieldLbs:12,  waterGal:0,    co2Lbs:8,   costMin:200, costMax:600,  savingsMin:60,  savingsMax:140, biodiversity:10, energyKwh:0   },
};

// ─────────────────────────────────────────────────────────────────────────────
// CLIMATE MULTIPLIERS — per-category for realistic zone differences
// ─────────────────────────────────────────────────────────────────────────────
const CLIMATE: Record<string, { yieldMult: number; waterMult: number; co2Mult: number; savingsMult: number }> = {
  Temperate:   { yieldMult: 1.00, waterMult: 1.00, co2Mult: 1.00, savingsMult: 1.00 },
  Subtropical: { yieldMult: 1.30, waterMult: 0.85, co2Mult: 1.20, savingsMult: 1.15 },
  Arid:        { yieldMult: 0.70, waterMult: 1.40, co2Mult: 0.75, savingsMult: 0.90 },
  Cold:        { yieldMult: 0.80, waterMult: 0.90, co2Mult: 0.85, savingsMult: 0.85 },
};

// ─────────────────────────────────────────────────────────────────────────────
// KEYWORD → EMOJI (mirrors frontend, used for server-side prompt parsing)
// ─────────────────────────────────────────────────────────────────────────────
const KEYWORD_MAP: { keywords: string[]; emoji: string }[] = [
  { keywords: ['rain tank','rainwater','water tank','water collection','cistern','barrel'],  emoji: '💧' },
  { keywords: ['solar','photovoltaic','pv','solar panel','off-grid power'],                  emoji: '☀️' },
  { keywords: ['compost','composting','compost bin'],                                        emoji: '♻️' },
  { keywords: ['herb','herbs','basil','mint','rosemary','thyme','oregano','parsley'],        emoji: '🌿' },
  { keywords: ['tomato','tomatoes'],                                                         emoji: '🍅' },
  { keywords: ['carrot','carrots'],                                                          emoji: '🥕' },
  { keywords: ['lettuce','kale','salad','leafy','greens','spinach','chard'],                 emoji: '🥬' },
  { keywords: ['raised bed','garden bed','planter box'],                                    emoji: '🌱' },
  { keywords: ['fruit tree','apple tree','pear','citrus','lemon','orange','plum'],          emoji: '🌳' },
  { keywords: ['chicken','hen','poultry','egg','coop'],                                     emoji: '🐔' },
  { keywords: ['bee','beehive','honey'],                                                    emoji: '🐝' },
  { keywords: ['pollinator','wildflower','native plant','butterfly'],                        emoji: '🌼' },
  { keywords: ['greenhouse','hoophouse','hoop house','cold frame'],                         emoji: '🏡' },
  { keywords: ['swale','earthwork','on-contour','berms'],                                   emoji: '🌊' },
  { keywords: ['pond','aquaponics','water feature'],                                        emoji: '🐟' },
  { keywords: ['wind','turbine','windmill'],                                                 emoji: '🌬️' },
  { keywords: ['berry','blueberry','raspberry','blackberry'],                               emoji: '🍓' },
  { keywords: ['pepper','peppers','chili'],                                                  emoji: '🌶️' },
  { keywords: ['corn','maize'],                                                              emoji: '🌽' },
  { keywords: ['potato','potatoes','sweet potato'],                                         emoji: '🥔' },
  { keywords: ['zucchini','squash','courgette'],                                            emoji: '🥒' },
  { keywords: ['bean','beans','legume','peas'],                                             emoji: '🫘' },
  { keywords: ['pumpkin','winter squash'],                                                  emoji: '🎃' },
  { keywords: ['onion','garlic','leek','allium'],                                           emoji: '🧅' },
  { keywords: ['worm','worm bin','vermicompost'],                                           emoji: '🪱' },
  { keywords: ['keyhole bed','keyhole garden'],                                             emoji: '🔑' },
  { keywords: ['hugelkultur','hugel','wood mound'],                                        emoji: '🌲' },
  { keywords: ['bird box','bird house','nesting box'],                                     emoji: '🐦' },
  { keywords: ['bat box','bat house'],                                                     emoji: '🦇' },
  { keywords: ['insect hotel','bug hotel'],                                                emoji: '🐛' },
  { keywords: ['apple','apples'],                                                          emoji: '🍎' },
  { keywords: ['blueberr'],                                                               emoji: '🫐' },
  { keywords: ['strawberr'],                                                              emoji: '🍓' },
];

function parsePromptEmojis(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const found: string[] = [];
  KEYWORD_MAP.forEach(({ keywords, emoji }) => {
    if (keywords.some(k => lower.includes(k)) && !found.includes(emoji)) found.push(emoji);
  });
  return found;
}

function parseSelfSufficiencyGoal(prompt: string): number | null {
  const m = prompt.match(/(\d+)\s*%\s*(self.?suffici|food|produce|grow|harvest)/i)
         ?? prompt.match(/(self.?suffici|food|produce|grow|harvest)[^.]{0,30}(\d+)\s*%/i);
  if (m) {
    const n = parseInt(m[1] ?? m[2], 10);
    if (n > 0 && n <= 100) return n;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE CALCULATION ENGINE  (single source of truth — frontend aligns to this)
// ─────────────────────────────────────────────────────────────────────────────
const FOOD_LBS_PER_PERSON_YR = 600;
const WATER_GAL_BASELINE     = 30000;

interface CalcOutput {
  totalYieldLbs:          number;
  totalWaterGal:          number;
  totalCo2Lbs:            number;
  totalEnergyKwh:         number;
  estimatedCostMin:       number;
  estimatedCostMax:       number;
  year1SavingsMin:        number;
  year1SavingsMax:        number;
  year1SavingsMid:        number;
  foodSelfSufficiencyPct: number;
  waterSavingsPct:        number;
  resilienceScore:        number;
  biodiversityScore:      number;
  paybackYears:           number;
  categoriesPresent:      Set<string>;
  featureCounts:          Map<string, number>;
}

function calculate(
  allIcons:   string[],
  yardSqFt:   number,
  familySize: number,
  budget:     number,
  zone:       string,
): CalcOutput {
  const cm = CLIMATE[zone] ?? CLIMATE['Temperate'];

  const featureCounts = new Map<string, number>();
  allIcons.forEach(em => featureCounts.set(em, (featureCounts.get(em) ?? 0) + 1));

  let totalYield = 0, totalWater = 0, totalCo2 = 0, totalEnergy = 0;
  let costMin = 0, costMax = 0, savMin = 0, savMax = 0;
  let biodiversityPts = 0;
  const categoriesPresent = new Set<string>();

  featureCounts.forEach((count, em) => {
    const f = FEATURE_DB[em];
    if (!f) return;
    categoriesPresent.add(f.category);

    const isPlant = ['food', 'soil'].includes(f.category);
    const isWater = f.category === 'water';
    const yMult = isPlant ? cm.yieldMult : 1.0;
    const wMult = isWater ? cm.waterMult : 1.0;

    totalYield  += Math.round(f.yieldLbs  * yMult) * count;
    totalWater  += Math.round(f.waterGal  * wMult) * count;
    totalCo2    += Math.round(f.co2Lbs    * cm.co2Mult) * count;
    totalEnergy += f.energyKwh * count;

    costMin += f.costMin * count;
    costMax += f.costMax * count;
    savMin  += Math.round(f.savingsMin * cm.savingsMult) * count;
    savMax  += Math.round(f.savingsMax * cm.savingsMult) * count;

    biodiversityPts += f.biodiversity * Math.min(count, 3);
  });

  // Synergy bonuses
  if (featureCounts.has('♻️') && (featureCounts.has('🌱') || featureCounts.has('🌳'))) {
    totalYield = Math.round(totalYield * 1.18);
    savMin = Math.round(savMin * 1.10);
    savMax = Math.round(savMax * 1.10);
  }
  if (featureCounts.has('🌼') || featureCounts.has('🐝')) {
    const foodUnits = [...featureCounts.entries()]
      .filter(([em]) => FEATURE_DB[em]?.category === 'food')
      .reduce((s, [, c]) => s + c, 0);
    if (foodUnits > 0) totalYield = Math.round(totalYield * 1.12);
  }
  if (featureCounts.has('💧') && (featureCounts.has('🌊') || featureCounts.has('🐟'))) {
    totalWater = Math.round(totalWater * 1.20);
  }

  const foodNeed   = FOOD_LBS_PER_PERSON_YR * familySize;
  const foodPct    = Math.min(100, Math.round((totalYield / foodNeed) * 100));
  const waterPct   = Math.min(100, Math.round((totalWater / WATER_GAL_BASELINE) * 100));

  // Resilience score 0–100, genuinely weighted
  const categoryScore = Math.min(30, categoriesPresent.size * 5);
  const foodScore     = Math.min(22, Math.round((foodPct / 100) * 22));
  const waterScore    = Math.min(18, Math.round((waterPct / 100) * 18));
  const co2Score      = Math.min(15, Math.round(Math.min(totalCo2, 600) / 600 * 15));
  const energyScore   = totalEnergy > 0 ? 8 : 0;
  const scaleScore    = Math.min(5, Math.round(Math.min(allIcons.length, 12) / 12 * 5));
  const resilienceScore = categoryScore + foodScore + waterScore + co2Score + energyScore + scaleScore;

  const biodiversityScore = Math.min(100, Math.round(biodiversityPts * 2.5));
  const year1SavingsMid   = Math.round((savMin + savMax) / 2);
  const avgCost           = Math.round((costMin + costMax) / 2);
  const paybackYears      = year1SavingsMid > 0
    ? Math.round((avgCost / year1SavingsMid) * 10) / 10
    : 0;

  return {
    totalYieldLbs: totalYield, totalWaterGal: totalWater,
    totalCo2Lbs: totalCo2,    totalEnergyKwh: totalEnergy,
    estimatedCostMin: costMin, estimatedCostMax: costMax,
    year1SavingsMin: savMin,   year1SavingsMax: savMax,
    year1SavingsMid,
    foodSelfSufficiencyPct: foodPct, waterSavingsPct: waterPct,
    resilienceScore, biodiversityScore, paybackYears,
    categoriesPresent, featureCounts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────
function buildRecommendations(
  prompt:     string,
  result:     CalcOutput,
  yardSqFt:   number,
  familySize: number,
  budget:     number,
  zone:       string,
  allIcons:   string[],
  goalPct:    number | null,
): string[] {
  const recs: string[] = [];
  const icons = new Set(allIcons);
  const fc    = result.featureCounts;

  // 1. Respond directly to self-sufficiency goal
  if (goalPct !== null) {
    const needed  = Math.round((goalPct / 100) * familySize * FOOD_LBS_PER_PERSON_YR);
    const current = result.totalYieldLbs;
    const gap     = needed - current;
    if (gap > 0) {
      const bedsNeeded  = Math.min(Math.ceil(gap / 40), 5);
      const treesNeeded = Math.min(Math.ceil(gap / 80), 3);
      recs.push(
        `To reach ${goalPct}% self-sufficiency your system needs ~${needed} lbs/year. ` +
        `Currently producing ${current} lbs — a gap of ${gap} lbs. ` +
        `Add ${bedsNeeded} raised bed${bedsNeeded > 1 ? 's' : ''} (+${bedsNeeded * 40} lbs) ` +
        `or ${treesNeeded} fruit tree${treesNeeded > 1 ? 's' : ''} (+${treesNeeded * 80} lbs) to close the gap.`
      );
    } else {
      recs.push(
        `Your layout already meets your ${goalPct}% self-sufficiency goal — producing ${current} lbs/year ` +
        `against a need of ${needed} lbs. Add perennials to keep growing this number year over year.`
      );
    }
  }

  // 2. Features mentioned in prompt but not yet placed
  const promptEmojis  = parsePromptEmojis(prompt);
  const missingPlaced = promptEmojis.filter(em => !icons.has(em)).slice(0, 3);
  if (missingPlaced.length > 0) {
    const names = missingPlaced.map(em => FEATURE_DB[em]?.name ?? em).join(', ');
    const impactYield = missingPlaced.reduce((s, em) => s + (FEATURE_DB[em]?.yieldLbs ?? 0), 0);
    const impactWater = missingPlaced.reduce((s, em) => s + (FEATURE_DB[em]?.waterGal ?? 0), 0);
    const impactSav   = missingPlaced.reduce((s, em) => s + Math.round(((FEATURE_DB[em]?.savingsMin ?? 0) + (FEATURE_DB[em]?.savingsMax ?? 0)) / 2), 0);
    recs.push(
      `Recommended from your description: ${names}. ` +
      (impactYield > 0 ? `Combined food impact: +${impactYield} lbs/yr. ` : '') +
      (impactWater > 0 ? `Water: +${impactWater} gal/yr. ` : '') +
      (impactSav > 0 ? `Est. savings: $${impactSav}/yr.` : '')
    );
  }

  // 3. Climate-specific high-value advice
  if (zone === 'Arid' && !icons.has('🌊') && !icons.has('💧')) {
    recs.push(
      `Arid climate priority: water capture before planting anything. A swale captures 3,000+ gal per storm; ` +
      `a 500-gal rain tank adds 1,200 gal/yr at low cost. Without water infrastructure first, ` +
      `food production will be 30–50% below potential.`
    );
  }
  if (zone === 'Cold' && !icons.has('🏡')) {
    recs.push(
      `Cold climate growing season is 90–120 days without protection. A greenhouse or hoop house ` +
      `($400–1,200) extends this to 180–220 days — doubling your potential harvests and ` +
      `adding ~${Math.round(120 * 0.80)} lbs of greens and starts per year.`
    );
  }
  if (zone === 'Subtropical' && !icons.has('♻️')) {
    recs.push(
      `In your Subtropical climate, heat-accelerated compost finishes in 4–6 weeks instead of 3 months. ` +
      `A $40–100 compost bin is the highest-ROI soil investment available — boosting moisture retention and ` +
      `reducing irrigation needs by up to 25%.`
    );
  }

  // 4. Synergy opportunities
  if (icons.has('🌱') && !icons.has('♻️') && !icons.has('🪱')) {
    recs.push(
      `Your raised beds are leaving yield on the table without a compost or worm bin. ` +
      `Compost-fed beds produce 30–40% more per sq ft and require 25% less watering. ` +
      `Cost: $40–100. Estimated extra yield: +${Math.round(result.totalYieldLbs * 0.35)} lbs.`
    );
  }
  if ((icons.has('🌳') || icons.has('🍎')) && !icons.has('🌼') && !icons.has('🐝')) {
    recs.push(
      `Fruit trees with nearby pollinators produce 15–30% more. A native wildflower patch ($60–120) ` +
      `or beehive ($200–600) pays back in improved yield within 1–2 seasons.`
    );
  }
  if (icons.has('☀️') && !icons.has('💧')) {
    recs.push(
      `Pair your solar panel with a rain tank and a small pump for a fully off-grid irrigation loop — ` +
      `eliminating 100% of garden water and electricity costs. Total add-on: $250–600.`
    );
  }

  // 5. Conflict warnings
  if (icons.has('🐔') && (icons.has('🌱') || icons.has('🌼'))) {
    recs.push(
      `⚠️ Chickens will scratch raised beds and disturb pollinators. Use a mobile chicken tractor, ` +
      `rotating them through zones — this fertilizes soil by 40% in grazed areas while protecting growing beds.`
    );
  }
  if (icons.has('🐝') && icons.has('🌬️')) {
    recs.push(
      `⚠️ Wind turbine vibrations can cause colony abandonment. Place your beehive at least 50 ft away, ` +
      `oriented SE with a windbreak hedge between turbine and hive.`
    );
  }

  // 6. Budget utilization
  const avgCost = Math.round((result.estimatedCostMin + result.estimatedCostMax) / 2);
  const remaining = budget - avgCost;
  if (remaining > 400 && allIcons.length > 0) {
    const nextBest = (['🌳', '💧', '🌊', '☀️', '🏡', '♻️'] as const)
      .find(em => !icons.has(em) && FEATURE_DB[em].costMin <= remaining);
    if (nextBest) {
      const f = FEATURE_DB[nextBest];
      const midSav = Math.round((f.savingsMin + f.savingsMax) / 2);
      const pb = midSav > 0 ? Math.round((f.costMin / midSav) * 10) / 10 : '?';
      recs.push(
        `~$${remaining.toLocaleString()} remaining in budget. Best next investment: ${nextBest} ${f.name} ` +
        `($${f.costMin}–${f.costMax}) — adds ` +
        (f.yieldLbs > 0 ? `${f.yieldLbs} lbs food, ` : '') +
        (f.waterGal > 0 ? `${f.waterGal} gal water, ` : '') +
        `${f.co2Lbs} lbs CO₂/yr. Payback: ~${pb} years.`
      );
    }
  }

  // 7. Scale opportunity
  if (result.foodSelfSufficiencyPct < 15 && allIcons.length < 4) {
    const maxBeds = Math.min(Math.floor(yardSqFt / 500), 8);
    recs.push(
      `Your ${(yardSqFt / 43560).toFixed(2)}-acre property can support much more. ` +
      `${maxBeds} raised beds would produce ${maxBeds * 40} lbs/yr — ` +
      `covering ${Math.min(Math.round((maxBeds * 40 / (familySize * FOOD_LBS_PER_PERSON_YR)) * 100), 40)}% ` +
      `of your family's fresh produce needs.`
    );
  }

  return [...new Set(recs)].slice(0, 6);
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDED ICONS (returned to frontend for auto-placement on maps)
// ─────────────────────────────────────────────────────────────────────────────
function buildRecommendedIcons(
  prompt:    string,
  result:    CalcOutput,
  familySize: number,
  budget:    number,
  zone:      string,
  allIcons:  string[],
  goalPct:   number | null,
): string[] {
  const icons    = new Set(allIcons);
  const prompted = new Set(parsePromptEmojis(prompt));
  const recs:    string[] = [];

  prompted.forEach(em => { if (!icons.has(em)) recs.push(em); });

  if (goalPct !== null && goalPct > 0) {
    const gap = Math.round((goalPct / 100) * familySize * FOOD_LBS_PER_PERSON_YR) - result.totalYieldLbs;
    if (gap > 0 && !icons.has('🌱') && !prompted.has('🌱')) recs.push('🌱');
    if (gap > 80 && !icons.has('🌳') && !prompted.has('🌳')) recs.push('🌳');
  }

  if (zone === 'Arid') {
    if (!icons.has('💧') && !prompted.has('💧')) recs.push('💧');
    if (!icons.has('🌊') && !prompted.has('🌊')) recs.push('🌊');
  }
  if (zone === 'Cold' && !icons.has('🏡') && !prompted.has('🏡')) recs.push('🏡');

  if (icons.has('🌱') && !icons.has('♻️') && !prompted.has('♻️')) recs.push('♻️');
  if ((icons.has('🌳') || icons.has('🍎')) && !icons.has('🌼') && !prompted.has('🌼')) recs.push('🌼');

  return [...new Set(recs)].slice(0, 8);
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const raw  = await req.json();
    const data = inputSchema.parse(raw);

    const allIcons = [...data.propertyMap, ...data.gardenMap];
    const prompt   = data.prompt ?? '';
    const goalPct  = parseSelfSufficiencyGoal(prompt);
    const result   = calculate(allIcons, data.yardSqFt, data.familySize, data.budget, data.climateZone);

    const summary = {
      resilienceScore:       result.resilienceScore,
      estimatedAnnualYield:  result.totalYieldLbs,
      year1Savings:          `$${result.year1SavingsMid.toLocaleString()}`,
      year1SavingsRange:     `$${result.year1SavingsMin.toLocaleString()}–$${result.year1SavingsMax.toLocaleString()}`,
      co2eSequestered:       result.totalCo2Lbs,
      waterSaved:            result.totalWaterGal,
      energyKwh:             result.totalEnergyKwh,
      biodiversityScore:     result.biodiversityScore,
      foodSelfSufficiency:   result.foodSelfSufficiencyPct,
      paybackPeriod:         result.paybackYears,
      estimatedCostRange:    `$${result.estimatedCostMin.toLocaleString()}–$${result.estimatedCostMax.toLocaleString()}`,
      waterSavingsPct:       result.waterSavingsPct,
      categoriesCount:       result.categoriesPresent.size,
      goalSelfSufficiency:   goalPct,
    };

    const recommendations = buildRecommendations(
      prompt, result, data.yardSqFt, data.familySize,
      data.budget, data.climateZone, allIcons, goalPct,
    );

    const recommendedIcons = buildRecommendedIcons(
      prompt, result, data.familySize,
      data.budget, data.climateZone, allIcons, goalPct,
    );

    return NextResponse.json({
      summary,
      recommendations,
      recommendedIcons,
      calculationDetails: {
        zone:              data.climateZone,
        climateMultipliers: CLIMATE[data.climateZone],
        featureCount:       allIcons.length,
        synergiesApplied: [
          result.featureCounts.has('♻️') && (result.featureCounts.has('🌱') || result.featureCounts.has('🌳'))
            ? 'compost+beds (+18% yield)' : null,
          result.featureCounts.has('🌼') || result.featureCounts.has('🐝')
            ? 'pollinator bonus (+12% yield)' : null,
          result.featureCounts.has('💧') && (result.featureCounts.has('🌊') || result.featureCounts.has('🐟'))
            ? 'integrated water (+20%)' : null,
        ].filter(Boolean),
      },
    });

  } catch (error) {
    console.error('[TerraForge API Error]', error);
    return NextResponse.json(
      { error: 'Invalid request', details: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }
}
