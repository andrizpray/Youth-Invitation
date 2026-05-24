'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Invitation {
  id: string;
  slug: string;
  partner_name: string;
  partner_name2: string;
  date_akad: string | null;
  date_resepsi: string | null;
  location: string;
  status: string;
  published: number;
  created_at: string;
}

export default function ClientDashboard() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/invitations', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat');
        return res.json();
      })
      .then(data => setInvitations(data.invitations || []))
      .catch(() => setError('Gagal memuat undangan. Pastikan Anda sudah login.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            💌 Youth Invitation
          </Link>
          <button
            onClick={() => { fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then(() => router.push('/login')); }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Undangan Saya</h1>
            <p className="text-gray-500 text-sm mt-1">
              {invitations.length === 0
                ? 'Belum ada undangan'
                : `${invitations.length} undangan`}
            </p>
          </div>
          <Link
            href="/client/invitation/new"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber-500/25"
          >
            + Buat Baru
          </Link>
        </div>

        {invitations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <div className="text-6xl mb-4">💌</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Selamat Datang!</h2>
            <p className="text-gray-500 mb-6">Mulai buat undangan pernikahan digitalmu sekarang</p>
            <Link
              href="/client/invitation/new"
              className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/25"
            >
              Buat Undangan
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((inv) => {
              const isComplete = inv.partner_name && inv.status !== 'draft';
              return (
                <div key={inv.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {inv.partner_name || 'Undangan Baru'} {inv.partner_name2 ? `& ${inv.partner_name2}` : ''}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          inv.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {inv.published ? 'Terbit' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Dibuat {new Date(inv.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <Link
                      href={`/client/invitation/${inv.id}/setup`}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-all shrink-0"
                    >
                      {inv.partner_name ? 'Lanjutkan' : 'Isi Data'}
                    </Link>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex gap-1">
                      {[
                        inv.partner_name && inv.partner_name2,
                        inv.date_akad || inv.date_resepsi,
                        inv.location,
                        inv.published,
                      ].map((step, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1.5 rounded-full ${
                            step ? 'bg-green-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                      <span>Data</span>
                      <span>Tanggal</span>
                      <span>Lokasi</span>
                      <span>Terbit</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
