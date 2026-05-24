'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface InvitationSummary {
  id: string;
  slug: string;
  partner_name: string;
  partner_name2: string;
  status: string;
  total_guests: number;
  created_at: string;
}

interface DashboardStats {
  total_invitations: number;
  active_invitations: number;
  total_rsvp: number;
}

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

const IconClipboard = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const IconAlert = () => (
  <svg className="w-8 h-8 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [meRes, invRes] = await Promise.all([
          fetch('/api/auth/me', { credentials: 'include' }),
          fetch('/api/invitations', { credentials: 'include' }),
        ]);

        if (!meRes.ok || !invRes.ok) {
          throw new Error('Gagal memuat data dashboard');
        }

        const meData = await meRes.json();
        const invData = await invRes.json();

        if (!cancelled) {
          setUserName(meData.user?.name || '');
          const invs: InvitationSummary[] = invData.invitations || [];
          setStats({
            total_invitations: invs.length,
            active_invitations: invs.filter(i => i.status === 'active').length,
            total_rsvp: invs.reduce((acc, i) => acc + (i.total_guests || 0), 0),
          });
        }
      } catch {
        if (!cancelled) {
          setError('Gagal memuat dashboard. Periksa koneksi Anda.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <IconAlert />
        <p className="text-slate-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-all duration-150"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">
        Halo, {userName || 'Pengguna'}
      </h1>
      <p className="text-slate-500 mb-8">Selamat datang di dashboard Youth Invitation</p>

      {stats && (
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<IconMail />}
            iconBg="bg-blue-50 text-blue-600"
            label="Total Undangan"
            value={stats.total_invitations}
            valueColor="text-blue-600"
          />
          <StatCard
            icon={<IconCheck />}
            iconBg="bg-green-50 text-green-600"
            label="Undangan Aktif"
            value={stats.active_invitations}
            valueColor="text-green-600"
          />
          <StatCard
            icon={<IconClipboard />}
            iconBg="bg-slate-100 text-slate-600"
            label="Total RSVP"
            value={stats.total_rsvp}
            valueColor="text-slate-700"
          />
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center shadow-sm">
        {!stats || stats.total_invitations === 0 ? (
          <>
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Belum Ada Undangan</h2>
            <p className="text-slate-500 mb-6">Mulai buat undangan digital pertamamu sekarang!</p>
            <Link
              href="/dashboard/invitations/new"
              className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-150 shadow-lg shadow-green-500/25"
            >
              Buat Undangan
            </Link>
          </>
        ) : (
          <div className="text-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Undangan Terbaru</h2>
              <Link href="/dashboard/invitations" className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-150">
                Lihat Semua &rarr;
              </Link>
            </div>
            <Link
              href="/dashboard/invitations/new"
              className="inline-block px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-all duration-150"
            >
              + Buat Baru
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number;
  valueColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}
