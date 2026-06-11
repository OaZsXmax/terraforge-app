import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'TerraForge — AI Homestead & Permaculture Planner',
  description: 'Design your self-sufficient homestead with AI. TerraForge generates personalised permaculture blueprints — food forests, water systems, solar, and more — tailored to your land, climate, and budget.',
  manifest: '/manifest.json',
  keywords: [
    'permaculture planner',
    'homestead design app',
    'AI permaculture',
    'self-sufficient living',
    'food forest planner',
    'regenerative agriculture tool',
    'homestead blueprint',
    'off-grid planner',
    'backyard farm design',
    'sustainable homestead',
    'permaculture design software',
    'food self-sufficiency calculator',
    'water harvesting planner',
    'solar homestead',
    'market garden planner',
  ],
  authors: [{ name: 'TerraForge' }],
  creator: 'TerraForge',
  metadataBase: new URL('https://www.terraforgehome.com'),
  openGraph: {
    title: 'TerraForge — AI Homestead & Permaculture Planner',
    description: 'Design your self-sufficient homestead with AI. Personalised permaculture blueprints tailored to your land, climate, and budget.',
    url: 'https://www.terraforgehome.com',
    siteName: 'TerraForge',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TerraForge — AI Homestead & Permaculture Planner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TerraForge — AI Homestead & Permaculture Planner',
    description: 'Design your self-sufficient homestead with AI. Personalised permaculture blueprints tailored to your land, climate, and budget.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon-192.png',
    shortcut: '/icon-192.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="yes">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0a1f15" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="canonical" href="https://www.terraforgehome.com" />
      </head>
      <body>
        {children}
        <GoogleAnalytics gaId="G-WJW61VFSYN" />
      </body>
    </html>
  );
}
