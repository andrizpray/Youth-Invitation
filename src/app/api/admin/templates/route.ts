import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  const user = await getCurrentUser();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const db = getDb();
    const templates = db.prepare(`
      SELECT t.*, COUNT(i.id) as usage_count
      FROM templates t
      LEFT JOIN invitations i ON i.template_id = t.id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `).all();

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Admin templates GET error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, slug, description = '', thumbnail = '', category = 'umum', is_active = 1 } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'name dan slug wajib diisi' }, { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM templates WHERE slug = ?').get(slug);
    if (existing) {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
    }

    const id = randomUUID();
    db.prepare(`
      INSERT INTO templates (id, name, slug, description, thumbnail, category, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, slug, description, thumbnail, category, is_active ? 1 : 0);

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Admin templates POST error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
