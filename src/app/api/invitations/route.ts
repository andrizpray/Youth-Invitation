import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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
  } catch (error) {
    console.error('List invitations error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
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

    // H-6: Validate maps_url starts with https://
    if (body.maps_url !== undefined && body.maps_url !== null && body.maps_url !== '') {
      if (!String(body.maps_url).startsWith('https://')) {
        return NextResponse.json(
          { error: 'maps_url harus dimulai dengan https://' },
          { status: 400 }
        );
      }
    }

    const template = db.prepare(
      'SELECT id, slug FROM templates WHERE id = ? AND is_active = 1'
    ).get(body.template_id) as any;

    if (!template) {
      return NextResponse.json({ error: 'Template tidak ditemukan' }, { status: 400 });
    }

    // Warna default per template slug
    const TEMPLATE_COLORS: Record<string, string> = {
      'classic-gold':    '{"primary":"#d4af37","secondary":"#fff8e7","accent":"#1a1a2e"}',
      'romantic-blush':  '{"primary":"#e8a0bf","secondary":"#fdf2f8","accent":"#4a1942"}',
      'islamic-green':   '{"primary":"#1b5e20","secondary":"#e8f5e9","accent":"#0d1b0e"}',
      'modern-navy':     '{"primary":"#1a237e","secondary":"#e8eaf6","accent":"#000051"}',
      'earthy-nature':   '{"primary":"#6d4c41","secondary":"#efebe9","accent":"#3e2723"}',
      'elegant-burgundy':'{"primary":"#800020","secondary":"#fce4ec","accent":"#1a0000"}',
      'tropical-paradise':'{"primary":"#ff6f61","secondary":"#fff3e0","accent":"#0d3b66"}',
      'minimalist-white':'{"primary":"#333333","secondary":"#ffffff","accent":"#000000"}',
      'sakura-pink':     '{"primary":"#f48fb1","secondary":"#fce4ec","accent":"#4a148c"}',
      'royal-purple':    '{"primary":"#6a1b9a","secondary":"#f3e5f5","accent":"#12005e"}',
      'islami-elegant':  '{"primary":"#c9a84c","secondary":"#0a1628","accent":"#e8d5a3"}',
      'modern-minimal':  '{"primary":"#2d2d2d","secondary":"#f8f8f8","accent":"#888888"}',
    };
    const defaultColors = TEMPLATE_COLORS[template.slug] || '{"primary":"#d4af37","secondary":"#fff8e7","accent":"#1a1a2e"}';

    // H-1: Wrap INSERT in try/catch and handle UNIQUE constraint error explicitly.
    // The pre-check SELECT is kept as a fast path, but the real guard is the
    // constraint catch below — eliminating the race window between check and insert.
    const existing = db.prepare('SELECT id FROM invitations WHERE slug = ?').get(slug);
    if (existing) {
      return NextResponse.json({ error: 'Slug sudah digunakan, coba slug lain' }, { status: 409 });
    }

    try {
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
        body.colors || defaultColors,
        body.font_family || 'serif',
        body.layout_style || 'classic',
        body.event_date || null,
        body.language || 'id'
      );
    } catch (insertError: any) {
      // SQLite UNIQUE constraint violation code is 'SQLITE_CONSTRAINT_UNIQUE'
      // or the message contains 'UNIQUE constraint failed'
      if (
        insertError?.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
        insertError?.message?.includes('UNIQUE constraint failed')
      ) {
        return NextResponse.json(
          { error: 'Slug sudah digunakan, coba slug lain' },
          { status: 409 }
        );
      }
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      invitation: { id, slug },
    }, { status: 201 });
  } catch (error) {
    console.error('Create invitation error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
