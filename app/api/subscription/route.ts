import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ plan: 'free' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ plan: 'free' });

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_expires_at')
    .eq('id', user.id)
    .single();

  if (!profile) return NextResponse.json({ plan: 'free' });

  if (profile.plan === 'pro' && profile.plan_expires_at) {
    if (new Date(profile.plan_expires_at) < new Date()) {
      await supabase.from('profiles').update({ plan: 'free' }).eq('id', user.id);
      return NextResponse.json({ plan: 'free' });
    }
  }

  return NextResponse.json({ plan: profile.plan ?? 'free' });
}
