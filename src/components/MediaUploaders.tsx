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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadGallery();
  }, [invitationId]);

  const loadGallery = async () => {
    try {
      const res = await fetch(`/api/gallery/${invitationId}`);
      const data = await res.json();
      setPhotos(data.photos || []);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 10) {
      alert('Maksimal 10 foto');
      return;
    }

    setUploading(true);
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
        }
      }
      await loadGallery();
    } catch {
      alert('Gagal mengupload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm('Hapus foto ini?')) return;
    
    await fetch(`/api/gallery/${invitationId}?url=${encodeURIComponent(url)}`, {
      method: 'DELETE',
    });
    await loadGallery();
  };

  if (loading) {
    return <div className="text-gray-400 text-sm">Memuat galeri...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-5 gap-3 mb-4">
        {photos.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => handleDelete(url)}
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
        alert(data.error || 'Gagal mengupload');
      }
    } catch {
      alert('Gagal mengupload');
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
      <div className="flex items-center gap-4">
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
