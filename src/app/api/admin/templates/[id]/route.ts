import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const db = getDb();
    const template = db.prepare('SELECT id FROM templates WHERE id = ?').get(id);
    if (!template) {
      return NextResponse.json({ error: 'Template tidak ditemukan' }, { status: 404 });
    }

    const allowed = ['name', 'description', 'is_active', 'category', 'thumbnail'];
    const updates: string[] = [];
    const values: unknown[] = [];

    for (const key of allowed) {
      if (key in body) {
        updates.push(`${key} = ?`);
        values.push(key === 'is_active' ? (body[key] ? 1 : 0) : body[key]);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Tidak ada field yang diupdate' }, { status: 400 });
    }

    values.push(id);
    db.prepare(`UPDATE templates SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin template PATCH error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const db = getDb();

    const template = db.prepare('SELECT id FROM templates WHERE id = ?').get(id);
    if (!template) {
      return NextResponse.json({ error: 'Template tidak ditemukan' }, { status: 404 });
    }

    // Check if template is in use
    const inUse = db.prepare('SELECT COUNT(*) as count FROM invitations WHERE template_id = ?').get(id) as { count: number };
    if (inUse.count > 0) {
      return NextResponse.json(
        { error: `Template sedang digunakan oleh ${inUse.count} undangan, tidak bisa dihapus` },
        { status: 409 }
      );
    }

    db.prepare('DELETE FROM templates WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin template DELETE error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
