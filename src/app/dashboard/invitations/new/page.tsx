'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
];

function validateSlug(slug: string): string {
  if (!slug) return '';
  if (slug.length < 3) return 'Minimal 3 karakter';
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug)) return 'Hanya huruf kecil, angka, dan tanda hubung (-)';
  if (RESERVED.includes(slug.split('-')[0])) return 'Slug tidak tersedia';
  return '';
}

export default function NewInvitationPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partnerName2, setPartnerName2] = useState('');
  const [slug, setSlug] = useState('');
  const [slugError, setSlugError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(data.templates || []);
        if (data.templates?.length > 0) {
          setSelectedTemplate(data.templates[0].id);
        }
      });
  }, []);

  const generateSlug = (name1: string, name2: string) => {
    const clean = (s: string) =>
      s.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    const s = `${clean(name1)}-${clean(name2)}`.slice(0, 60);
    return s;
  };

  const handleNameChange = (field: 'partner1' | 'partner2', value: string) => {
    if (field === 'partner1') setPartnerName(value);
    else setPartnerName2(value);
    const n1 = field === 'partner1' ? value : partnerName;
    const n2 = field === 'partner2' ? value : partnerName2;
    const newSlug = generateSlug(n1, n2);
    setSlug(newSlug);
    setSlugError(validateSlug(newSlug));
  };

  const handleSlugChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(cleaned);
    setSlugError(validateSlug(cleaned));
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        body: JSON.stringify({
          partner_name: partnerName,
          partner_name2: partnerName2,
          template_id: selectedTemplate,
          slug,
          title: `Undangan Pernikahan ${partnerName} & ${partnerName2}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal membuat undangan');
        return;
      }

      router.push(`/dashboard/invitations/${data.invitation.id}`);
    } catch {
      setError('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const categoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      klasik: 'Klasik', romantic: 'Romantis', modern: 'Modern', natural: 'Natural', islami: 'Islami',
    };
    return labels[cat] || cat;
  };

  const categoryEmoji = (cat: string) => {
    const emojis: Record<string, string> = {
      klasik: '🏛️', romantic: '💕', modern: '✨', natural: '🌿', islami: '🕌',
    };
    return emojis[cat] || '💌';
  };

  const slugOk = slug.length >= 3 && !slugError;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Buat Undangan Baru</h1>
      <p className="text-gray-500 mb-8">Lengkapi data untuk memulai</p>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Pasangan */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Data Pasangan</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasangan 1</label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => handleNameChange('partner1', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                placeholder="Nama Anda"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasangan 2</label>
              <input
                type="text"
                value={partnerName2}
                onChange={(e) => handleNameChange('partner2', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                placeholder="Nama Pasangan"
                required
              />
            </div>

            {/* Slug input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Undangan</label>
              <div className={`flex items-center bg-gray-50 rounded-xl border transition-all ${
                slugError ? 'border-red-400' : slugOk ? 'border-green-400' : 'border-gray-200'
              }`}>
                <span className="pl-4 text-gray-400 text-sm whitespace-nowrap">
                  {typeof window !== 'undefined' ? window.location.host : 'youthinvitation.com'}/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="flex-1 px-2 py-3 bg-transparent focus:outline-none font-mono text-sm"
                  placeholder="nama1-nama2"
                  required
                />
                {slugOk && (
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="pr-4 text-xs text-amber-600 hover:text-amber-700 font-medium"
                  >
                    {copied ? '✓ Disalin' : 'Salin'}
                  </button>
                )}
              </div>
              {slugError && (
                <p className="text-red-500 text-xs mt-1">{slugError}</p>
              )}
              {slugOk && (
                <p className="text-green-600 text-xs mt-1">
                  ✓ Link tersedia — {typeof window !== 'undefined' ? window.location.origin : 'https://youthinvitation.com'}/{slug}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pilih Template */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Pilih Template</h2>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTemplate(t.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedTemplate === t.id
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-lg mb-1">{categoryEmoji(t.category)}</div>
                <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{categoryLabel(t.category)}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !!slugError}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/25"
        >
          {loading ? 'Membuat...' : 'Buat Undangan'}
        </button>
      </form>
    </div>
  );
}
