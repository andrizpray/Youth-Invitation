import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';

const templates = [
  { name: 'Classic Gold', slug: 'classic-gold', description: 'Tema klasik dengan aksen emas elegan', category: 'klasik', colors: '{"primary":"#d4af37","secondary":"#fff8e7","accent":"#1a1a2e"}' },
  { name: 'Romantic Blush', slug: 'romantic-blush', description: 'Nuansa pink lembut yang romantis', category: 'romantic', colors: '{"primary":"#e8a0bf","secondary":"#fdf2f8","accent":"#4a1942"}' },
  { name: 'Islamic Green', slug: 'islamic-green', description: 'Tema islami dengan warna hijau kalem', category: 'islami', colors: '{"primary":"#1b5e20","secondary":"#e8f5e9","accent":"#0d1b0e"}' },
  { name: 'Modern Navy', slug: 'modern-navy', description: 'Tampilan modern dengan warna navy bold', category: 'modern', colors: '{"primary":"#1a237e","secondary":"#e8eaf6","accent":"#000051"}' },
  { name: 'Earthy Nature', slug: 'earthy-nature', description: 'Nuansa alam dengan warna earthy tones', category: 'natural', colors: '{"primary":"#6d4c41","secondary":"#efebe9","accent":"#3e2723"}' },
  { name: 'Elegant Burgundy', slug: 'elegant-burgundy', description: 'Warna burgundy yang mewah dan elegan', category: 'klasik', colors: '{"primary":"#800020","secondary":"#fce4ec","accent":"#1a0000"}' },
  { name: 'Tropical Paradise', slug: 'tropical-paradise', description: 'Nuansa tropis segar dengan warna coral', category: 'modern', colors: '{"primary":"#ff6f61","secondary":"#fff3e0","accent":"#0d3b66"}' },
  { name: 'Minimalist White', slug: 'minimalist-white', description: 'Desain minimalis bersih dengan sentuhan hitam', category: 'modern', colors: '{"primary":"#333333","secondary":"#ffffff","accent":"#000000"}' },
  { name: 'Sakura Pink', slug: 'sakura-pink', description: 'Inspirasi bunga sakura Jepang', category: 'romantic', colors: '{"primary":"#f48fb1","secondary":"#fce4ec","accent":"#4a148c"}' },
  { name: 'Royal Purple', slug: 'royal-purple', description: 'Nuansa ungu kerajaan yang mewah', category: 'klasik', colors: '{"primary":"#6a1b9a","secondary":"#f3e5f5","accent":"#12005e"}' },
  { name: 'Islami Elegant', slug: 'islami-elegant', description: 'Tema islami elegan dengan latar navy gelap dan aksen emas', category: 'islami', colors: '{"primary":"#c9a84c","secondary":"#0a1628","accent":"#e8d5a3"}' },
  { name: 'Modern Minimal', slug: 'modern-minimal', description: 'Desain modern minimalis bersih dengan tipografi ringan', category: 'modern', colors: '{"primary":"#2d2d2d","secondary":"#f8f8f8","accent":"#888888"}' },
];

export async function seedTemplates() {
  const db = getDb();

  const count = db.prepare('SELECT COUNT(*) as count FROM templates').get() as any;
  if (count.count === 0) {
    // Fresh DB — insert all templates
    const insert = db.prepare(
      'INSERT INTO templates (id, name, slug, description, category) VALUES (?, ?, ?, ?, ?)'
    );
    const insertAll = db.transaction(() => {
      for (const t of templates) {
        insert.run(uuidv4(), t.name, t.slug, t.description, t.category);
      }
    });
    insertAll();
    console.log(`[Seed] Inserted ${templates.length} templates`);
    return;
  }

  // DB already has templates — upsert any that are missing by slug
  const getBySlug = db.prepare('SELECT id FROM templates WHERE slug = ?');
  const insert = db.prepare(
    'INSERT INTO templates (id, name, slug, description, category) VALUES (?, ?, ?, ?, ?)'
  );

  const upsertMissing = db.transaction(() => {
    let inserted = 0;
    for (const t of templates) {
      const existing = getBySlug.get(t.slug);
      if (!existing) {
        insert.run(uuidv4(), t.name, t.slug, t.description, t.category);
        inserted++;
        console.log(`[Seed] Inserted missing template: ${t.slug}`);
      }
    }
    if (inserted === 0) {
      console.log(`[Seed] All templates already present (${count.count}), nothing to insert.`);
    } else {
      console.log(`[Seed] Inserted ${inserted} missing template(s).`);
    }
  });

  upsertMissing();
}

export { templates };
