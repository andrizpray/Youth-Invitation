import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, requireAdmin, hashPassword } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  const user = await getCurrentUser();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = getDb();
  const users = db.prepare(`
    SELECT u.id, u.email, u.name, u.role, u.created_at,
           COUNT(i.id) as invitation_count
    FROM users u
    LEFT JOIN invitations i ON i.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all();

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!requireAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { name, email, password, role = 'user' } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'name, email, dan password wajib diisi' }, { status: 400 });
  }

  if (!['user', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
  }

  const id = randomUUID();
  const password_hash = await hashPassword(password);

  db.prepare(`
    INSERT INTO users (id, email, name, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, email, name, password_hash, role);

  return NextResponse.json({ success: true, id }, { status: 201 });
}
