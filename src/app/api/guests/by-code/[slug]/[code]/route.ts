import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET - Find guest by invitation slug and guest code
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; code: string }> }
) {
  const { slug, code } = await params;
  const db = getDb();

  const guest = db.prepare(`
    SELECT g.id, g.name, g.email, g.phone, g.code, g.is_attending, g.guest_count
    FROM guests g
    JOIN invitations i ON g.invitation_id = i.id
    WHERE i.slug = ? AND g.code = ?
  `).get(slug, code.toUpperCase());

  if (!guest) {
    return NextResponse.json({ error: 'Tamu tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({ guest });
}
