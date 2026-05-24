'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
}

const RESERVED = [
  'api', 'dashboard', 'login', 'register', 'logout', 'admin',
  'about', 'contact', 'pricing', 'terms', 'privacy', 'help',
  'static', '_next', 'favicon', 'robots', 'sitemap', 'www',
  'client', 'setup', 'invitation',
];

function validateSlug(slug: string): string {
  if (!slug) return '';
  if (slug.length < 3) return 'Minimal 3 karakter';
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug)) return 'Hanya huruf kecil, angka, dan tanda hubung (-)';
  if (RESERVED.includes(slug)) return 'Slug tidak tersedia';
  return '';
}

function generateSlug(name1: string, name2: string) {
  const clean = (s: string) =>
    s.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  return `${clean(name1)}-${clean(name2)}`.slice(0, 60);
}

export default function ClientNewInvitation() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partnerName2, setPartnerName2] = useState('');
  const [slug, setSlug] = useState('');
  const [slugError, setSlugError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categories = ['klasik', 'romantic', 'modern', 'natural', 'islami'];
  const categoryLabel: Record<string, string> = { klasik: 'Klasik', romantic: 'Romantis', modern: 'Modern', natural: 'Natural', islami: 'Islami' };
  const categoryEmoji: Record<string, string> = { klasik: '🏛️', romantic: '💕', modern: '✨', natural: '🌿', islami: '🕌' };

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(data.templates || []);
        if (data.templates?.length > 0) setSelectedTemplate(data.templates[0].id);
      });
  }, []);

  const handleNameChange = (field: '1' | '2', value: string) => {
    if (field === '1') setPartnerName(value);
    else setPartnerName2(value);
    const n1 = field === '1' ? value : partnerName;
    const n2 = field === '2' ? value : partnerName2;
    const newSlug = generateSlug(n1, n2);
    setSlug(newSlug);
    setSlugError(validateSlug(newSlug));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const err = validateSlug(slug);
    if (err) { setSlugError(err); return; }
    if (!partnerName || !partnerName2 || !selectedTemplate) {
      setError('Lengkapi semua data');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          partner_name: partnerName,
          partner_name2: partnerName2,
          template_id: selectedTemplate,
          slug,
          title: `Undangan ${partnerName} & ${partnerName2}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Gagal membuat'); return; }

      router.push(`/client/invitation/${data.invitation.id}/setup`);
    } catch { setError('Terjadi kesalahan'); }
    finally { setLoading(false); }
  };

  const groupedTemplates = categories.map(cat => ({
    category: cat,
    label: categoryLabel[cat],
    emoji: categoryEmoji[cat],
    items: templates.filter(t => t.category === cat),
  })).filter(g => g.items.length > 0);

  const slugOk = slug.length >= 3 && !slugError;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/client" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            ← Kembali ke Undangan Saya
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Buat Undangan Baru</h1>
        <p className="text-gray-500 mb-8">Isi nama pasangan dan pilih template untuk memulai</p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Nama Pasangan</h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasangan 1</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => handleNameChange('1', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  placeholder="Nama lengkap"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasangan 2</label>
                <input
                  type="text"
                  value={partnerName2}
                  onChange={(e) => handleNameChange('2', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  placeholder="Nama lengkap"
                  required
                />
              </div>

              {/* Slug preview */}
              {slug && (
                <div className={`flex items-center p-3 rounded-xl border ${
                  slugError ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                }`}>
                  <span className="text-sm font-mono text-gray-500 flex-1 truncate">
                    youthinvitation.com/{slug}
                  </span>
                  {slugError ? (
                    <span className="text-xs text-red-600">{slugError}</span>
                  ) : (
                    <span className="text-xs text-green-600">✓ Tersedia</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Template */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Pilih Template</h2>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedTemplate === t.id
                      ? 'border-amber-400 bg-amber-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-lg mb-1">{categoryEmoji[t.category]}</div>
                  <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{categoryLabel[t.category]}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!slugError || !partnerName || !partnerName2}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/25"
          >
            {loading ? 'Membuat...' : 'Buat Undangan'}
          </button>
        </form>
      </div>
    </div>
  );
}
