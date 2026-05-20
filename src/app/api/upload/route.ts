import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
const ALLOWED_IMAGE_MAGIC = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_AUDIO_MAGIC = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/x-m4a'];

// POST - Upload file
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string || 'photo'; // 'photo' or 'music'

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File terlalu besar (max 10MB)' }, { status: 400 });
    }

    // Validate file type from Content-Type header
    const allowedTypes = type === 'music' ? ALLOWED_AUDIO_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: `Tipe file tidak didukung. Allowed: ${allowedTypes.join(', ')}`,
      }, { status: 400 });
    }

    // Read file buffer once — reuse for magic bytes check and writing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // C5: Validate actual MIME type from magic bytes (prevent Content-Type spoofing)
    const { fileTypeFromBuffer } = await import('file-type');
    const detected = await fileTypeFromBuffer(buffer);
    const allowedMagic = type === 'music' ? ALLOWED_AUDIO_MAGIC : ALLOWED_IMAGE_MAGIC;
    if (!detected || !allowedMagic.includes(detected.mime)) {
      return NextResponse.json({
        error: 'Konten file tidak sesuai dengan tipe yang diizinkan',
      }, { status: 400 });
    }

    // Create upload directory if not exists
    const subDir = type === 'music' ? 'music' : 'photos';
    const uploadPath = path.join(UPLOAD_DIR, subDir);
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    // Generate unique filename using detected extension (not user-supplied)
    const ext = detected.ext;
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${randomStr}.${ext}`;
    const filePath = path.join(uploadPath, filename);

    // Write file
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${subDir}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: detected.mime,
    });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Gagal mengupload file' }, { status: 500 });
  }
}

// DELETE - Delete file
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url || !url.startsWith('/uploads/')) {
      return NextResponse.json({ error: 'URL tidak valid' }, { status: 400 });
    }

    // C4: Prevent path traversal — resolve and verify path stays inside /uploads/
    const uploadBase = path.resolve(path.join(process.cwd(), 'public', 'uploads'));
    const resolved = path.resolve(path.join(process.cwd(), 'public', url));
    if (!resolved.startsWith(uploadBase + path.sep)) {
      return NextResponse.json({ error: 'URL tidak valid' }, { status: 400 });
    }

    // Check if file exists
    if (!existsSync(resolved)) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 404 });
    }

    await unlink(resolved);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Gagal menghapus file' }, { status: 500 });
  }
}
