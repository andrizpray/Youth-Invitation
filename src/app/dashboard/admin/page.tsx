'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Stats {
  totalUsers: number;
  totalInvitations: number;
  totalPublished: number;
  totalTemplates: number;
  totalActiveTemplates: number;
}

const IconUsers = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const IconMail = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconTemplate = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const IconArrow = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
  </svg>
);

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/stats', { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 403) { router.push('/dashboard'); return; }
        if (!res.ok) throw new Error('Gagal memuat statistik');
        const data = await res.json();
        setStats(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">{error}</div>
    );
  }

  const statCards = [
    { label: 'Total Pengguna', value: stats?.totalUsers ?? 0, icon: <IconUsers />, bg: 'bg-blue-50 text-blue-600' },
    { label: 'Total Undangan', value: stats?.totalInvitations ?? 0, icon: <IconMail />, bg: 'bg-slate-100 text-slate-600' },
    { label: 'Dipublikasikan', value: stats?.totalPublished ?? 0, icon: <IconCheck />, bg: 'bg-green-50 text-green-600' },
    { label: 'Total Template', value: stats?.totalTemplates ?? 0, icon: <IconTemplate />, bg: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Panel Admin</h1>
        <p className="text-slate-500 text-sm">Kelola pengguna, undangan, dan template</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.bg}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value.toLocaleString('id-ID')}</p>
            <p className="text-sm text-slate-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/admin/users"
          className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-150 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors duration-150">
              <IconUsers />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Manajemen Pengguna</h2>
              <p className="text-sm text-slate-500">Lihat, ubah role, dan hapus pengguna</p>
            </div>
            <span className="ml-auto text-slate-300 group-hover:text-green-500 transition-colors duration-150">
              <IconArrow />
            </span>
          </div>
        </Link>

        <Link
          href="/dashboard/admin/templates"
          className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-150 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-150">
              <IconTemplate />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Manajemen Template</h2>
              <p className="text-sm text-slate-500">
                Kelola template &middot; {stats?.totalActiveTemplates ?? 0} aktif dari {stats?.totalTemplates ?? 0}
              </p>
            </div>
            <span className="ml-auto text-slate-300 group-hover:text-green-500 transition-colors duration-150">
              <IconArrow />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
