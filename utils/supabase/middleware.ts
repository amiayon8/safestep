// middleware.ts (or wherever withAdminAuth is defined)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from './server';

export async function withAdminAuth(request: NextRequest): Promise<NextResponse | void> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = data.user?.role;

  if (role !== 'admin') {
    return NextResponse.json({ error: 'This is for admins only!' }, { status: 401 });
  }

  // On successful authentication and authorization, return void
  return;
}