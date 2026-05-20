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

  const { id } = await params;
  const body = await req.json();
  const { role } = body;

  if (!role || !['user', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
  }

  const db = getDb();
  const target = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!target) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
  }

  // Prevent demoting yourself
  if (user!.id === id && role !== 'admin') {
    return NextResponse.json({ error: 'Tidak bisa mengubah role diri sendiri' }, { status: 400 });
  }

  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  // Prevent self-deletion
  if (user!.id === id) {
    return NextResponse.json({ error: 'Tidak bisa menghapus akun sendiri' }, { status: 400 });
  }

  const db = getDb();
  const target = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!target) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(id);

  return NextResponse.json({ success: true });
}
