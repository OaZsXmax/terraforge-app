// app/api/email/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM = 'TerraForge <noreply@terraforgehome.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.terraforgehome.com';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Shared brand shell ───────────────────────────────────────────────────────
function shell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#0a1f15;font-family:'Inter',sans-serif;color:#d2fcea;-webkit-font-smoothing:antialiased}
    .wrap{max-width:600px;margin:0 auto;padding:40px 20px}
    .card{background:#112e1e;border:1px solid rgba(0,255,170,0.2);border-radius:20px;overflow:hidden}
    .header{background:linear-gradient(135deg,#0d2418 0%,#163824 100%);padding:36px 40px;border-bottom:1px solid rgba(0,255,170,0.15)}
    .logo{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:#00ffaa;letter-spacing:-0.5px}
    .logo span{color:rgba(0,255,170,0.5)}
    .body{padding:40px}
    h1{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700;color:#f2fffa;margin-bottom:16px;line-height:1.3}
    p{font-size:15px;line-height:1.7;color:#aaf0d2;margin-bottom:16px}
    p strong{color:#d2fcea}
    .btn{display:inline-block;margin:8px 0 24px;padding:14px 32px;background:linear-gradient(135deg,#00ffaa,#00c47a);color:#0a1f15;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:15px;text-decoration:none;border-radius:12px;letter-spacing:0.2px}
    .divider{height:1px;background:rgba(0,255,170,0.12);margin:28px 0}
    .pill{display:inline-block;padding:4px 12px;background:rgba(0,255,170,0.1);border:1px solid rgba(0,255,170,0.25);border-radius:99px;font-size:12px;color:#00ffaa;font-weight:600;margin-bottom:20px}
    .tip-box{background:rgba(0,255,170,0.06);border:1px solid rgba(0,255,170,0.15);border-radius:12px;padding:20px;margin:20px 0}
    .tip-box p{margin-bottom:0;font-size:14px}
    .footer{padding:24px 40px;border-top:1px solid rgba(0,255,170,0.1)}
    .footer p{font-size:12px;color:rgba(170,240,210,0.5);margin-bottom:6px}
    .footer a{color:rgba(0,255,170,0.6);text-decoration:none}
    ul{margin:12px 0 16px 0;padding-left:20px}
    li{font-size:15px;line-height:1.8;color:#aaf0d2}
    li strong{color:#d2fcea}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="header">
        <div class="logo">Terra<span>Forge</span> 🌿</div>
      </div>
      <div class="body">${body}</div>
      <div class="footer">
        <p>You're receiving this from <strong>TerraForge</strong> at <a href="${APP_URL}">${APP_URL}</a></p>
        <p><a href="${APP_URL}/unsubscribe?email={{email}}">Unsubscribe</a> · <a href="${APP_URL}">Open App</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ─── Email templates ──────────────────────────────────────────────────────────
function welcomeEmail(name: string): { subject: string; html: string } {
  const firstName = name.split(' ')[0] || name;
  return {
    subject: '🌿 Welcome to TerraForge — your homestead starts here',
    html: shell('Welcome to TerraForge', `
      <div class="pill">✦ Welcome</div>
      <h1>Hey ${firstName}, your homestead journey starts now 🌱</h1>
      <p>TerraForge turns any property into a productive, self-sufficient homestead — with AI-generated permaculture blueprints, seasonal planting calendars, and ROI tracking.</p>
      <a href="${APP_URL}/dashboard/garden" class="btn">Open TerraForge →</a>
      <div class="divider"></div>
      <p><strong>Here's how to get started:</strong></p>
      <ul>
        <li><strong>Configure your property</strong> — enter your location, size &amp; climate zone</li>
        <li><strong>Generate a blueprint</strong> — AI designs your ideal homestead layout</li>
        <li><strong>Explore your calendar</strong> — month-by-month planting &amp; harvest guide</li>
        <li><strong>Track your ROI</strong> — see your estimated annual food value</li>
      </ul>
      <div class="tip-box">
        <p>💡 <strong>Pro tip:</strong> Start with the demo blueprint to explore the interface before configuring your own property.</p>
      </div>
    `),
  };
}

function saveConfirmEmail(name: string, blueprintLabel: string): { subject: string; html: string } {
  const firstName = name.split(' ')[0] || name;
  return {
    subject: `✅ Blueprint saved — "${blueprintLabel}"`,
    html: shell('Blueprint Saved', `
      <div class="pill">✦ Saved</div>
      <h1>Your blueprint is safe, ${firstName} 🗺️</h1>
      <p>We've saved <strong>"${blueprintLabel}"</strong> to your TerraForge account. You can access it any time from any device.</p>
      <a href="${APP_URL}/dashboard/garden" class="btn">View Your Blueprint →</a>
      <div class="divider"></div>
      <div class="tip-box">
        <p>💡 <strong>Next step:</strong> Head to the <strong>Deploy tab</strong> to generate a shopping list of everything you need to bring your homestead to life.</p>
      </div>
    `),
  };
}

function nudgeDay3Email(name: string): { subject: string; html: string } {
  const firstName = name.split(' ')[0] || name;
  return {
    subject: '🌿 Your TerraForge blueprint is waiting',
    html: shell('Your Blueprint Is Waiting', `
      <div class="pill">✦ Reminder</div>
      <h1>${firstName}, your homestead blueprint is ready to generate 🏡</h1>
      <p>You signed up a few days ago but haven't generated your first blueprint yet. It only takes 30 seconds — just tell TerraForge about your property and the AI does the rest.</p>
      <a href="${APP_URL}/dashboard/garden" class="btn">Generate My Blueprint →</a>
      <div class="divider"></div>
      <p><strong>What you'll get:</strong></p>
      <ul>
        <li>A tile-by-tile layout for your entire property</li>
        <li>Estimated annual food value &amp; ROI</li>
        <li>Month-by-month seasonal calendar</li>
        <li>A full shopping list to get started</li>
      </ul>
    `),
  };
}

function proNudgeEmail(name: string): { subject: string; html: string } {
  const firstName = name.split(' ')[0] || name;
  return {
    subject: '🚀 Unlock the full TerraForge — from $9/month',
    html: shell('Upgrade to Pro', `
      <div class="pill">✦ Pro Feature</div>
      <h1>${firstName}, you've hit the free limit 🌾</h1>
      <p>You've been making great use of TerraForge! Upgrade to <strong>Pro</strong> to unlock everything:</p>
      <ul>
        <li><strong>Unlimited blueprints</strong> — save as many layouts as you like</li>
        <li><strong>Multiple properties</strong> — plan your entire homestead portfolio</li>
        <li><strong>AI property analysis</strong> — satellite + Claude Vision analysis</li>
        <li><strong>Shopping list export</strong> — print-ready PDF with cost estimates</li>
        <li><strong>Priority support</strong></li>
      </ul>
      <a href="${APP_URL}/dashboard/garden" class="btn">Upgrade to Pro — from $9/mo →</a>
      <div class="divider"></div>
      <div class="tip-box">
        <p>🎯 <strong>Annual plan saves 27%</strong> — $79/year vs $108/year on monthly. Cancel any time.</p>
      </div>
    `),
  };
}

function seasonalEmail(
  name: string,
  climateZone: string,
  season: string,
  tasks: string[]
): { subject: string; html: string } {
  const firstName = name.split(' ')[0] || name;
  const taskItems = tasks.map(t => `<li>${t}</li>`).join('');
  return {
    subject: `🌱 ${season} is starting — your ${climateZone} homestead tasks`,
    html: shell(`${season} Planting Guide`, `
      <div class="pill">✦ Seasonal Reminder</div>
      <h1>${season} is here, ${firstName} 🌿</h1>
      <p>Based on your <strong>${climateZone}</strong> climate zone, here's what to focus on in your homestead this season:</p>
      <ul>${taskItems}</ul>
      <a href="${APP_URL}/dashboard/garden" class="btn">Open My Calendar →</a>
      <div class="divider"></div>
      <div class="tip-box">
        <p>📅 Your full month-by-month planting calendar is in the <strong>Calendar tab</strong> of TerraForge.</p>
      </div>
    `),
  };
}

// ─── Seasonal tasks by zone ───────────────────────────────────────────────────
const SEASONAL_TASKS: Record<string, Record<string, string[]>> = {
  Temperate: {
    Spring: ['Sow tomatoes, peppers, squash indoors', 'Prepare beds — compost & top-dress', 'Plant bare-root fruit trees', 'Start hardening off seedlings'],
    Summer: ['Direct-sow beans, cucumbers, corn', 'Mulch heavily to retain moisture', 'Harvest garlic when tops die back', 'Set up drip irrigation'],
    Autumn: ['Plant garlic for next year', 'Sow cover crops (clover, rye)', 'Harvest &amp; store root vegetables', 'Collect &amp; store seeds'],
    Winter: ['Plan next year\'s rotations', 'Order seed catalogues', 'Prune dormant fruit trees', 'Build or repair garden beds'],
  },
  Arid: {
    Spring: ['Plant heat-tolerant crops early (before peak heat)', 'Mulch deeply — 4–6 inches', 'Install shade cloth over seedlings', 'Set up grey-water systems'],
    Summer: ['Water at dawn &amp; dusk only', 'Focus on drought-hardy varieties', 'Protect plants from heat stress', 'Harvest regularly to encourage production'],
    Autumn: ['Plant cool-season crops (lettuce, brassicas)', 'Compost summer plant material', 'Repair irrigation lines', 'Seed winter greens'],
    Winter: ['Main growing season — plant most crops now', 'Sow legumes to fix nitrogen', 'Harvest citrus &amp; root veg', 'Plan spring water strategy'],
  },
  Subtropical: {
    'Wet Season': ['Plant water-loving crops (taro, ginger, turmeric)', 'Establish food forest trees', 'Mulch paths to prevent erosion', 'Harvest pawpaw &amp; bananas'],
    'Dry Season': ['Focus on irrigation-dependent crops', 'Plant brassicas, root veg', 'Prune &amp; shape fruit trees', 'Build water harvesting earthworks'],
    'Build-Up': ['Prepare for wet — clear drains, stake plants', 'Final harvest of dry season crops', 'Plant fast-maturing varieties', 'Establish new swales &amp; beds'],
    'Cool Dry': ['Best planting time — almost anything grows', 'Establish new perennials', 'Divide &amp; transplant herbs', 'Soil building &amp; composting'],
  },
  Tropical: {
    'Wet Season': ['Plant taro, cassava, sweet potato', 'Establish food forest canopy', 'Harvest tropical fruits', 'Mulch heavily against heavy rain'],
    'Dry Season': ['Irrigate regularly — root veg &amp; greens', 'Prune fruiting trees', 'Plant leguminous cover crops', 'Build soil carbon'],
    'Build-Up': ['Harvest before storms arrive', 'Stake &amp; support tall plants', 'Plant fast crops before wet', 'Check &amp; repair water systems'],
    'Cool Dry': ['Prime planting window — start new beds', 'Transplant seedlings', 'Plant perennial herbs &amp; shrubs', 'Compost &amp; sheet-mulch'],
  },
  Cold: {
    Spring: ['Start seeds indoors 8 weeks before last frost', 'Prepare beds as soon as soil is workable', 'Plant cold-hardy greens under row cover', 'Prune fruit trees before bud break'],
    Summer: ['Short season — focus on fast-maturing varieties', 'Direct-sow root veg &amp; brassicas', 'Harvest continuously to extend production', 'Save seeds from best performers'],
    Autumn: ['Harvest &amp; store everything before first frost', 'Plant garlic — after first frost, before ground freezes', 'Mulch perennials heavily', 'Bring tender plants indoors'],
    Winter: ['Deep dormancy — plan &amp; order seeds', 'Maintain compost (insulate pile)', 'Forage for winter greens under snow', 'Repair tools &amp; infrastructure'],
  },
};

// Figure out current season for a climate zone based on month
function getCurrentSeason(climateZone: string, month: number): string | null {
  const zones: Record<string, string[]> = {
    Temperate: ['Winter','Winter','Spring','Spring','Spring','Summer','Summer','Summer','Autumn','Autumn','Autumn','Winter'],
    Arid:      ['Winter','Winter','Spring','Spring','Summer','Summer','Summer','Summer','Autumn','Autumn','Winter','Winter'],
    Subtropical:['Cool Dry','Cool Dry','Build-Up','Build-Up','Wet Season','Wet Season','Wet Season','Wet Season','Wet Season','Dry Season','Dry Season','Cool Dry'],
    Tropical:  ['Cool Dry','Cool Dry','Build-Up','Build-Up','Wet Season','Wet Season','Wet Season','Wet Season','Wet Season','Dry Season','Dry Season','Cool Dry'],
    Cold:      ['Winter','Winter','Spring','Spring','Spring','Summer','Summer','Summer','Autumn','Autumn','Winter','Winter'],
  };
  const seasons = zones[climateZone];
  if (!seasons) return null;
  return seasons[month - 1] ?? null;
}

// ─── Log helper (prevents duplicate sends) ───────────────────────────────────
async function alreadySent(userId: string, emailType: string, dedupeKey: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('email_log')
    .select('id')
    .eq('user_id', userId)
    .eq('email_type', emailType)
    .eq('dedupe_key', dedupeKey)
    .maybeSingle();
  return !!data;
}

async function logSent(userId: string, emailType: string, dedupeKey: string) {
  await supabaseAdmin.from('email_log').insert({ user_id: userId, email_type: emailType, dedupe_key: dedupeKey });
}

// ─── Send via Resend ──────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error ${res.status}: ${err}`);
  }
  return res.json();
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, userId, email, name, blueprintLabel, climateZone } = body;

    if (!type || !userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Auth: verify caller is the user themselves OR service role (cron)
    const authHeader = req.headers.get('authorization') ?? '';
    const isServiceCall = authHeader === `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`;
    if (!isServiceCall) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
      if (!user || user.id !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Check unsubscribe
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email_unsubscribed')
      .eq('id', userId)
      .single();
    if (profile?.email_unsubscribed) {
      return NextResponse.json({ skipped: 'unsubscribed' });
    }

    let subject = '';
    let html = '';
    let dedupeKey = '';

    if (type === 'welcome') {
      dedupeKey = 'welcome';
      if (await alreadySent(userId, 'welcome', dedupeKey)) return NextResponse.json({ skipped: 'already_sent' });
      ({ subject, html } = welcomeEmail(name ?? email));

    } else if (type === 'save_confirm') {
      if (!blueprintLabel) return NextResponse.json({ error: 'blueprintLabel required' }, { status: 400 });
      dedupeKey = `save_${Date.now()}`;
      ({ subject, html } = saveConfirmEmail(name ?? email, blueprintLabel));

    } else if (type === 'nudge_day3') {
      dedupeKey = 'nudge_day3';
      if (await alreadySent(userId, 'nudge_day3', dedupeKey)) return NextResponse.json({ skipped: 'already_sent' });
      ({ subject, html } = nudgeDay3Email(name ?? email));

    } else if (type === 'pro_nudge') {
      dedupeKey = 'pro_nudge';
      if (await alreadySent(userId, 'pro_nudge', dedupeKey)) return NextResponse.json({ skipped: 'already_sent' });
      ({ subject, html } = proNudgeEmail(name ?? email));

    } else if (type === 'seasonal') {
      if (!climateZone) return NextResponse.json({ error: 'climateZone required' }, { status: 400 });
      const month = new Date().getMonth() + 1;
      const season = getCurrentSeason(climateZone, month);
      if (!season) return NextResponse.json({ error: 'Unknown climate zone' }, { status: 400 });
      dedupeKey = `seasonal_${climateZone}_${new Date().getFullYear()}_${month}`;
      if (await alreadySent(userId, 'seasonal', dedupeKey)) return NextResponse.json({ skipped: 'already_sent' });
      const tasks = SEASONAL_TASKS[climateZone]?.[season] ?? [];
      ({ subject, html } = seasonalEmail(name ?? email, climateZone, season, tasks));

    } else {
      return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 });
    }

    await sendEmail(email, subject, html);
    await logSent(userId, type, dedupeKey);

    return NextResponse.json({ ok: true, type });
  } catch (err: any) {
    console.error('[email/send]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
