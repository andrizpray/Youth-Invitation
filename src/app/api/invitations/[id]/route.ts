import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/invitations/[id] - Get single invitation
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  const { id } = await params;

  const db = getDb();
  const invitation = db.prepare('SELECT * FROM invitations WHERE id = ?').get(id) as any;

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  // Public access? Allow if not logged in (for guest view)
  if (!user && invitation.status === 'draft') {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  // Get guest count
  const guestCount = db.prepare(
    'SELECT COUNT(*) as total, SUM(CASE WHEN is_attending = 1 THEN 1 ELSE 0 END) as attending FROM guests WHERE invitation_id = ?'
  ).get(id) as any;

  const attendingRSVP = db.prepare(
    'SELECT COUNT(*) as total FROM guests WHERE invitation_id = ? AND is_attending = 1'
  ).get(id) as any;

  return NextResponse.json({
    ...invitation,
    total_guests: guestCount?.total || 0,
    total_attending: guestCount?.attending || 0,
  });
}

// PATCH /api/invitations/[id] - Update invitation
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  const invitation = db.prepare('SELECT * FROM invitations WHERE id = ? AND user_id = ?').get(id, user.id) as any;
  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const allowedFields = [
      'title', 'partner_name', 'partner_name2', 'parent_name', 'parent_name2',
      'date_akad', 'date_resepsi', 'time_akad', 'time_resepsi',
      'location', 'address', 'maps_url', 'quote', 'story',
      'gallery_photos', 'music_url', 'colors', 'font_family',
      'layout_style', 'published', 'status', 'language', 'event_date',
      'template_id',
    ];

    // Jika template_id diganti dan colors tidak diset manual,
    // otomatis pakai warna default dari template baru
    if (body.template_id && body.colors === undefined) {
      const tmpl = db.prepare('SELECT colors FROM templates WHERE id = ?').get(body.template_id) as any;
      if (tmpl?.colors) {
        body.colors = tmpl.colors;
      }
    }

    const updates: string[] = [];
    const values: any[] = [];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data yang diupdate' }, { status: 400 });
    }

    updates.push('updated_at = datetime(\'now\')');
    values.push(id);

    db.prepare(`UPDATE invitations SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const updated = db.prepare('SELECT * FROM invitations WHERE id = ?').get(id);
    return NextResponse.json({ success: true, invitation: updated });
  } catch (error) {
    console.error('Update invitation error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// DELETE /api/invitations/[id] - Delete invitation
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  const invitation = db.prepare('SELECT * FROM invitations WHERE id = ? AND user_id = ?').get(id, user.id) as any;
  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  db.prepare('DELETE FROM invitations WHERE id = ?').run(id);
  return NextResponse.json({ success: true, message: 'Undangan berhasil dihapus' });
}
