// app/dashboard/garden/generate.ts
// AI-powered blueprint generation — calls /api/generate-blueprint (server-side proxy to Claude)

const FOOD_LBS_PER_PERSON_YR = 600;
const WATER_GAL_BASELINE     = 30000;

const FEATURE_DB: Record<string, { name:string; category:string; yieldLbs:number; waterGal:number; co2Lbs:number; costMin:number; costMax:number; savingsMin:number; savingsMax:number }> = {
  '🌱':{ name:'Raised Bed',         category:'food',         yieldLbs:40,  waterGal:80,   co2Lbs:8,   costMin:80,  costMax:150,  savingsMin:32, savingsMax:55  },
  '🏡':{ name:'Greenhouse',         category:'food',         yieldLbs:200, waterGal:60,   co2Lbs:18,  costMin:400, costMax:1200, savingsMin:90, savingsMax:180 },
  '🌿':{ name:'Herb Spiral',        category:'food',         yieldLbs:8,   waterGal:20,   co2Lbs:4,   costMin:40,  costMax:100,  savingsMin:18, savingsMax:40  },
  '🍅':{ name:'Tomatoes',           category:'food',         yieldLbs:20,  waterGal:40,   co2Lbs:5,   costMin:10,  costMax:30,   savingsMin:16, savingsMax:28  },
  '🥕':{ name:'Carrots',            category:'food',         yieldLbs:15,  waterGal:25,   co2Lbs:4,   costMin:5,   costMax:15,   savingsMin:8,  savingsMax:18  },
  '🥬':{ name:'Kale',               category:'food',         yieldLbs:11,  waterGal:16,   co2Lbs:3,   costMin:5,   costMax:15,   savingsMin:10, savingsMax:22  },
  '🌽':{ name:'Corn',               category:'food',         yieldLbs:30,  waterGal:60,   co2Lbs:6,   costMin:5,   costMax:20,   savingsMin:12, savingsMax:22  },
  '🥔':{ name:'Potatoes',           category:'food',         yieldLbs:35,  waterGal:45,   co2Lbs:5,   costMin:5,   costMax:20,   savingsMin:14, savingsMax:24  },
  '🫘':{ name:'Beans',              category:'food',         yieldLbs:12,  waterGal:20,   co2Lbs:8,   costMin:3,   costMax:10,   savingsMin:6,  savingsMax:12  },
  '🥒':{ name:'Cucumbers',          category:'food',         yieldLbs:18,  waterGal:30,   co2Lbs:4,   costMin:3,   costMax:12,   savingsMin:10, savingsMax:20  },
  '🫑':{ name:'Zucchini',            category:'food',         yieldLbs:25,  waterGal:35,   co2Lbs:5,   costMin:3,   costMax:10,   savingsMin:12, savingsMax:22  },
  '🍎':{ name:'Apple Tree',         category:'food',         yieldLbs:60,  waterGal:35,   co2Lbs:45,  costMin:30,  costMax:80,   savingsMin:40, savingsMax:70  },
  '🍋':{ name:'Lemon Tree',         category:'food',         yieldLbs:50,  waterGal:32,   co2Lbs:42,  costMin:30,  costMax:75,   savingsMin:35, savingsMax:65  },
  '🍑':{ name:'Peach Tree',         category:'food',         yieldLbs:55,  waterGal:38,   co2Lbs:40,  costMin:25,  costMax:70,   savingsMin:38, savingsMax:65  },
  '🍐':{ name:'Pear Tree',          category:'food',         yieldLbs:65,  waterGal:36,   co2Lbs:50,  costMin:30,  costMax:80,   savingsMin:40, savingsMax:70  },
  '🥭':{ name:'Mango Tree',         category:'food',         yieldLbs:60,  waterGal:42,   co2Lbs:48,  costMin:40,  costMax:100,  savingsMin:45, savingsMax:80  },
  '🍌':{ name:'Banana Tree',        category:'food',         yieldLbs:80,  waterGal:50,   co2Lbs:40,  costMin:25,  costMax:70,   savingsMin:50, savingsMax:85  },
  '🍄':{ name:'Fig Tree',           category:'food',         yieldLbs:30,  waterGal:22,   co2Lbs:28,  costMin:25,  costMax:65,   savingsMin:22, savingsMax:45  },
  '🫚':{ name:'Plum Tree',          category:'food',         yieldLbs:40,  waterGal:30,   co2Lbs:38,  costMin:25,  costMax:65,   savingsMin:28, savingsMax:55  },
  '🍊':{ name:'Orange Tree',        category:'food',         yieldLbs:55,  waterGal:35,   co2Lbs:42,  costMin:30,  costMax:80,   savingsMin:38, savingsMax:68  },
  '🍒':{ name:'Cherry Tree',        category:'food',         yieldLbs:30,  waterGal:28,   co2Lbs:35,  costMin:25,  costMax:70,   savingsMin:22, savingsMax:48  },
  '🫀':{ name:'Pomegranate Tree',   category:'food',         yieldLbs:25,  waterGal:22,   co2Lbs:30,  costMin:20,  costMax:60,   savingsMin:18, savingsMax:40  },
  '🥑':{ name:'Avocado Tree',       category:'food',         yieldLbs:40,  waterGal:28,   co2Lbs:35,  costMin:30,  costMax:90,   savingsMin:35, savingsMax:70  },
  '🍍':{ name:'Pineapple Tree',     category:'food',         yieldLbs:20,  waterGal:25,   co2Lbs:12,  costMin:10,  costMax:30,   savingsMin:12, savingsMax:25  },
  '🫐':{ name:'Blueberries',        category:'food',         yieldLbs:10,  waterGal:20,   co2Lbs:10,  costMin:15,  costMax:40,   savingsMin:14, savingsMax:28  },
  '🍁':{ name:'Berry Bush',         category:'food',         yieldLbs:25,  waterGal:30,   co2Lbs:12,  costMin:20,  costMax:60,   savingsMin:18, savingsMax:38  },
  '🍓':{ name:'Strawberries',       category:'food',         yieldLbs:17,  waterGal:22,   co2Lbs:8,   costMin:12,  costMax:40,   savingsMin:18, savingsMax:35  },
  '🍉':{ name:'Watermelon',         category:'food',         yieldLbs:50,  waterGal:55,   co2Lbs:7,   costMin:4,   costMax:12,   savingsMin:10, savingsMax:20  },
  '🎃':{ name:'Pumpkin',             category:'food',         yieldLbs:40,  waterGal:50,   co2Lbs:6,   costMin:5,   costMax:15,   savingsMin:10, savingsMax:20  },
  '🍈':{ name:'Cantaloupe',          category:'food',         yieldLbs:30,  waterGal:40,   co2Lbs:5,   costMin:4,   costMax:10,   savingsMin:8,  savingsMax:16  },
  '🍇':{ name:'Grapes',             category:'food',         yieldLbs:35,  waterGal:30,   co2Lbs:20,  costMin:20,  costMax:60,   savingsMin:20, savingsMax:40  },
  '🌶️':{ name:'Peppers',           category:'food',         yieldLbs:8,   waterGal:20,   co2Lbs:3,   costMin:5,   costMax:15,   savingsMin:10, savingsMax:20  },
  '🧅':{ name:'Onions',             category:'food',         yieldLbs:12,  waterGal:15,   co2Lbs:3,   costMin:3,   costMax:10,   savingsMin:6,  savingsMax:12  },
  '🧄':{ name:'Garlic',             category:'food',         yieldLbs:8,   waterGal:12,   co2Lbs:2,   costMin:3,   costMax:8,    savingsMin:5,  savingsMax:12  },
  '🥦':{ name:'Broccoli',           category:'food',         yieldLbs:15,  waterGal:20,   co2Lbs:4,   costMin:3,   costMax:10,   savingsMin:8,  savingsMax:16  },
  '🍆':{ name:'Eggplant',           category:'food',         yieldLbs:18,  waterGal:28,   co2Lbs:4,   costMin:4,   costMax:12,   savingsMin:10, savingsMax:20  },
  '🥗':{ name:'Cabbage',            category:'food',         yieldLbs:20,  waterGal:25,   co2Lbs:4,   costMin:3,   costMax:10,   savingsMin:8,  savingsMax:16  },
  '🍃':{ name:'Chard',              category:'food',         yieldLbs:12,  waterGal:16,   co2Lbs:3,   costMin:3,   costMax:8,    savingsMin:6,  savingsMax:14  },
  '🫛':{ name:'Lettuce',            category:'food',         yieldLbs:10,  waterGal:15,   co2Lbs:3,   costMin:5,   costMax:15,   savingsMin:6,  savingsMax:14  },
  '🫒':{ name:'Herbs',              category:'food',         yieldLbs:6,   waterGal:10,   co2Lbs:2,   costMin:5,   costMax:15,   savingsMin:8,  savingsMax:20  },
  '💧':{ name:'Rain Tank',          category:'water',        yieldLbs:0,   waterGal:4000, co2Lbs:12,  costMin:250, costMax:600,  savingsMin:48, savingsMax:120 },
  '🌊':{ name:'Swale',              category:'water',        yieldLbs:0,   waterGal:8000, co2Lbs:20,  costMin:200, costMax:500,  savingsMin:90, savingsMax:180 },
  '🐟':{ name:'Pond',               category:'water',        yieldLbs:10,  waterGal:2000, co2Lbs:15,  costMin:300, costMax:1200, savingsMin:40, savingsMax:80  },
  '🪣':{ name:'Cistern',            category:'water',        yieldLbs:0,   waterGal:12000,co2Lbs:18,  costMin:400, costMax:1000, savingsMin:80, savingsMax:180 },
  '🌧️':{ name:'Rain Garden',       category:'water',        yieldLbs:0,   waterGal:3000, co2Lbs:14,  costMin:150, costMax:400,  savingsMin:40, savingsMax:90  },
  '🚿':{ name:'Drip Irrigation',     category:'water',        yieldLbs:0,   waterGal:2000, co2Lbs:2,   costMin:100, costMax:300,  savingsMin:30, savingsMax:70  },
  '☀️':{ name:'Solar Panel',        category:'energy',       yieldLbs:0,   waterGal:0,    co2Lbs:250, costMin:800, costMax:3000, savingsMin:120,savingsMax:280 },
  '🌬️':{ name:'Wind Turbine',      category:'energy',       yieldLbs:0,   waterGal:0,    co2Lbs:200, costMin:500, costMax:2000, savingsMin:80, savingsMax:200 },
  '🔋':{ name:'Battery Storage',    category:'energy',       yieldLbs:0,   waterGal:0,    co2Lbs:50,  costMin:600, costMax:1800, savingsMin:60, savingsMax:140 },
  '⚡':{ name:'Solar Pump',         category:'energy',       yieldLbs:0,   waterGal:0,    co2Lbs:60,  costMin:200, costMax:600,  savingsMin:40, savingsMax:100 },
  '♻️':{ name:'Compost Bin',        category:'soil',         yieldLbs:0,   waterGal:0,    co2Lbs:40,  costMin:40,  costMax:100,  savingsMin:40, savingsMax:80  },
  '🪱':{ name:'Worm Bin',           category:'soil',         yieldLbs:0,   waterGal:0,    co2Lbs:20,  costMin:50,  costMax:150,  savingsMin:30, savingsMax:60  },
  '🌲':{ name:'Hugelkultur',        category:'soil',         yieldLbs:50,  waterGal:200,  co2Lbs:30,  costMin:50,  costMax:200,  savingsMin:30, savingsMax:60  },
  '🍂':{ name:'Mulch Layer',        category:'soil',         yieldLbs:0,   waterGal:100,  co2Lbs:15,  costMin:20,  costMax:60,   savingsMin:15, savingsMax:35  },
  '🪟':{ name:'Cold Frame',         category:'soil',         yieldLbs:20,  waterGal:10,   co2Lbs:5,   costMin:30,  costMax:100,  savingsMin:20, savingsMax:40  },
  '🌾':{ name:'Cover Crop',         category:'soil',         yieldLbs:0,   waterGal:50,   co2Lbs:25,  costMin:10,  costMax:40,   savingsMin:15, savingsMax:35  },
  '🌼':{ name:'Pollinator Patch',   category:'biodiversity', yieldLbs:0,   waterGal:10,   co2Lbs:10,  costMin:60,  costMax:120,  savingsMin:20, savingsMax:40  },
  '🐦':{ name:'Bird House',         category:'biodiversity', yieldLbs:0,   waterGal:0,    co2Lbs:5,   costMin:30,  costMax:80,   savingsMin:5,  savingsMax:15  },
  '🦇':{ name:'Bat Box',            category:'biodiversity', yieldLbs:0,   waterGal:0,    co2Lbs:3,   costMin:20,  costMax:60,   savingsMin:10, savingsMax:25  },
  '🐛':{ name:'Insect Hotel',       category:'biodiversity', yieldLbs:0,   waterGal:0,    co2Lbs:4,   costMin:15,  costMax:50,   savingsMin:8,  savingsMax:18  },
  '🪷':{ name:'Wildlife Pond',      category:'biodiversity', yieldLbs:0,   waterGal:500,  co2Lbs:12,  costMin:200, costMax:800,  savingsMin:15, savingsMax:35  },
  '🌺':{ name:'Native Plants',       category:'biodiversity', yieldLbs:0,   waterGal:8,    co2Lbs:8,   costMin:40,  costMax:120,  savingsMin:8,  savingsMax:20  },
  '🌴':{ name:'Hedgerow',           category:'biodiversity', yieldLbs:5,   waterGal:20,   co2Lbs:22,  costMin:60,  costMax:200,  savingsMin:10, savingsMax:25  },
  '🐔':{ name:'Chicken Coop',       category:'animals',      yieldLbs:60,  waterGal:200,  co2Lbs:15,  costMin:300, costMax:800,  savingsMin:180,savingsMax:320 },
  '🐝':{ name:'Beehive',            category:'biodiversity', yieldLbs:12,  waterGal:0,    co2Lbs:8,   costMin:200, costMax:600,  savingsMin:60, savingsMax:140 },
  // -- Flowers --
  '💙':{ name:'Borage',              category:'flowers',      yieldLbs:2,   waterGal:10,   co2Lbs:4,   costMin:3,   costMax:10,   savingsMin:3,  savingsMax:8   },
  '🌻':{ name:'Calendula',           category:'flowers',      yieldLbs:1,   waterGal:8,    co2Lbs:3,   costMin:3,   costMax:10,   savingsMin:3,  savingsMax:8   },
  '🌸':{ name:'Chamomile',           category:'flowers',      yieldLbs:2,   waterGal:8,    co2Lbs:3,   costMin:4,   costMax:12,   savingsMin:4,  savingsMax:10  },
  '💜':{ name:'Lavender',            category:'flowers',      yieldLbs:2,   waterGal:8,    co2Lbs:5,   costMin:8,   costMax:25,   savingsMin:8,  savingsMax:20  },
  '🌞':{ name:'Sunflowers',          category:'flowers',      yieldLbs:3,   waterGal:12,   co2Lbs:6,   costMin:3,   costMax:10,   savingsMin:4,  savingsMax:10  },
  '🌹':{ name:'Roses',               category:'flowers',      yieldLbs:1,   waterGal:12,   co2Lbs:5,   costMin:10,  costMax:35,   savingsMin:5,  savingsMax:15  },
  '🧡':{ name:'Nasturtium',          category:'flowers',      yieldLbs:2,   waterGal:8,    co2Lbs:3,   costMin:2,   costMax:8,    savingsMin:3,  savingsMax:8   },
  '🟠':{ name:'Marigolds',           category:'flowers',      yieldLbs:0,   waterGal:8,    co2Lbs:3,   costMin:3,   costMax:10,   savingsMin:3,  savingsMax:8   },
  '🌷':{ name:'Tulips',              category:'flowers',      yieldLbs:0,   waterGal:10,   co2Lbs:4,   costMin:5,   costMax:20,   savingsMin:3,  savingsMax:8   },
  '🌈':{ name:'Wildflower Mix',      category:'flowers',      yieldLbs:0,   waterGal:8,    co2Lbs:10,  costMin:5,   costMax:20,   savingsMin:5,  savingsMax:15  },
  '🌟':{ name:'Echinacea',           category:'flowers',      yieldLbs:1,   waterGal:10,   co2Lbs:5,   costMin:6,   costMax:18,   savingsMin:5,  savingsMax:12  },
  '💐':{ name:'Sweet Peas',          category:'food',         yieldLbs:10,  waterGal:12,   co2Lbs:3,   costMin:3,   costMax:10,   savingsMin:5,  savingsMax:12  },
  '🦆':{ name:'Duck Pen',           category:'animals',      yieldLbs:40,  waterGal:0,    co2Lbs:10,  costMin:200, costMax:600,  savingsMin:120,savingsMax:240 },
  '🐐':{ name:'Goat Pen',           category:'animals',      yieldLbs:80,  waterGal:0,    co2Lbs:20,  costMin:500, costMax:1500, savingsMin:200,savingsMax:400 },
  '🐇':{ name:'Rabbit Hutch',        category:'animals',      yieldLbs:40,  waterGal:0,    co2Lbs:10,  costMin:150, costMax:400,  savingsMin:60, savingsMax:120 },
  '🐖':{ name:'Pig Run',             category:'animals',      yieldLbs:200, waterGal:0,    co2Lbs:20,  costMin:400, costMax:1200, savingsMin:120,savingsMax:280 },
};

const CLIMATE_ZONES: Record<string, string> = {
  Temperate:   'temperate (4 seasons, moderate rainfall, zones 5–8)',
  Subtropical: 'subtropical (warm year-round, zones 9–11, frost-rare)',
  Arid:        'arid/semi-arid (low rainfall, hot summers, water-critical)',
  Cold:        'cold/continental (harsh winters, short growing season, zones 3–5)',
};

function quickCalc(icons: string[], familySize: number, zone: string) {
  const mult = zone === 'Subtropical' ? 1.3 : zone === 'Arid' ? 0.7 : zone === 'Cold' ? 0.8 : 1.0;
  let yield_ = 0, water = 0, co2 = 0, costMin = 0, costMax = 0, savMin = 0, savMax = 0;
  const cats = new Set<string>();
  icons.forEach(em => {
    const f = FEATURE_DB[em]; if (!f) return;
    cats.add(f.category);
    yield_  += Math.round(f.yieldLbs  * mult);
    water   += Math.round(f.waterGal  * mult);
    co2     += Math.round(f.co2Lbs    * mult);
    costMin += f.costMin; costMax += f.costMax;
    savMin  += Math.round(f.savingsMin * mult);
    savMax  += Math.round(f.savingsMax * mult);
  });
  const foodNeed = FOOD_LBS_PER_PERSON_YR * familySize;
  const foodPct  = Math.min(100, Math.round((yield_ / foodNeed) * 100));
  const waterPct = Math.min(100, Math.round((water  / WATER_GAL_BASELINE) * 100));
  const savMid   = Math.round((savMin + savMax) / 2);
  const avgCost  = Math.round((costMin + costMax) / 2);
  const payback  = savMid > 0 ? Math.round((avgCost / savMid) * 10) / 10 : 0;
  const resilience = Math.min(98,
    Math.min(30, cats.size * 5) +
    Math.min(22, Math.round((foodPct  / 100) * 22)) +
    Math.min(18, Math.round((waterPct / 100) * 18)) +
    Math.min(15, Math.round((Math.min(co2, 600) / 600) * 15)) +
    (icons.some(e => ['☀️','🌬️','🔋','⚡'].includes(e)) ? 8 : 0) +
    Math.min(5,  Math.round((Math.min(icons.length, 12) / 12) * 5))
  );
  return { yield_, water, co2, costMin, costMax, savMid, payback, foodPct, waterPct, resilience, cats };
}

function iconRoster(): string {
  const cats: Record<string, string[]> = {};
  Object.entries(FEATURE_DB).forEach(([em, f]) => {
    if (!cats[f.category]) cats[f.category] = [];
    cats[f.category].push(`${em} ${f.name}`);
  });
  return Object.entries(cats)
    .map(([cat, items]) => `${cat.toUpperCase()}: ${items.join(', ')}`)
    .join('\n');
}

export async function generateBlueprint(data: {
  prompt:      string;
  yardSqFt:    number;
  familySize:  number;
  climateZone: 'Temperate' | 'Arid' | 'Subtropical' | 'Cold';
  budget:      number;
  propertyMap: string[];
  gardenMap:   string[];
}): Promise<{ summary: string; recommendations: string[]; recommendedIcons: string[] }> {

  const allIcons  = [...data.propertyMap, ...data.gardenMap];
  const stats     = quickCalc(allIcons, data.familySize, data.climateZone);
  const zoneDesc  = CLIMATE_ZONES[data.climateZone] ?? data.climateZone;
  const acres     = (data.yardSqFt / 43560).toFixed(2);
  const hasIcons  = allIcons.length > 0;
  const budgetLeft = Math.max(0, data.budget - stats.costMin);
  // Features whose min cost fits within total budget
  const affordableFeatures = Object.entries(FEATURE_DB)
    .filter(([,f]) => f.costMin <= data.budget)
    .map(([em,f]) => `${em}(${f.costMin}–${f.costMax})`)
    .join(' ');

  const systemPrompt = `You are TerraForge, an expert permaculture designer and homestead planner. You give specific, data-driven advice grounded in real horticultural science. CRITICAL RULE #1 — BUDGET RANGE: The recommendedIcons combined cost MUST land between 70% and 100% of the user's budget. If total is UNDER 70% of budget, ADD more valuable features — the user wants to USE their budget to reach their goals. If OVER 100%, remove the most expensive feature. CRITICAL RULE #2: For self-sufficiency goals, prioritise features with highest food yield per dollar. CRITICAL RULE #3: Be specific to this user's land, climate, family, and budget — never generic.`;

  const userPrompt = `Design a regenerative homestead blueprint for this property:

⚠️ BUDGET UTILIZATION — READ FIRST:
The user's TOTAL budget is $${data.budget.toLocaleString()}.
MINIMUM SPEND: $${Math.round(data.budget*0.70).toLocaleString()} (70% of budget — you MUST reach this).
MAXIMUM SPEND: $${(data.budget+200).toLocaleString()} (hard ceiling).
Under-spending is FAILURE. A $${data.budget.toLocaleString()} budget should yield 8–15 features.
For 80% self-sufficiency with $${data.budget.toLocaleString()}: expect greenhouse, raised beds, fruit trees, water system, solar, compost, animals.
Check each icon's costMin from the AFFORDABLE list before including it.

PROPERTY:
- Land: ${data.yardSqFt.toLocaleString()} sq ft (${acres} acres), Climate: ${zoneDesc}
- Family: ${data.familySize} people, Budget: $${data.budget.toLocaleString()}
- Goals: "${data.prompt || 'Maximise food self-sufficiency and resilience'}

${hasIcons ? `CURRENT LAYOUT & PERFORMANCE:
Property features: ${data.propertyMap.map(em => FEATURE_DB[em]?.name ?? em).join(', ') || 'empty'}
Raised bed crops: ${data.gardenMap.map(em => FEATURE_DB[em]?.name ?? em).join(', ') || 'empty'}
Food yield: ${stats.yield_} lbs/yr (${stats.foodPct}% of family need) | Water saved: ${stats.water.toLocaleString()} gal/yr (${stats.waterPct}%)
CO₂ offset: ${stats.co2} lbs/yr | Cost: ${stats.costMin.toLocaleString()}–${stats.costMax.toLocaleString()} | Year-1 savings: ~${stats.savMid.toLocaleString()} | Payback: ${stats.payback} yrs
Resilience: ${stats.resilience}/98 | Categories: ${[...stats.cats].join(', ')} | Budget remaining: ~${budgetLeft.toLocaleString()}` : `CURRENT LAYOUT: Fresh design — no features placed yet.`}

AVAILABLE FEATURES (only suggest these if they fit the ${data.budget.toLocaleString()} budget):
${iconRoster()}

FEATURES AFFORDABLE WITHIN BUDGET (${data.budget.toLocaleString()}): ${affordableFeatures}

Reply ONLY with this JSON (no markdown fences, no text outside):
{
  "summary": "2–3 sentence expert assessment with actual numbers (yield lbs, $ savings, payback). Specific to their climate and land.",
  "recommendations": [
    "Specific rec 1 — must include $ amounts or yield lbs or % improvement",
    "Specific rec 2",
    "Specific rec 3",
    "Specific rec 4",
    "Specific rec 5"
  ],
  "recommendedIcons": ["emoji1","emoji2","emoji3","emoji4","emoji5"]
}

Recommendations: specific to THIS property/climate/budget. Include $ amounts or yield lbs in every rec. Flag conflicts.
recommendedIcons: ONLY from FEATURES AFFORDABLE list. Not already placed (placed: ${allIcons.join(' ') || 'none'}). For budgets over $3,000 aim for 8–12 icons. Combined cost MUST be between $${Math.round(data.budget*0.70).toLocaleString()} and $${data.budget.toLocaleString()}. Under-spending the budget is NOT acceptable — the user gave you $${data.budget.toLocaleString()} to invest.`;

  // Call our server-side proxy — avoids CORS and keeps API key secure
  const response = await fetch('/api/generate-blueprint', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(`Blueprint API ${response.status}: ${errData.detail ?? response.statusText}`);
  }

  const apiData = await response.json();
  const raw     = (apiData.content?.[0]?.text ?? '').trim();
  const clean   = raw.replace(/^```(?:json)?\n?/,'').replace(/\n?```$/,'').trim();

  let parsed: { summary?: unknown; recommendations?: unknown; recommendedIcons?: unknown };
  try { parsed = JSON.parse(clean); }
  catch {
    return { summary: raw.slice(0, 400) || 'Blueprint generated.', recommendations: [], recommendedIcons: [] };
  }

  // Client-side budget enforcement — filter out icons that would exceed budget
  const rawIcons: string[] = Array.isArray(parsed.recommendedIcons)
    ? (parsed.recommendedIcons as unknown[]).filter((e): e is string => typeof e === 'string' && e in FEATURE_DB)
    : [];
  
  let totalCost = 0;
  const budgetEnforced: string[] = [];
  for (const em of rawIcons) {
    const f = FEATURE_DB[em];
    if (!f) continue;
    // Use midpoint cost — consistent with page.tsx calculateFromTiles
    const mid = Math.round((f.costMin + f.costMax) / 2);
    if (totalCost + mid <= data.budget) {
      budgetEnforced.push(em);
      totalCost += mid;
    }
    if (budgetEnforced.length >= 15) break;
  }

  return {
    summary: typeof parsed.summary === 'string' ? parsed.summary : '',
    recommendations: Array.isArray(parsed.recommendations)
      ? (parsed.recommendations as unknown[]).filter((r): r is string => typeof r === 'string').slice(0, 6)
      : [],
    recommendedIcons: budgetEnforced,
  };
}
