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

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(async (res) => {
        if (res.status === 403) {
          router.push('/dashboard');
          return;
        }
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
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
        ❌ {error}
      </div>
    );
  }

  const statCards = [
    { label: 'Total Pengguna', value: stats?.totalUsers ?? 0, icon: '👥', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Undangan', value: stats?.totalInvitations ?? 0, icon: '💌', color: 'bg-amber-50 text-amber-600' },
    { label: 'Dipublikasikan', value: stats?.totalPublished ?? 0, icon: '✅', color: 'bg-green-50 text-green-600' },
    { label: 'Total Template', value: stats?.totalTemplates ?? 0, icon: '🎨', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Panel Admin</h1>
        <p className="text-gray-500 text-sm">Kelola pengguna, undangan, dan template</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString('id-ID')}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/admin/users"
          className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors">
              👥
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Manajemen Pengguna</h2>
              <p className="text-sm text-gray-500">Lihat, ubah role, dan hapus pengguna</p>
            </div>
            <span className="ml-auto text-gray-300 group-hover:text-amber-400 transition-colors text-xl">→</span>
          </div>
        </Link>

        <Link
          href="/dashboard/admin/templates"
          className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-purple-100 transition-colors">
              🎨
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Manajemen Template</h2>
              <p className="text-sm text-gray-500">
                Kelola template · {stats?.totalActiveTemplates ?? 0} aktif dari {stats?.totalTemplates ?? 0}
              </p>
            </div>
            <span className="ml-auto text-gray-300 group-hover:text-amber-400 transition-colors text-xl">→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
