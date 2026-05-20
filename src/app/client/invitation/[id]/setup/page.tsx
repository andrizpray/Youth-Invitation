'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// ============= TYPES =============
interface InvitationData {
  id: string;
  slug: string;
  partner_name: string;
  partner_name2: string;
  parent_name: string;
  parent_name2: string;
  date_akad: string | null;
  date_resepsi: string | null;
  time_akad: string | null;
  time_resepsi: string | null;
  location: string;
  address: string;
  maps_url: string | null;
  quote: string;
  story: string;
  gallery_photos: string;
  music_url: string | null;
  published: number;
}

// ============= STEP DEFINITIONS =============
const STEPS = [
  { id: 1, label: 'Data Pasangan' },
  { id: 2, label: 'Tanggal & Lokasi' },
  { id: 3, label: 'Media' },
  { id: 4, label: 'Terbitkan' },
];

// ============= MAIN COMPONENT =============
export default function ClientSetupWizard() {
  const params = useParams();
  const router = useRouter();
  const invitationId = params.id as string;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [form, setForm] = useState({
    partner_name: '',
    partner_name2: '',
    parent_name: '',
    parent_name2: '',
    quote: '',
    date_akad: '',
    date_resepsi: '',
    time_akad: '',
    time_resepsi: '',
    location: '',
    address: '',
    maps_url: '',
    story: '',
    music_url: '',
  });

  const [published, setPublished] = useState(false);
  const [slug, setSlug] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // Load existing data
  useEffect(() => {
    fetch(`/api/invitations/${invitationId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Not found');
        const data: InvitationData = await res.json();
        setForm({
          partner_name: data.partner_name || '',
          partner_name2: data.partner_name2 || '',
          parent_name: data.parent_name || '',
          parent_name2: data.parent_name2 || '',
          quote: data.quote || '',
          date_akad: data.date_akad || '',
          date_resepsi: data.date_resepsi || '',
          time_akad: data.time_akad || '',
          time_resepsi: data.time_resepsi || '',
          location: data.location || '',
          address: data.address || '',
          maps_url: data.maps_url || '',
          story: data.story || '',
          music_url: data.music_url || '',
        });
        setPublished(data.published === 1);
        setSlug(data.slug);
        try { setPhotos(JSON.parse(data.gallery_photos || '[]')); } catch { setPhotos([]); }
      })
      .catch(() => setError('Undangan tidak ditemukan'))
      .finally(() => setLoading(false));
  }, [invitationId]);

  // Auto-save on step change
  const saveData = async (data: Partial<typeof form>) => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch { setError('Gagal menyimpan data. Silakan coba lagi.'); }
    finally { setSaving(false); }
  };

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    // Validate step 1
    if (step === 1) {
      if (!form.partner_name.trim() || !form.partner_name2.trim()) {
        setError('Nama pasangan harus diisi');
        return;
      }
    }
    // Validate step 2
    if (step === 2) {
      if (!form.date_akad && !form.date_resepsi) {
        setError('Setidaknya tanggal akad atau resepsi harus diisi');
        return;
      }
      if (!form.location.trim()) {
        setError('Nama lokasi harus diisi');
        return;
      }
    }
    setError('');
    await saveData(form);
    setStep(prev => Math.min(prev + 1, 4));
  };

  // === PHOTO UPLOAD ===
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (photos.length + files.length > 10) {
      setPhotoError('Maksimal 10 foto');
      return;
    }
    setUploading(true);
    setPhotoError('');
    try {
      const newPhotos = [...photos];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', 'photo');
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success && data.url) {
          newPhotos.push(data.url);
          // Add to gallery
          await fetch(`/api/gallery/${invitationId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: data.url }),
          });
        }
      }
      setPhotos(newPhotos);
    } catch { setPhotoError('Gagal mengupload'); }
    finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async (url: string) => {
    try {
      await fetch(`/api/gallery/${invitationId}?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
      setPhotos(prev => prev.filter(p => p !== url));
    } catch { setPhotoError('Gagal menghapus'); }
  };

  // === MUSIC UPLOAD ===
  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'music');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        updateForm('music_url', data.url);
        await saveData({ music_url: data.url });
      }
    } catch { setPhotoError('Gagal mengupload musik'); }
  };

  const handleRemoveMusic = async () => {
    updateForm('music_url', '');
    await saveData({ music_url: '' });
  };

  // === PUBLISH ===
  const handlePublish = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: 1, status: 'active' }),
      });
      if (res.ok) {
        setPublished(true);
        setSaved(true);
      }
    } catch { setError('Gagal menerbitkan'); }
    finally { setSaving(false); }
  };

  // ========== RENDER ==========
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !form.partner_name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  const colors = { primary: '#d4af37', secondary: '#ffffff', accent: '#1a1a2e' };
  const previewUrl = slug ? `/${slug}` : '#';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/client" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            ← Kembali
          </Link>
          <div className="flex items-center gap-3">
            {saving && <span className="text-xs text-gray-400">Menyimpan...</span>}
            {saved && <span className="text-xs text-green-600">✓ Tersimpan</span>}
          </div>
        </div>

        {/* Step indicator */}
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center">
                <div className={`flex items-center gap-2 ${
                  step === s.id ? 'text-amber-600' : step > s.id ? 'text-green-600' : 'text-gray-300'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s.id ? 'bg-amber-100 text-amber-700' :
                    step > s.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.id ? '✓' : s.id}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${
                    step > s.id ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            ❌ {error}
          </div>
        )}

        {/* ==================== STEP 1: DATA PASANGAN ==================== */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Data Pasangan</h2>
              <p className="text-sm text-gray-500 mb-6">Masukkan nama kedua mempelai</p>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasangan (Pria)</label>
                  <input
                    type="text"
                    value={form.partner_name}
                    onChange={(e) => updateForm('partner_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    placeholder="Nama lengkap"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasangan (Wanita)</label>
                  <input
                    type="text"
                    value={form.partner_name2}
                    onChange={(e) => updateForm('partner_name2', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    placeholder="Nama lengkap"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Orang Tua</h2>
              <p className="text-sm text-gray-500 mb-6">Nama orang tua (akan tampil di undangan)</p>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ayah Pasangan (Pria)</label>
                  <input
                    type="text"
                    value={form.parent_name}
                    onChange={(e) => updateForm('parent_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    placeholder="Contoh: Bpk. Ahmad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ayah Pasangan (Wanita)</label>
                  <input
                    type="text"
                    value={form.parent_name2}
                    onChange={(e) => updateForm('parent_name2', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    placeholder="Contoh: Bpk. Bambang"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kata Pembuka</label>
                  <textarea
                    value={form.quote}
                    onChange={(e) => updateForm('quote', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                    placeholder='Contoh: "Dan di antara tanda-tanda kekuasaan-Nya..."'
                    rows={2}
                  />
                  <p className="text-xs text-gray-400 mt-1">Opsional. Akan tampil di halaman cover undangan.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 2: TANGGAL & LOKASI ==================== */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Akad Nikah</h2>
              <p className="text-sm text-gray-500 mb-6">Tanggal dan waktu akad</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={form.date_akad}
                    onChange={(e) => updateForm('date_akad', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam</label>
                  <input
                    type="time"
                    value={form.time_akad}
                    onChange={(e) => updateForm('time_akad', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Resepsi</h2>
              <p className="text-sm text-gray-500 mb-6">Tanggal dan waktu resepsi (bisa sama dengan akad)</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={form.date_resepsi}
                    onChange={(e) => updateForm('date_resepsi', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam</label>
                  <input
                    type="time"
                    value={form.time_resepsi}
                    onChange={(e) => updateForm('time_resepsi', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Lokasi</h2>
              <p className="text-sm text-gray-500 mb-6">Tempat acara dilangsungkan</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Gedung / Tempat</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateForm('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    placeholder="Contoh: Gedung Serbaguna"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                    placeholder="Jl. Merdeka No. 1, Jakarta"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps</label>
                  <input
                    type="url"
                    value={form.maps_url}
                    onChange={(e) => updateForm('maps_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    placeholder="https://maps.app.goo.gl/..."
                  />
                  <p className="text-xs text-gray-400 mt-1">Opsional. Tamu bisa lihat lokasi di Google Maps.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Kisah Kami</h2>
              <p className="text-sm text-gray-500 mb-6">Cerita singkat perjalanan cinta (opsional)</p>
              <textarea
                value={form.story}
                onChange={(e) => updateForm('story', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                placeholder="Tuliskan kisah cinta kalian..."
                rows={4}
              />
            </div>
          </div>
        )}

        {/* ==================== STEP 3: MEDIA ==================== */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Galeri Foto</h2>
              <p className="text-sm text-gray-500 mb-4">Upload foto prewedding atau momen spesial (maks 10 foto)</p>

              {photoError && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  ❌ {photoError}
                </div>
              )}

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                {photos.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemovePhoto(url)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {photos.length < 10 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors bg-gray-50">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
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
              <p className="text-xs text-gray-400">{photos.length}/10 foto • Format: JPEG, PNG, WebP</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Musik Latar</h2>
              <p className="text-sm text-gray-500 mb-4">Musik yang akan diputar saat tamu membuka undangan</p>

              <div className="flex items-center gap-4 flex-wrap">
                <label className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm cursor-pointer transition-all">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleMusicUpload}
                    className="hidden"
                  />
                  📁 Pilih File Musik
                </label>

                {form.music_url && (
                  <div className="flex items-center gap-3">
                    <audio src={form.music_url} controls className="h-10" />
                    <button onClick={handleRemoveMusic} className="text-red-500 hover:text-red-700 text-sm">
                      Hapus
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">Format: MP3, OGG, WAV, M4A (max 10MB)</p>
            </div>
          </div>
        )}

        {/* ==================== STEP 4: TERBITKAN ==================== */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Ringkasan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Ringkasan Undangan</h2>
              <p className="text-sm text-gray-500 mb-6">Pastikan semua data sudah benar</p>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Pasangan</span>
                  <span className="text-sm font-medium text-gray-900">{form.partner_name} & {form.partner_name2}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Tanggal Akad</span>
                  <span className="text-sm font-medium text-gray-900">
                    {form.date_akad ? new Date(form.date_akad).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Lokasi</span>
                  <span className="text-sm font-medium text-gray-900">{form.location || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Foto Galeri</span>
                  <span className="text-sm font-medium text-gray-900">{photos.length} foto</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Musik</span>
                  <span className="text-sm font-medium text-gray-900">{form.music_url ? '✓ Ada' : '-'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`text-sm font-medium ${published ? 'text-green-600' : 'text-yellow-600'}`}>
                    {published ? '✓ Sudah Terbit' : '⏳ Draft'}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Pratinjau</h2>
              <p className="text-sm text-gray-500 mb-4">Lihat tampilan undanganmu</p>
              {slug ? (
                <a
                  href={`/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium text-sm transition-all"
                >
                  👁️ Lihat Undangan
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gray-300 text-gray-500 rounded-xl font-medium text-sm cursor-not-allowed"
                >
                  👁️ Lihat Undangan
                </button>
              )}
            </div>

            {/* Publish */}
            {!published && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Terbitkan Undangan</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Setelah diterbitkan, undangan bisa diakses tamu melalui link di bawah ini
                </p>
                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500 font-mono truncate flex-1">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/{slug}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    }}
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium shrink-0"
                  >
                    Salin
                  </button>
                </div>
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl font-semibold text-sm transition-all"
                >
                  {saving ? 'Menerbitkan...' : '🚀 Terbitkan Sekarang'}
                </button>
              </div>
            )}

            {/* Published state */}
            {published && (
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-lg font-semibold text-green-800 mb-2">Undangan Sudah Terbit!</h2>
                <p className="text-green-600 text-sm mb-4">Bagikan link ini ke tamu undanganmu</p>
                <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-green-200">
                  <span className="text-sm font-mono truncate flex-1">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/{slug}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    }}
                    className="text-xs text-green-600 hover:text-green-700 font-medium shrink-0"
                  >
                    {saved ? '✓ Disalin' : 'Salin Link'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== NAVIGATION BUTTONS ==================== */}
        <div className="flex items-center justify-between mt-8 pb-12">
          <button
            onClick={() => { setError(''); setStep(prev => Math.max(prev - 1, 1)); }}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              step > 1
                ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                : 'invisible'
            }`}
          >
            ← Sebelumnya
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => saveData(form)}
              disabled={saving}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all"
            >
              Simpan Draft
            </button>

            {step < 4 && (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber-500/25"
              >
                Simpan & Lanjut →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
