// app/api/generate-blueprint/route.ts
import { NextRequest, NextResponse } from 'next/server';

// ─── In-memory rate limit store ───────────────────────────────────────────────
// Key: userId (IP + user-agent hash), Value: { count, resetAt }
// For production replace with Redis or a DB — this resets on server restart.
const MONTHLY_LIMIT = 100;

interface RateEntry { count: number; resetAt: number; }
const rateLimitStore = new Map<string, RateEntry>();

function getRateLimitKey(req: NextRequest): string {
  // Use IP + a truncated user-agent as the identifier
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';
  const ua = (req.headers.get('user-agent') ?? '').slice(0, 40);
  return `${ip}::${ua}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now      = Date.now();
  const entry    = rateLimitStore.get(key);
  const monthMs  = 30 * 24 * 60 * 60 * 1000;

  // No entry or expired — fresh window
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + monthMs });
    return { allowed: true, remaining: MONTHLY_LIMIT - 1, resetAt: now + monthMs };
  }

  if (entry.count >= MONTHLY_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: MONTHLY_LIMIT - entry.count, resetAt: entry.resetAt };
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Rate limit check
    const key   = getRateLimitKey(req);
    const limit = checkRateLimit(key);

    if (!limit.allowed) {
      const resetDate = new Date(limit.resetAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      return NextResponse.json(
        {
          error:   'Monthly blueprint limit reached',
          detail:  `You've used all ${MONTHLY_LIMIT} AI blueprint generations for this month. Resets ${resetDate}.`,
          resetAt: limit.resetAt,
          code:    'RATE_LIMIT_EXCEEDED',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit':     String(MONTHLY_LIMIT),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset':     String(limit.resetAt),
            'Retry-After':           String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    // 2. Forward to Anthropic
    const body = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `Anthropic API error: ${response.status}`, detail: err },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 3. Return result with rate limit headers
    return NextResponse.json(data, {
      headers: {
        'X-RateLimit-Limit':     String(MONTHLY_LIMIT),
        'X-RateLimit-Remaining': String(limit.remaining),
        'X-RateLimit-Reset':     String(limit.resetAt),
      },
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error', detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
