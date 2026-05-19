import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const db = getDb();

    // Check if admin already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@youthinvitation.com') as any;
    if (existing) {
      return NextResponse.json({ message: 'Database sudah siap' });
    }

    // Create admin user
    const { hashPassword } = await import('@/lib/auth');
    const { v4: uuidv4 } = await import('uuid');
    const password_hash = await hashPassword('admin123');

    db.prepare(
      'INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)'
    ).run(uuidv4(), 'admin@youthinvitation.com', 'Admin Youth', password_hash, 'admin');

    // Seed templates
    await seedNow(db);

    return NextResponse.json({ success: true, message: 'Setup berhasil! Login: admin@youthinvitation.com / admin123' });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Setup gagal' }, { status: 500 });
  }
}

async function seedNow(db: any) {
  const { v4: uuidv4 } = await import('uuid');

  const templates = [
    { name: 'Classic Gold', slug: 'classic-gold', description: 'Tema klasik dengan aksen emas elegan', category: 'klasik' },
    { name: 'Romantic Blush', slug: 'romantic-blush', description: 'Nuansa pink lembut yang romantis', category: 'romantic' },
    { name: 'Islamic Green', slug: 'islamic-green', description: 'Tema islami dengan warna hijau kalem', category: 'islami' },
    { name: 'Modern Navy', slug: 'modern-navy', description: 'Tampilan modern dengan warna navy bold', category: 'modern' },
    { name: 'Earthy Nature', slug: 'earthy-nature', description: 'Nuansa alam dengan warna earthy tones', category: 'natural' },
    { name: 'Elegant Burgundy', slug: 'elegant-burgundy', description: 'Warna burgundy yang mewah dan elegan', category: 'klasik' },
    { name: 'Tropical Paradise', slug: 'tropical-paradise', description: 'Nuansa tropis segar dengan warna coral', category: 'modern' },
    { name: 'Minimalist White', slug: 'minimalist-white', description: 'Desain minimalis bersih dengan sentuhan hitam', category: 'modern' },
    { name: 'Sakura Pink', slug: 'sakura-pink', description: 'Inspirasi bunga sakura Jepang', category: 'romantic' },
    { name: 'Royal Purple', slug: 'royal-purple', description: 'Nuansa ungu kerajaan yang mewah', category: 'klasik' },
  ];

  const count = db.prepare('SELECT COUNT(*) as count FROM templates').get() as any;
  if (count.count === 0) {
    const insert = db.prepare('INSERT INTO templates (id, name, slug, description, category) VALUES (?, ?, ?, ?, ?)');
    for (const t of templates) {
      insert.run(uuidv4(), t.name, t.slug, t.description, t.category);
    }
  }
}
