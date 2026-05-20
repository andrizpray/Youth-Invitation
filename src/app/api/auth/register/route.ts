import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  // H-2: Rate limiting — max 5 attempts per IP per 15 minutes
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const rl = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
  if (rl.limited) {
    return NextResponse.json(
      { error: 'Terlalu banyak percobaan registrasi. Coba lagi nanti.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) },
      }
    );
  }

  try {
    const { email, name, password } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Email, nama, dan password wajib diisi' }, { status: 400 });
    }

    // H-3: Email format validation
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
    }

    // H-4: Input length validation
    if (name.length > 100) {
      return NextResponse.json({ error: 'Nama maksimal 100 karakter' }, { status: 400 });
    }
    if (email.length > 254) {
      return NextResponse.json({ error: 'Email maksimal 254 karakter' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
    }
    if (password.length > 72) {
      return NextResponse.json({ error: 'Password maksimal 72 karakter' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    const password_hash = await hashPassword(password);
    const id = uuidv4();

    db.prepare(
      'INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)'
    ).run(id, email, name, password_hash, 'user');

    return NextResponse.json({ success: true, message: 'Registrasi berhasil' }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
