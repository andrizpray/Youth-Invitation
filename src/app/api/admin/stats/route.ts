import { NextResponse } from 'next/server';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = getDb();

  const totalUsers = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  const totalInvitations = (db.prepare('SELECT COUNT(*) as count FROM invitations').get() as { count: number }).count;
  const totalPublished = (db.prepare('SELECT COUNT(*) as count FROM invitations WHERE published = 1').get() as { count: number }).count;
  const totalTemplates = (db.prepare('SELECT COUNT(*) as count FROM templates').get() as { count: number }).count;
  const totalActiveTemplates = (db.prepare('SELECT COUNT(*) as count FROM templates WHERE is_active = 1').get() as { count: number }).count;

  return NextResponse.json({
    totalUsers,
    totalInvitations,
    totalPublished,
    totalTemplates,
    totalActiveTemplates,
  });
}
