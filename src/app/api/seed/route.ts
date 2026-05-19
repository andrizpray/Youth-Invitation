import { NextResponse } from 'next/server';
import { seedTemplates } from '@/lib/seed';

export async function POST() {
  try {
    await seedTemplates();
    return NextResponse.json({ success: true, message: 'Seed berhasil' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed gagal' }, { status: 500 });
  }
}
