'use client';

import { useEffect, useRef, useState } from 'react';
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

const categoryLabel = (cat: string) => {
  const labels: Record<string, string> = {
    klasik: 'Klasik', romantic: 'Romantis', modern: 'Modern', natural: 'Natural', islami: 'Islami',
  };
  return labels[cat] || cat;
};

// Simple SVG template category icons
const CategoryIcon = ({ cat }: { cat: string }) => {
  if (cat === 'islami') {
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
};

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
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);
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
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return `${clean(name1)}-${clean(name2)}`.slice(0, 60);
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
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
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

  const slugOk = slug.length >= 3 && !slugError;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Buat Undangan Baru</h1>
      <p className="text-slate-500 mb-8">Lengkapi data untuk memulai</p>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Pasangan */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Data Pasangan</h2>
          <div className="grid gap-4">
            <div>
              <label htmlFor="partner1" className="block text-sm font-medium text-slate-700 mb-1">
                Nama Pasangan 1
              </label>
              <input
                id="partner1"
                type="text"
                value={partnerName}
                onChange={(e) => handleNameChange('partner1', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-150"
                placeholder="Nama Anda"
                required
              />
            </div>
            <div>
              <label htmlFor="partner2" className="block text-sm font-medium text-slate-700 mb-1">
                Nama Pasangan 2
              </label>
              <input
                id="partner2"
                type="text"
                value={partnerName2}
                onChange={(e) => handleNameChange('partner2', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-150"
                placeholder="Nama Pasangan"
                required
              />
            </div>

            {/* Slug input */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">
                Link Undangan
              </label>
              <div className={`flex items-center bg-slate-50 rounded-xl border transition-all duration-150 ${
                slugError ? 'border-red-400' : slugOk ? 'border-green-400' : 'border-slate-200'
              }`}>
                <span className="pl-4 text-slate-400 text-sm whitespace-nowrap">
                  {typeof window !== 'undefined' ? window.location.host : 'youthinvitation.com'}/
                </span>
                <input
                  id="slug"
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
                    className="pr-4 text-xs text-green-600 hover:text-green-700 font-medium transition-colors duration-150"
                  >
                    {copied ? 'Disalin' : 'Salin'}
                  </button>
                )}
              </div>
              {slugError && (
                <p className="text-red-500 text-xs mt-1">{slugError}</p>
              )}
              {slugOk && (
                <p className="text-green-600 text-xs mt-1">
                  Link tersedia — {typeof window !== 'undefined' ? window.location.origin : 'https://youthinvitation.com'}/{slug}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pilih Template */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Pilih Template</h2>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTemplate(t.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                  selectedTemplate === t.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-green-500 mb-2">
                  <CategoryIcon cat={t.category} />
                </div>
                <p className="font-medium text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-400">{categoryLabel(t.category)}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !!slugError}
          className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl font-semibold transition-all duration-150 shadow-lg shadow-green-500/25"
        >
          {loading ? 'Membuat...' : 'Buat Undangan'}
        </button>
      </form>
    </div>
  );
}
