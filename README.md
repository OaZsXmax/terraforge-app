# TerraForge — AI Homestead & Permaculture Planner

Live: https://www.terraforgehome.com

## Stack
- Next.js 16 + TypeScript + React 19
- Supabase (auth + database)
- Stripe (payments)
- Anthropic Claude API (blueprint generation)
- Capacitor (Android app)

## Status
- ✅ Auth (Supabase)
- ✅ Stripe Pro subscription + webhooks
- ✅ AI blueprint generation
- ✅ Password reset
- ✅ Cancel subscription flow
- ✅ Mobile responsive
- ✅ PWA manifest
- ✅ SEO configured
- ✅ Domain: www.terraforgehome.com
- ⏳ Google Analytics
- ⏳ Google Search Console

## Dev
```bash
npm run dev        # local development
npm run build      # Vercel production build
npm run build:mobile  # Capacitor Android static export
npm run android    # build + sync + open Android Studio
```

## Key Files
```
app/dashboard/garden/page.tsx     ← entire app (~8000 lines)
app/dashboard/garden/generate.ts  ← AI blueprint generation
app/api/generate-blueprint/       ← Anthropic proxy + rate limiting
app/api/checkout/                 ← Stripe checkout
app/api/stripe/webhook/           ← Stripe webhook handler
app/api/subscription/             ← plan check
app/api/cancel-subscription/      ← cancel + reason logging
app/auth/reset/                   ← password reset page
components/FeatureIcon.tsx         ← SVG icon renderer
components/Paywall.tsx             ← upgrade modal
hooks/usePlan.ts                   ← plan checker
lib/checkout.ts                    ← createCheckoutSession
```

## Environment Variables
See Vercel dashboard for all secrets. Local dev needs `.env.local` with:
`NEXT_PUBLIC_APP_URL`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`ANTHROPIC_API_KEY`
