'use client';

import { useState, useRef, useEffect } from 'react';

interface MediaUploaderProps {
  invitationId: string;
  type: 'photo';
}

interface MusicUploaderProps {
  invitationId: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
}

export function MediaUploader({ invitationId, type }: MediaUploaderProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadGallery();
  }, [invitationId]);

  const loadGallery = async () => {
    try {
      const res = await fetch(`/api/gallery/${invitationId}`);
      const data = await res.json();
      setPhotos(data.photos || []);
      setError('');
    } catch {
      setError('Gagal memuat galeri');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 10) {
      setError('Maksimal 10 foto');
      return;
    }

    setUploading(true);
    setError('');
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          await fetch(`/api/gallery/${invitationId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: data.url }),
          });
        } else {
          setError(data.error || 'Gagal mengupload');
        }
      }
      await loadGallery();
    } catch {
      setError('Gagal mengupload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm('Hapus foto ini?')) return;
    try {
      const res = await fetch(`/api/gallery/${invitationId}?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        setError('Gagal menghapus foto');
        return;
      }
      setError('');
      await loadGallery();
    } catch {
      setError('Gagal menghapus foto');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
        {photos.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
            <img src={url} alt={`Foto galeri ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => handleDelete(url)}
              aria-label="Hapus foto"
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
        
        {photos.length < 10 && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-2xl text-gray-400">+</span>
            )}
          </label>
        )}
      </div>
      
      <p className="text-xs text-gray-400">{photos.length}/10 foto</p>
    </div>
  );
}

export function MusicUploader({ invitationId, currentUrl, onUploaded }: MusicUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(currentUrl);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'music');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setAudioUrl(data.url);
        onUploaded(data.url);
      } else {
        setError(data.error || 'Gagal mengupload');
      }
    } catch {
      setError('Gagal mengupload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (!confirm('Hapus musik ini?')) return;
    setAudioUrl('');
    onUploaded('');
  };

  return (
    <div>
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          ❌ {error}
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <label className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm cursor-pointer transition-all">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? 'Uploading...' : '📁 Pilih File'}
        </label>

        {audioUrl && (
          <div className="flex items-center gap-3">
            <audio src={audioUrl} controls className="h-10" />
            <button
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Hapus
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-2">Format: MP3, OGG, WAV, M4A (max 10MB)</p>
    </div>
  );
}
