import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';
const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY)
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });

    const { blueprintSummary, address, sqft, zone, features, existingFeatures } = await req.json();

    const featureList = (features || []).slice(0, 20).join(', ');
    const existing = (existingFeatures || []).slice(0, 6).join(', ');

    const prompt = `You are a master garden illustrator creating a beautiful top-down artistic map of a homestead property.

Property details:
- Address area: ${address || 'residential property'}
- Lot size: ${sqft?.toLocaleString() || '10,000'} sq ft
- Climate zone: ${zone || 'Temperate'}
- Planned features: ${featureList || 'raised beds, fruit trees, compost, solar panels'}
- Existing features: ${existing || 'house, driveway, lawn'}

Create a stunning SVG illustration (800x600 viewBox) of this property from a top-down bird's-eye perspective. This should look like a beautiful hand-painted garden map — like something from a premium gardening magazine or an artist's sketchbook.

STYLE REQUIREMENTS:
- Warm, rich colours — deep greens, earthy browns, golden yellows, sky blues
- Painterly feel — use gradients, soft shadows, organic shapes
- Clear but artistic — labels should be elegant and readable
- Top-down perspective — house in upper portion, garden/outdoor areas filling the space
- Include a decorative compass rose, a simple legend, a subtle watercolour-style background wash

LAYOUT:
- Upper 25%: House footprint (warm grey/cream with roof detail), driveway
- Remaining 75%: Garden layout with all the planned features arranged naturally
- Include: paths/walkways between features, a water feature if applicable, borders/hedging

FEATURES TO ILLUSTRATE (place thoughtfully around the garden):
${featureList}

SVG REQUIREMENTS:
- ViewBox: "0 0 800 600"
- Rich gradients using <defs> and <linearGradient>/<radialGradient>
- Organic shapes using <path> with curves, not just rectangles
- Decorative text labels for key features
- A title banner at the top: "${address || 'My Homestead'}"
- Subtle grid/texture background
- Signature style: warm watercolour wash, ink outlines, botanical illustration feel

Return ONLY the raw SVG code starting with <svg and ending with </svg>. No explanation, no markdown, no backticks.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
    
    // Extract SVG if wrapped in anything
    const svgMatch = raw.match(/<svg[\s\S]*<\/svg>/);
    const svg = svgMatch ? svgMatch[0] : raw;

    if (!svg.includes('<svg')) {
      return NextResponse.json({ error: 'Could not generate illustration' }, { status: 500 });
    }

    return NextResponse.json({ svg });

  } catch (err: any) {
    console.error('[Visualise error]', err?.message);
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
