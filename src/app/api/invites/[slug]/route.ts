import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/invites/[slug] - Public invitation by slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const db = getDb();

  const inv = db.prepare('SELECT * FROM invitations WHERE slug = ? AND status = ?').get(slug, 'active') as import('@/lib/types').Invitation | undefined;

  if (!inv) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  // Get template info
  const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(inv.template_id) as import('@/lib/types').Template | undefined;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  return NextResponse.json({ invitation: inv, template }, { headers: corsHeaders });
}
