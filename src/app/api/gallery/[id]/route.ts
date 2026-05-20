import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - Get gallery for an invitation
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  const invitation = db.prepare(
    'SELECT id, gallery_photos FROM invitations WHERE id = ? AND user_id = ?'
  ).get(id, user.id) as any;

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  const photos = invitation.gallery_photos ? JSON.parse(invitation.gallery_photos) : [];

  return NextResponse.json({ photos });
}

// PATCH - Update gallery (add/remove photos)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  const invitation = db.prepare(
    'SELECT id FROM invitations WHERE id = ? AND user_id = ?'
  ).get(id, user.id);

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  const body = await req.json();
  const { photos } = body;

  if (!Array.isArray(photos)) {
    return NextResponse.json({ error: 'Photos harus berupa array' }, { status: 400 });
  }

  // Limit to 10 photos
  const limitedPhotos = photos.slice(0, 10);

  db.prepare(
    'UPDATE invitations SET gallery_photos = ?, updated_at = datetime(\'now\') WHERE id = ?'
  ).run(JSON.stringify(limitedPhotos), id);

  return NextResponse.json({ success: true, photos: limitedPhotos });
}

// POST - Add photo to gallery
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    const invitation = db.prepare(
      'SELECT id, gallery_photos FROM invitations WHERE id = ? AND user_id = ?'
    ).get(id, user.id) as any;

    if (!invitation) {
      return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL foto diperlukan' }, { status: 400 });
    }

    const photos = invitation.gallery_photos ? JSON.parse(invitation.gallery_photos) : [];

    if (photos.length >= 10) {
      return NextResponse.json({ error: 'Maksimal 10 foto' }, { status: 400 });
    }

    photos.push(url);

    db.prepare(
      'UPDATE invitations SET gallery_photos = ?, updated_at = datetime(\'now\') WHERE id = ?'
    ).run(JSON.stringify(photos), id);

    return NextResponse.json({ success: true, photos });
  } catch (error: any) {
    console.error('Gallery POST error:', error);
    return NextResponse.json({ error: error.message || 'Gagal menambah foto' }, { status: 500 });
  }
}

// DELETE - Remove photo from gallery
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  const invitation = db.prepare(
    'SELECT id, gallery_photos FROM invitations WHERE id = ? AND user_id = ?'
  ).get(id, user.id) as any;

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL foto diperlukan' }, { status: 400 });
  }

  let photos = invitation.gallery_photos ? JSON.parse(invitation.gallery_photos) : [];
  photos = photos.filter((p: string) => p !== url);

  db.prepare(
    'UPDATE invitations SET gallery_photos = ?, updated_at = datetime(\'now\') WHERE id = ?'
  ).run(JSON.stringify(photos), id);

  return NextResponse.json({ success: true, photos });
}
