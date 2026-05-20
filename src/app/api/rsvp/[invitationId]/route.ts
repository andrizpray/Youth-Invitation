import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';

// GET /api/rsvp/[invitationId] - Get guests for an invitation (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const { invitationId } = await params;
  const db = getDb();

  const invitation = db.prepare('SELECT id, slug, status FROM invitations WHERE id = ?').get(invitationId) as any;
  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  const guests = db.prepare(
    'SELECT id, name, is_attending, guest_count, message, created_at FROM guests WHERE invitation_id = ? ORDER BY created_at DESC'
  ).all(invitationId);

  const stats = db.prepare(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN is_attending = 1 THEN 1 ELSE 0 END) as attending,
      SUM(CASE WHEN is_attending = 0 THEN 1 ELSE 0 END) as not_attending,
      SUM(CASE WHEN is_attending = 1 THEN guest_count ELSE 0 END) as total_guests
    FROM guests WHERE invitation_id = ?`
  ).get(invitationId);

  return NextResponse.json({ guests, stats });
}

// POST /api/rsvp/[invitationId] - Submit RSVP
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const { invitationId } = await params;
  const db = getDb();

  const invitation = db.prepare('SELECT id, status FROM invitations WHERE id = ?').get(invitationId) as any;
  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  if (invitation.status !== 'active') {
    return NextResponse.json({ error: 'Undangan tidak aktif' }, { status: 400 });
  }

  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 });
    }

    const isAttending = body.is_attending ? 1 : 0;
    const guestCount = Math.max(1, Math.min(10, parseInt(body.guest_count) || 1));

    // Check if guest already exists by name
    const existingGuest = db.prepare(
      'SELECT id FROM guests WHERE invitation_id = ? AND name = ?'
    ).get(invitationId, body.name.trim()) as any;

    if (existingGuest) {
      // Update existing guest
      db.prepare(`
        UPDATE guests SET
          is_attending = ?,
          guest_count = ?,
          message = ?
        WHERE id = ?
      `).run(isAttending, guestCount, body.message || null, existingGuest.id);
    } else {
      // Insert new guest
      const id = uuidv4();
      db.prepare(`
        INSERT INTO guests (id, invitation_id, name, phone, is_attending, guest_count, message)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, invitationId, body.name.trim(), body.phone || null,
        isAttending, guestCount, body.message || null
      );
    }

    return NextResponse.json({ success: true, message: 'RSVP berhasil dikirim' }, { status: 201 });
  } catch (error) {
    console.error('RSVP error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
