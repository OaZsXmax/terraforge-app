# TerraForge — Developer Context Document
# Generated from active development session — May 2026
# Hand this file to any AI assistant working on TerraForge to preserve all logic.

---

## PROJECT OVERVIEW

TerraForge is a Next.js 16.2.6 permaculture homestead planning app.
Live: https://terraforge-three.vercel.app
Local: C:\Users\pursu\terraforge
Main file: app/dashboard/garden/page.tsx (~7,500 lines)

Stack: Next.js, TypeScript, React, Supabase (auth), Stripe (payments), Anthropic Claude API

---

## CRITICAL FILES — DO NOT REWRITE LOGIC

### app/dashboard/garden/page.tsx
The entire app lives here. All tabs, all state, all calculations.

### app/dashboard/garden/generate.ts
AI blueprint generation. Calls /api/generate-blueprint (server proxy).
DO NOT change the prompt structure without understanding the budget enforcement.

### app/api/generate-blueprint/route.ts
Server-side proxy to Anthropic API. Has 100/month rate limiting per IP.

### app/api/checkout/route.ts
Stripe checkout. Requires: STRIPE_SECRET_KEY, NEXT_PUBLIC_APP_URL, 
NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

### components/Paywall.tsx
Upgrade modal. Calls createCheckoutSession from @/lib/checkout.

---

## ARCHITECTURE

### State Flow
blueprints (array of Blueprint objects) → propBps/raisedBedBps → activeBp → MapGrid
Each Blueprint has: { id, type ('property'|'raised-bed'), tiles: [{id, icon}], gridCount }

### Icon System
- components/FeatureIcon.tsx — emoji string → SVG lookup
- icons/vegetables.tsx, fruits.tsx, flowers.tsx, infrastructure.tsx, soil.tsx, systems.tsx
- ICON_LOOKUP = new Map(iconLibrary.map(i=>[i.emoji,i])) — the master feature lookup
- FeatureIcon renders SVG icons, NOT emoji characters

### Calculations
calculateFromTiles(tiles, familySize) → CalcResult
- Uses MIDPOINT cost: mid = (costMin+costMax)/2 for BOTH costMin and costMax
- This means displayed cost is a single number, NOT a range
- FOOD_NEED = 600 lbs/person/yr
- WATER_BASE = 30,000 gal/yr (family of 4)
- Resilience = min(98, cats*5 + foodPct*0.22 + waterPct*0.18 + co2*0.025 + energy?8:0 + features*0.42)

displayCalc = loading && useAI ? ZERO_CALC : calc
— zeros dashboard during AI generation so base calc doesn't flash

---

## BUDGET ENFORCEMENT — CRITICAL LOGIC

### The Problem History
Budget enforcement went through many iterations. The current working solution
uses SYNCHRONOUS local variable operations, NOT async setState calls.

### How It Works (onGenerate function)
1. promptEmojis extracted from text → placed into `updatedBlueprints` (LOCAL VAR)
2. Climate tree resolution: 🌳 → 🍎/🍋/🍌/🍐 based on climateZone
3. Fruit tree deduplication: if "5 fruit trees including apple, pear, lemon"
   → specificTrees=[🍎,🍐,🍋], extraTrees=5-3=2, fill extras with variety [🍑,🍌]
4. AI call returns recommendedIcons → merged into updatedBlueprints (LOCAL VAR)
5. Tree dedup in AI merge: if prompt already has N trees, AI adds at most 1 more
6. Budget clamp runs on LOCAL VAR (NOT on state):
   - Calculate totalAllCost across ALL tiles (property + raised beds)
   - If totalAllCost > budget: sort property tiles by valueOf (ROI/dollar), 
     keep filling until propBudget (85% of total) reached
   - Second pass trims raised bed tiles if still over
7. SINGLE setBlueprints(updatedBlueprints) call at end
8. If budget < 70% utilized: show yellow warning toast to user

### Why setState Budget Clamp Doesn't Work
React batches setState calls. Using setBlueprints(prev => ...) reads stale state.
ALWAYS operate on the local `updatedBlueprints` variable and call setBlueprints ONCE.

### generate.ts Budget Rules
System prompt tells Claude:
- Combined cost MUST be between 70% and 100% of budget
- Under-spending is FAILURE — user wants to USE their budget
- For budgets over $3,000: aim for 8-12 icons
- For 80% self-sufficiency with $10k: expect greenhouse, raised beds, 
  fruit trees, water system, solar, compost, animals

---

## FRUIT TREE LOGIC — CRITICAL

### Problem
Generic "fruit tree" keywords placed 🌳 which has no library entry → dark tile + "Feature" modal

### Solution
1. KEYWORD_MAP: "fruit tree"/"orchard"/"food forest" → emoji:'🌳' (placeholder)
2. In onGenerate, IMMEDIATELY after extractEmojisFromPrompt:
   - 🌳 → 🍎 (Temperate), 🍋 (Arid), 🍌 (Subtropical), 🍐 (Cold)
3. Specific trees ("apple tree", "peach") → exact emoji, never overridden
4. If "5 fruit trees including apple, pear, lemon": 
   specific=[🍎,🍐,🍋], extra=2, fill extras with [🍑,🍌] (variety, no duplicates)
5. GENERIC_TREE_EMOJIS = Set(['🌳']) ONLY — specific trees show own data in Feature Guide
6. loadFromSave migrates old 🌳 tiles to climate tree on load

### Feature Guide (getFeatureInfo)
- ONLY resolves 🌳 to climate tree
- 🍎🍋🍑🍐 etc. ALL show their own specific featureDB data
- DO NOT put specific tree emojis in FRUIT_TREE_EMOJIS/GENERIC_TREE_EMOJIS set

---

## AI GENERATION FLOW

### useAI State
useAI = true → calls Claude API via /api/generate-blueprint
useAI = false → skips API, uses keyword matching + base calculations only

### generate.ts → /api/generate-blueprint → Anthropic API
Model: claude-sonnet-4-6 (NOT claude-sonnet-4-20250514 — that doesn't exist)
The route.ts proxy adds: x-api-key header (server-side, never client-side)

### Rate Limiting
Free users: 10 blueprints total (tracked in localStorage with monthly reset key 'tf-gen-count')
Pro users: 100/month
Limit check fires BEFORE the API call in onGenerate

### Generation Limits (route.ts)
Server-side: 100/month per IP (in-memory Map, resets on server restart)
For production: replace Map with Redis/Upstash

---

## FEATURE GUIDE MODAL

### How It Opens
User clicks tile on map → setModal({emoji, bpId, tileId})
modalInfo = getFeatureInfo(modal.emoji, fv, calc.resilienceScore)

### getFeatureInfo
- Resolves 🌳 → climateFruitTree(zone): 🍌 Subtropical, 🍋 Arid, 🍐 Cold, 🍎 default
- All other emojis look up their own ICON_LOOKUP + featureDB entry
- Returns {name, context, resolved, ...featureData}

### Modal Render (FeaturePanel)
Uses modalInfo.resolved ?? modal.emoji for both icon display AND lib lookup
So clicking Lemon Tree shows Lemon Tree data, not Apple Tree data

---

## OVERVIEW TAB — BLUEPRINT ANALYSIS HERO

### Location
First section in Overview tab, BEFORE System Health
Only shows when hasData = true

### Logic
isAI = !!(apiBlueprint && (apiBlueprint.summary || apiBlueprint.recommendations?.length > 0))

AI generation → cyan theme, 🤖, "Understanding Your Blueprint", shows AI summary + recs
Base generation → green theme, ⚡, "Base Blueprint Analysis", shows computed assessment

### Base Expert Assessment (computed, not AI)
Built from: sqft, zone, familySize, budget, foodPct, yieldLbs, year1Savings, paybackYears
Detects missing categories and adds specific tip (water, energy, trees, animals)
Example output: "Your 10,000 sq ft temperate property yields 210 lbs/yr at 9%..."

---

## IMPROVEMENT TIPS — "HOW TO IMPROVE"

### getImprovementTips(calc, tiles)
Returns tips grouped by metric (Food Self-Sufficiency, Water Saved, etc.)

### Balance All Categories Fix
OLD (broken): emoji:'⚖️' — not in library, shows as generic "Feature" tile
NEW (fixed): detects which specific category is MISSING and recommends real feature:
- Missing water → 💧 Rain Tank
- Missing energy → ☀️ Solar Panel  
- Missing soil → ♻️ Compost Bin
- Missing biodiversity → 🌼 Pollinator Patch
- Missing animals → 🐔 Chicken Coop
- Missing food → 🌱 Raised Bed

---

## TERRAIN CORE (DashTerrain)

### Default Zoom
Initial zoom: 1.78x (NOT 1.0x)
Pan offset: containerHeight * 0.55 downward (centers isometric grid vertically)
Applied via requestAnimationFrame on mount

### Reset Button (↺)
Resets to 1.78x zoom + 0.55 height pan offset (same as initial)

### Transform
NO preserve-3d, NO translateZ, NO perspective (causes GPU compositor cache bugs)
Uses liveRot React state for 3D orbit (no direct DOM writes)

---

## DISPLAY COSTS — MIDPOINT ONLY

calculateFromTiles uses mid = Math.round((f.costMin+f.costMax)/2) for BOTH costMin and costMax.
estimatedCostMin === estimatedCostMax === sum of midpoints.
NO ranges displayed anywhere (no "$800–$3000", just "$1900").
This was changed to match budget enforcement which also uses midpoints.

---

## AUTH & PAYMENTS

### Supabase
supabase client: @/lib/supabase
Auth state: usePlan hook → { isPro, isLoggedIn, planLoading }

### Stripe Checkout
Paywall.tsx → createCheckoutSession('price_1TYXogBsMVXXOrRdRwPuUx7K') → /api/checkout
route.ts validates env vars, handles empty Bearer token gracefully
SUCCESS URL: ${NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}
CANCEL URL: ${NEXT_PUBLIC_APP_URL}/dashboard/garden?cancelled=1

### Required Vercel Env Vars
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_live_...  (must match publishable key — both live OR both test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://terraforge-three.vercel.app  (must have https://)
NEXT_PUBLIC_SUPABASE_URL=https://bgdtxzmegvgeyxtxqibf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

---

## CSS / THEME

### Color Palette
Primary green: #00ffaa
Cyan accent: #00eeff  
Purple: #a78bfa
Amber: #fbbf24
Background: linear-gradient(160deg, rgba(0,28,18,1), rgba(0,12,24,1), rgba(4,0,20,1))

### Key CSS Classes
.axiom-panel — main panel containers
.data-card — dashboard cards
.nav-active — active tab (gradient bg + glow)
.tile-placed — placed map tiles (glow + breathe animation)
.chip — category/filter pills
.gen-btn — primary CTA button

### Keyframe Animations
orb, orb2 — ambient background orbs
breathe — pulse glow (used on live dots, accent bars, step numbers)
borderFlow — animated gradient border
shimmerText — headline gradient animation
floatEmoji — home page floating emoji particles
slideRotate — testimonial slide rotation (16s cycle, 4 slides × 4s each)
cardFloat — gentle bob (applied to feature cards only, NOT the preview card)
iconBounce — icon bounce (removed from home page per user request)
ctaPulse — CTA button glow pulse
spin — loading spinner rings
scanline — subtle CRT overlay

### Home Page Animations
Floating emoji particles: 12 emojis, unique float duration + delay each
Testimonial slides: 4 quotes, 16s cycle with slideRotate
Progress bars: growBar animation on load
Feature cards: hover glow only (NO cardFloat bobbing — removed per user request)
CTA button: ctaPulse breathing glow

---

## COMMON MISTAKES TO AVOID

1. NEVER put specific tree emojis (🍎🍋🍑etc) in FRUIT_TREE_EMOJIS set — breaks Feature Guide
2. NEVER use setBlueprints(prev=>{...}) for budget enforcement — reads stale state
3. NEVER call generateBlueprint without await — it's async
4. NEVER use background: shorthand with backgroundSize: on same element — React warning
5. NEVER use model:'claude-sonnet-4-20250514' — use 'claude-sonnet-4-6'
6. NEVER call /api.anthropic.com directly from client — CORS blocks it, use route.ts proxy
7. NEVER change calculateFromTiles to use costMin/costMax separately — display breaks
8. NEVER remove the single setBlueprints call pattern at end of onGenerate
9. Keep ALL climate tree resolution in onGenerate (placement time), NOT just in getFeatureInfo
10. The maps tab wrapper needs position:'relative' as first style prop (not merged into existing style)

---

## FEATURE CATEGORIES
food, water, energy, soil, biodiversity, animals
(Note: "flowers" category was removed — Sweet Peas moved to food category)

---

## STORAGE
localStorage key: 'terraforge-v8'
Generation count key: 'tf-gen-count' → {count, month} (monthly reset)
PDF export count: pdfExportCount state (free users limited to 1)

---

## FILE LOCATIONS FOR ICON SVGS
icons/vegetables.tsx — 🌵🔴🫑🪴🥗🍃🥬🫛🍀🧅🧄🌶️🥔🎃🍅🌽🥒🫘🥦🍆🍠🫒🥕💐
icons/fruits.tsx — 🌳🍎🥑🍌🍁🫐🍈🍄🍇🍋🥭🍑🍐🍍🫚🍒🍓🍉🍊🫀
icons/flowers.tsx — (Sweet Peas 💐 moved to vegetables)
icons/infrastructure.tsx — 🌱🏡🌿
icons/soil.tsx — 🪟♻️🌾🌲🍂🪱
icons/systems.tsx — energy/water/animal systems

---
