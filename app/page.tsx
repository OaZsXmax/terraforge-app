import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard/garden');
}

// Tell Next.js this page is dynamic so the redirect works in static export
export const dynamic = 'force-static';
