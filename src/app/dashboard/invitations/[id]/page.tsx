'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MediaUploader, MusicUploader } from '@/components/MediaUploaders';

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
}

interface Invitation {
  id: string;
  slug: string;
  title: string;
  template_id: string;
  package_type: string;
  partner_name: string;
  partner_name2: string;
  date_akad: string;
  date_resepsi: string;
  time_akad: string;
  time_resepsi: string;
  location: string;
  address: string;
  maps_url: string;
  music_url: string;
  colors: string;
  font_family: string;
  layout_style: string;
  published: number;
  status: string;
  event_date: string;
  language: string;
  total_guests: number;
  total_attending: number;
}

const inputCls = 'w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-150';
const sectionCls = 'bg-white rounded-2xl p-6 border border-slate-100 shadow-sm';

const CategoryIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default function EditInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('content');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateSaving, setTemplateSaving] = useState(false);
  const [templateSaved, setTemplateSaved] = useState(false);
  const [templateError, setTemplateError] = useState('');
  const templateSavedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => {
    clearTimeout(templateSavedTimerRef.current);
    clearTimeout(savedTimerRef.current);
  }, []);

  const [form, setForm] = useState({
    partner_name: '',
    partner_name2: '',
    date_akad: '',
    date_resepsi: '',
    time_akad: '',
    time_resepsi: '',
    location: '',
    address: '',
    maps_url: '',
    music_url: '',
    colors: '{"primary":"#d4af37","secondary":"#ffffff","accent":"#1a1a2e"}',
  });

  useEffect(() => {
    fetch(`/api/invitations/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setInvitation(data);
        setForm({
          partner_name: data.partner_name || '',
          partner_name2: data.partner_name2 || '',
          date_akad: data.date_akad || '',
          date_resepsi: data.date_resepsi || '',
          time_akad: data.time_akad || '',
          time_resepsi: data.time_resepsi || '',
          location: data.location || '',
          address: data.address || '',
          maps_url: data.maps_url || '',
          music_url: data.music_url || '',
          colors: data.colors || '{"primary":"#d4af37","secondary":"#ffffff","accent":"#1a1a2e"}',
        });
      })
      .finally(() => setLoading(false));

    fetch('/api/templates')
      .then(res => res.json())
      .then(data => setTemplates(data.templates || []));
  }, [params.id]);

  const handleTemplateChange = async (templateId: string) => {
    if (!invitation) return;
    setTemplateSaving(true);
    setTemplateSaved(false);
    setTemplateError('');
    try {
      const res = await fetch(`/api/invitations/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: templateId }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInvitation(prev => prev ? { ...prev, ...updated.invitation } : prev);
        setTemplateSaved(true);
        clearTimeout(templateSavedTimerRef.current);
        templateSavedTimerRef.current = setTimeout(() => setTemplateSaved(false), 3000);
      } else {
        const err = await res.json();
        setTemplateError(err.error || 'Gagal mengganti template');
      }
    } catch {
      setTemplateError('Terjadi kesalahan koneksi');
    } finally {
      setTemplateSaving(false);
    }
  };

  const [saveError, setSaveError] = useState('');
  const [showPublishError, setShowPublishError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError('');
    try {
      const res = await fetch(`/api/invitations/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setInvitation(prev => prev ? { ...prev, ...updated.invitation } : prev);
        setSaved(true);
        clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setSaved(false), 3000);
      } else {
        const err = await res.json();
        setSaveError(err.error || 'Gagal menyimpan');
      }
    } catch {
      setSaveError('Terjadi kesalahan koneksi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!invitation) {
    return <div className="text-center py-20 text-slate-500">Undangan tidak ditemukan</div>;
  }

  const tabs = [
    { id: 'content', label: 'Konten' },
    { id: 'template', label: 'Template' },
    { id: 'design', label: 'Tampilan' },
    { id: 'media', label: 'Media' },
    { id: 'guests', label: 'Tamu' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'publish', label: 'Publikasi' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {invitation.partner_name} &amp; {invitation.partner_name2}
          </h1>
          <p className="text-sm text-slate-500">
            youthinvitation.com/{invitation.slug}
            {invitation.published ? (
              <a href={`/${invitation.slug}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline ml-2">
                Lihat &rarr;
              </a>
            ) : null}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
          } disabled:opacity-60`}
        >
          {saving ? 'Menyimpan...' : saved ? 'Tersimpan' : 'Simpan'}
        </button>
      </div>

      {saveError && (
        <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {saveError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl overflow-x-auto whitespace-nowrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {tab === 'content' && (
        <div className={`${sectionCls} space-y-6`}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pasangan 1</label>
              <input type="text" value={form.partner_name} onChange={(e) => setForm({ ...form, partner_name: e.target.value })} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pasangan 2</label>
              <input type="text" value={form.partner_name2} onChange={(e) => setForm({ ...form, partner_name2: e.target.value })} required className={inputCls} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Akad Nikah</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                <input type="date" value={form.date_akad} onChange={(e) => setForm({ ...form, date_akad: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Waktu</label>
                <input type="time" value={form.time_akad} onChange={(e) => setForm({ ...form, time_akad: e.target.value })} className={inputCls} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Resepsi</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                <input type="date" value={form.date_resepsi} onChange={(e) => setForm({ ...form, date_resepsi: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Waktu</label>
                <input type="time" value={form.time_resepsi} onChange={(e) => setForm({ ...form, time_resepsi: e.target.value })} className={inputCls} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Lokasi</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lokasi</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} placeholder="Contoh: Hotel Grand Ballroom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link Google Maps</label>
                <input type="url" value={form.maps_url} onChange={(e) => setForm({ ...form, maps_url: e.target.value })} className={inputCls} placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Musik Latar</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL Musik (MP3/OGG)</label>
              <input type="url" value={form.music_url} onChange={(e) => setForm({ ...form, music_url: e.target.value })} className={inputCls} placeholder="https://example.com/lagu.mp3" />
            </div>
          </div>
        </div>
      )}

      {/* Template Tab */}
      {tab === 'template' && (
        <div className={`${sectionCls} space-y-4`}>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Ganti Template</h3>
            <p className="text-sm text-slate-500 mb-4">Pilih template baru untuk undangan ini. Perubahan langsung tersimpan.</p>
          </div>

          {templateError && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{templateError}</div>
          )}
          {templateSaved && (
            <div role="status" className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">Template berhasil diubah</div>
          )}
          {templateSaving && (
            <div className="p-3 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl">Menyimpan template...</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {templates.map((t) => {
              const isActive = invitation.template_id === t.id;
              const categoryLabel: Record<string, string> = {
                klasik: 'Klasik', romantic: 'Romantis', modern: 'Modern', natural: 'Natural', islami: 'Islami',
              };
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={templateSaving}
                  onClick={() => handleTemplateChange(t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                    isActive ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300 disabled:opacity-50'
                  }`}
                >
                  <div className="text-green-500 mb-2">
                    <CategoryIcon />
                  </div>
                  <p className="font-medium text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{categoryLabel[t.category] || t.category}</p>
                  {isActive && <p className="text-xs text-green-600 font-medium mt-1">Aktif</p>}
                </button>
              );
            })}
          </div>

          {templates.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-6">Memuat template...</p>
          )}
        </div>
      )}

      {/* Design Tab */}
      {tab === 'design' && (
        <div className={`${sectionCls} space-y-6`}>
          <ColorPicker label="Warna Utama" keyName="primary" colors={form.colors} onChange={(c) => setForm({ ...form, colors: c })} />
          <ColorPicker label="Warna Latar" keyName="secondary" colors={form.colors} onChange={(c) => setForm({ ...form, colors: c })} />
          <ColorPicker label="Warna Aksen" keyName="accent" colors={form.colors} onChange={(c) => setForm({ ...form, colors: c })} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Font</label>
            <select
              value={invitation.font_family}
              onChange={(e) => setInvitation({ ...invitation, font_family: e.target.value })}
              className={inputCls}
            >
              <option value="serif">Cormorant Infant (Serif)</option>
              <option value="sans">Inter (Sans-serif)</option>
              <option value="cursive">Great Vibes (Cursive)</option>
            </select>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {tab === 'media' && (
        <div className={`${sectionCls} space-y-6`}>
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Galeri Foto</h3>
            <p className="text-slate-500 text-sm mb-4">Upload maksimal 10 foto untuk galeri undangan</p>
            <MediaUploader invitationId={invitation.id} type="photo" />
          </div>
          <hr className="border-slate-100" />
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Musik Latar</h3>
            <p className="text-slate-500 text-sm mb-4">Upload file musik (MP3, OGG, WAV - max 10MB)</p>
            <MusicUploader invitationId={invitation.id} currentUrl={form.music_url} onUploaded={(url) => setForm({ ...form, music_url: url })} />
          </div>
        </div>
      )}

      {/* Guests Tab */}
      {tab === 'guests' && (
        <div className={sectionCls}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Manajemen Tamu</h3>
            <a
              href={`/dashboard/invitations/${invitation.id}/guests`}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition-all duration-150"
            >
              Kelola Tamu &rarr;
            </a>
          </div>
          <p className="text-slate-500 text-sm">Tambahkan daftar tamu, upload CSV, atau salin link personal untuk setiap tamu.</p>
          {invitation.total_guests > 0 && (
            <p className="mt-4 text-slate-700 bg-slate-50 px-4 py-3 rounded-xl text-sm">
              {invitation.total_guests} tamu terdaftar
            </p>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {tab === 'analytics' && (
        <div className={sectionCls}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Statistik &amp; Analytics</h3>
            <a
              href={`/dashboard/invitations/${invitation.id}/analytics`}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition-all duration-150"
            >
              Lihat Detail &rarr;
            </a>
          </div>
          <p className="text-slate-500 text-sm mb-4">Pantau tingkat kehadiran, grafik RSVP, dan data statistik tamu.</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{invitation.total_guests}</p>
              <p className="text-xs text-slate-500">Total Tamu</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{invitation.total_attending}</p>
              <p className="text-xs text-slate-500">Hadir</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-700">
                {invitation.total_guests > 0
                  ? Math.round((invitation.total_attending / invitation.total_guests) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-slate-500">Kehadiran</p>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Tab */}
      {tab === 'rsvp' && (
        <div className={sectionCls}>
          <h3 className="font-semibold text-slate-900 mb-4">
            Daftar Tamu ({invitation.total_guests} RSVP)
          </h3>
          <p className="text-slate-500 text-sm">Data RSVP akan muncul di sini saat tamu mulai mengisi konfirmasi.</p>
          {invitation.total_guests > 0 && (
            <p className="mt-4 text-green-700 bg-green-50 px-4 py-3 rounded-xl text-sm">
              {invitation.total_attending} tamu konfirmasi hadir
            </p>
          )}
        </div>
      )}

      {/* Publish Tab */}
      {tab === 'publish' && (
        <div className={`${sectionCls} space-y-6`}>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Status Undangan</h3>
            <p className="text-sm text-slate-500 mb-4">
              {invitation.published
                ? 'Undangan sudah dipublikasikan dan dapat diakses tamu.'
                : 'Undangan masih draft. Publikasikan agar bisa diakses tamu.'}
            </p>
            <p className="text-sm text-slate-500">
              Link: <code className="bg-slate-100 px-2 py-1 rounded text-green-700 font-mono">youthinvitation.com/{invitation.slug}</code>
            </p>
          </div>

          {showPublishError && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {showPublishError}
            </div>
          )}

          {!invitation.published && (
            <button
              onClick={async () => {
                setShowPublishError('');
                try {
                  const res = await fetch(`/api/invitations/${params.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ published: 1, status: 'active' }),
                  });
                  if (!res.ok) {
                    const err = await res.json();
                    setShowPublishError(err.error || 'Gagal mempublikasikan');
                    return;
                  }
                  router.refresh();
                } catch {
                  setShowPublishError('Terjadi kesalahan koneksi');
                }
              }}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-150"
            >
              Publikasikan Sekarang
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ColorPicker({
  label,
  keyName,
  colors,
  onChange,
}: {
  label: string;
  keyName: string;
  colors: string;
  onChange: (c: string) => void;
}) {
  const parsed = JSON.parse(colors);
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={parsed[keyName]}
          onChange={(e) => {
            const updated = { ...parsed, [keyName]: e.target.value };
            onChange(JSON.stringify(updated));
          }}
          className="w-12 h-12 rounded-xl border border-slate-200"
          aria-label={label}
        />
        <input
          type="text"
          value={parsed[keyName]}
          onChange={(e) => {
            const updated = { ...parsed, [keyName]: e.target.value };
            onChange(JSON.stringify(updated));
          }}
          className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-150 font-mono"
        />
      </div>
    </div>
  );
}
