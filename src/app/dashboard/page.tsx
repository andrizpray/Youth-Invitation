'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  total_invitations: number;
  active_invitations: number;
  total_rsvp: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_invitations: 0,
    active_invitations: 0,
    total_rsvp: 0,
  });
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUserName(data.user?.name || ''));

    fetch('/api/invitations')
      .then(res => res.json())
      .then(data => {
        const invs = data.invitations || [];
        setStats({
          total_invitations: invs.length,
          active_invitations: invs.filter((i: any) => i.status === 'active').length,
          total_rsvp: invs.reduce((acc: number, i: any) => acc + (i.total_guests || 0), 0),
        });
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Halo, {userName || 'Pengguna'} 👋</h1>
      <p className="text-gray-500 mb-8">Selamat datang di dashboard Youth Invitation</p>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon="💌" label="Total Undangan" value={stats.total_invitations} color="bg-amber-50 text-amber-700" />
        <StatCard icon="✅" label="Undangan Aktif" value={stats.active_invitations} color="bg-green-50 text-green-700" />
        <StatCard icon="📋" label="Total RSVP" value={stats.total_rsvp} color="bg-blue-50 text-blue-700" />
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
        {stats.total_invitations === 0 ? (
          <>
            <div className="text-6xl mb-4">💌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Undangan</h2>
            <p className="text-gray-500 mb-6">Mulai buat undangan digital pertamamu sekarang!</p>
            <Link
              href="/dashboard/invitations/new"
              className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/25"
            >
              Buat Undangan
            </Link>
          </>
        ) : (
          <div className="text-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Undangan Terbaru</h2>
              <Link href="/dashboard/invitations" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                Lihat Semua →
              </Link>
            </div>
            {/* Would list recent invitations here */}
            <Link
              href="/dashboard/invitations/new"
              className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-all"
            >
              + Buat Baru
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${color.split(' ')[1]}`}>{value}</p>
    </div>
  );
}
