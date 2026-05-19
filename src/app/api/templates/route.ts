import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const templates = db.prepare(
    'SELECT id, name, slug, description, thumbnail, category FROM templates WHERE is_active = 1 ORDER BY category, name'
  ).all();

  return NextResponse.json({ templates });
}
