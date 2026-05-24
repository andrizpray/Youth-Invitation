'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface Invitation {
  id: string;
  slug: string;
  title: string;
  partner_name: string;
  partner_name2: string;
  status: string;
  package_type: string;
  published: number;
  total_guests: number;
  created_at: string;
}

const IconError = () => (
  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  const loadInvitations = () => {
    fetch('/api/invitations', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setInvitations(data.invitations || []))
      .catch(() => setActionError('Gagal memuat daftar undangan'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadInvitations(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus undangan ini?')) return;
    try {
      const res = await fetch(`/api/invitations/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        setActionError(err.error || 'Gagal menghapus');
        return;
      }
      loadInvitations();
    } catch {
      setActionError('Gagal menghapus undangan');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: 1, status: 'active' }),
      });
      if (!res.ok) {
        const err = await res.json();
        setActionError(err.error || 'Gagal mempublikasikan');
        return;
      }
      loadInvitations();
    } catch {
      setActionError('Gagal mempublikasikan undangan');
    }
  };

  const handleCopy = (slug: string, id: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const getStatusBadge = (inv: Invitation) => {
    if (inv.status === 'active') {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Aktif</span>;
    }
    if (inv.published === 0) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Draft</span>;
    }
    return <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">{inv.status}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Undangan</h1>
          <p className="text-slate-500 text-sm">Kelola semua undanganmu</p>
        </div>
        <Link
          href="/dashboard/invitations/new"
          className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-all duration-150 shadow-lg shadow-green-500/25"
        >
          + Buat Baru
        </Link>
      </div>

      {actionError && (
        <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2">
          <IconError />
          {actionError}
        </div>
      )}

      {invitations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-100 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Belum Ada Undangan</h2>
          <p className="text-slate-500 mb-6">Mulai buat undangan digital pertamamu!</p>
          <Link
            href="/dashboard/invitations/new"
            className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-150"
          >
            Buat Undangan
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {invitations.map((inv) => (
            <div key={inv.id} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-all duration-150">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {inv.partner_name} &amp; {inv.partner_name2}
                    </h3>
                    {getStatusBadge(inv)}
                    <span className="text-xs text-slate-400 uppercase">{inv.package_type}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-slate-400 font-mono truncate">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/{inv.slug}
                    </span>
                    <button
                      onClick={() => handleCopy(inv.slug, inv.id)}
                      className="text-xs text-green-600 hover:text-green-700 font-medium shrink-0 transition-colors duration-150"
                    >
                      {copiedId === inv.id ? 'Disalin' : 'Salin'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">
                    {inv.total_guests} RSVP
                    <span className="mx-2">·</span>
                    {new Date(inv.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                  <a
                    href={`/${inv.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs rounded-lg transition-all duration-150"
                  >
                    Lihat
                  </a>
                  {!inv.published && (
                    <button
                      onClick={() => handlePublish(inv.id)}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-all duration-150"
                    >
                      Publish
                    </button>
                  )}
                  <Link
                    href={`/dashboard/invitations/${inv.id}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition-all duration-150"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs rounded-lg transition-all duration-150"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
