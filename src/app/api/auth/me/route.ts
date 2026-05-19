import { NextResponse } from 'next/server';
import { getCurrentUser, clearAuthCookie } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at,
    },
  });
}

export async function DELETE() {
  await clearAuthCookie();
  return NextResponse.json({ success: true, message: 'Logout berhasil' });
}
