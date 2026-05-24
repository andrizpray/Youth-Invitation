import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// Generate unique code for guest link
function generateCode(): string {
  return uuidv4().slice(0, 8).toUpperCase();
}

// GET - List all guests for an invitation
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { invitationId } = await params;
    const db = getDb();

    // Verify ownership
    const invitation = db.prepare(
      'SELECT id, slug FROM invitations WHERE id = ? AND user_id = ?'
    ).get(invitationId, user.id);

    if (!invitation) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
    }

    const guests = db.prepare(
      'SELECT * FROM guests WHERE invitation_id = ? ORDER BY created_at DESC'
    ).all(invitationId);

    return NextResponse.json({ guests, invitation });
  } catch (error) {
    console.error('List guests error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// POST - Add single guest or bulk from CSV
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { invitationId } = await params;
  const db = getDb();

  // Verify ownership
  const invitation = db.prepare(
    'SELECT id, slug FROM invitations WHERE id = ? AND user_id = ?'
  ).get(invitationId, user.id);

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  const body = await req.json();

  // Bulk insert from CSV
  if (Array.isArray(body.guests)) {
    if (body.guests.length > 500) {
      return NextResponse.json({ error: 'Maksimal 500 tamu per permintaan' }, { status: 400 });
    }
    const insert = db.prepare(`
      INSERT INTO guests (id, invitation_id, name, email, phone, code)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const results: { name: string; code: string }[] = [];
    const errors: string[] = [];

    const insertMany = db.transaction(() => {
      for (const g of body.guests) {
        if (!g.name || !g.name.trim()) {
          errors.push(`Baris dilewati: nama kosong`);
          continue;
        }
        const id = uuidv4();
        const code = generateCode();
        try {
          insert.run(id, invitationId, g.name.trim(), g.email || null, g.phone || null, code);
          results.push({ name: g.name.trim(), code });
        } catch (e: unknown) {
          if ((e as { code?: string }).code === 'SQLITE_CONSTRAINT_UNIQUE') {
            errors.push(`${g.name}: kode duplikat, coba lagi`);
          } else {
            errors.push(`${g.name}: ${(e as { message?: string }).message ?? 'unknown error'}`);
          }
        }
      }
    });

    insertMany();

    return NextResponse.json({
      success: true,
      added: results.length,
      guests: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  }

  // Single guest insert
  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: 'Nama tamu wajib diisi' }, { status: 400 });
  }

  const id = uuidv4();
  const code = generateCode();

  try {
    db.prepare(`
      INSERT INTO guests (id, invitation_id, name, email, phone, code)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, invitationId, body.name.trim(), body.email || null, body.phone || null, code);
    return NextResponse.json({
      success: true,
      guest: { id, name: body.name.trim(), email: body.email, phone: body.phone, code },
    });
  } catch (error) {
    console.error('Add guest error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// DELETE - Remove a guest
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { invitationId } = await params;
  const db = getDb();

  // Verify ownership
  const invitation = db.prepare(
    'SELECT id FROM invitations WHERE id = ? AND user_id = ?'
  ).get(invitationId, user.id);

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const guestId = searchParams.get('guestId');

  if (!guestId) {
    return NextResponse.json({ error: 'Guest ID diperlukan' }, { status: 400 });
  }

  try {
    db.prepare('DELETE FROM guests WHERE id = ? AND invitation_id = ?').run(guestId, invitationId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete guest error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// PATCH - Update guest
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { invitationId } = await params;
  const db = getDb();

  // Verify ownership
  const invitation = db.prepare(
    'SELECT id FROM invitations WHERE id = ? AND user_id = ?'
  ).get(invitationId, user.id);

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: 'Guest ID diperlukan' }, { status: 400 });
  }

  try {
    db.prepare(`
      UPDATE guests SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone)
      WHERE id = ? AND invitation_id = ?
    `).run(
      body.name?.trim() || null,
      body.email || null,
      body.phone || null,
      body.id,
      invitationId
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update guest error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
