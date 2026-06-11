import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY)
      return NextResponse.json({ error: 'GOOGLE_MAPS_API_KEY not configured' }, { status: 500 });
    if (!process.env.ANTHROPIC_API_KEY)
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });

    const { address } = await req.json();
    if (!address?.trim())
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });

    const mapsKey = process.env.GOOGLE_MAPS_API_KEY;

    // ── Step 1: Geocode the address to lat/lng ──
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${mapsKey}`
    );
    const geoData = await geoRes.json();

    if (geoData.status !== 'OK' || !geoData.results?.[0]) {
      return NextResponse.json({ error: 'Address not found. Please try a more specific address.' }, { status: 404 });
    }

    const { lat, lng } = geoData.results[0].geometry.location;
    const formattedAddress = geoData.results[0].formatted_address;

    // ── Step 2: Fetch satellite image from Google Maps Static API ──
    const satelliteUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=19&size=600x600&maptype=satellite&key=${mapsKey}`;
    const imgRes = await fetch(satelliteUrl);
    if (!imgRes.ok)
      return NextResponse.json({ error: 'Could not fetch satellite image' }, { status: 500 });

    const imgBuffer = await imgRes.arrayBuffer();
    const base64Image = Buffer.from(imgBuffer).toString('base64');

    // ── Step 3: Send to Claude Vision for property analysis ──
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `Analyse this satellite/aerial image of a residential property and return ONLY a JSON object with no markdown, no explanation, no backticks. The JSON must have exactly these fields:

{
  "totalSqFt": <estimated total lot size in square feet as integer, typical residential lot is 5000-15000>,
  "usableGardenSqFt": <estimated usable garden/yard area excluding house footprint and driveway, as integer>,
  "houseFootprintPct": <percentage of lot covered by house as integer 0-100>,
  "orientation": <"north-facing" | "south-facing" | "east-facing" | "west-facing" — which direction the main garden area faces for sun>,
  "climateHint": <"Temperate" | "Arid" | "Subtropical" | "Cold" — best guess from vegetation and landscape visible>,
  "existingFeatures": <array of strings describing what you can see, e.g. ["mature tree north-east corner", "concrete driveway", "lawn area", "patio or deck"]>,
  "existingTreeCount": <estimated number of mature trees visible as integer>,
  "hasDriveway": <true | false>,
  "hasPool": <true | false>,
  "hasFence": <true | false>,
  "gardenBeds": <estimated number of existing garden beds visible as integer>,
  "confidence": <"high" | "medium" | "low" — how confident you are in this analysis>
}

Be conservative with square footage estimates. If the image is unclear or not a residential property, still return valid JSON with your best estimates and confidence: "low".`,
            },
          ],
        },
      ],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';

    let analysis;
    try {
      // Strip any accidental markdown fences
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      analysis = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Could not parse property analysis' }, { status: 500 });
    }

    return NextResponse.json({
      address: formattedAddress,
      lat,
      lng,
      satelliteUrl: `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=19&size=600x600&maptype=satellite&key=${mapsKey}`,
      analysis,
    });

  } catch (err: any) {
    console.error('[Analyse property error]', err?.message);
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
