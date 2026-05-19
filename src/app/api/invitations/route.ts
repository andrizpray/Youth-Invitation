import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const invitations = db.prepare(
    'SELECT * FROM invitations WHERE user_id = ? ORDER BY created_at DESC'
  ).all(user.id);

  // Count guests for each invitation
  const result = invitations.map((inv: any) => {
    const guestCount = db.prepare(
      'SELECT COUNT(*) as total FROM guests WHERE invitation_id = ?'
    ).get(inv.id) as any;
    return { ...inv, total_guests: guestCount?.total || 0 };
  });

  return NextResponse.json({ invitations: result });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const db = getDb();

    const id = uuidv4();
    const slug = (body.slug || `inv-${id.slice(0, 8)}`).toLowerCase().trim();

    // Validate slug format
    if (!/^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$/.test(slug)) {
      return NextResponse.json({
        error: 'Slug hanya boleh huruf kecil, angka, dan tanda hubung (-). Minimal 3 karakter.'
      }, { status: 400 });
    }

    // Blacklist reserved paths
    const RESERVED = [
      'api', 'dashboard', 'login', 'register', 'logout', 'admin',
      'about', 'contact', 'pricing', 'terms', 'privacy', 'help',
      'static', '_next', 'favicon', 'robots', 'sitemap', 'www',
    ];
    if (RESERVED.includes(slug.split('-')[0])) {
      return NextResponse.json({ error: 'Slug tidak tersedia, gunakan slug lain' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = db.prepare('SELECT id FROM invitations WHERE slug = ?').get(slug);
    if (existing) {
      return NextResponse.json({ error: 'Slug sudah digunakan, coba slug lain' }, { status: 409 });
    }

    const template = db.prepare(
      'SELECT id FROM templates WHERE id = ? AND is_active = 1'
    ).get(body.template_id);

    if (!template) {
      return NextResponse.json({ error: 'Template tidak ditemukan' }, { status: 400 });
    }

    db.prepare(`
      INSERT INTO invitations (
        id, user_id, slug, title, template_id, package_type,
        partner_name, partner_name2, date_akad, time_akad,
        location, address, maps_url, colors, font_family,
        layout_style, event_date, language
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, user.id, slug, body.title || 'Undangan Pernikahan',
      body.template_id, body.package_type || 'basic',
      body.partner_name || '', body.partner_name2 || '',
      body.date_akad || null, body.time_akad || null,
      body.location || '', body.address || '',
      body.maps_url || null,
      body.colors || '{"primary":"#d4af37","secondary":"#ffffff","accent":"#1a1a2e"}',
      body.font_family || 'serif',
      body.layout_style || 'classic',
      body.event_date || null,
      body.language || 'id'
    );

    return NextResponse.json({
      success: true,
      invitation: { id, slug },
    }, { status: 201 });
  } catch (error) {
    console.error('Create invitation error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
