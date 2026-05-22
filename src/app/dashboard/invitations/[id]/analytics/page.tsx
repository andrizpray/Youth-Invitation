'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  totalGuests: number;
  attending: number;
  notAttending: number;
  pending: number;
  totalPersons: number;
  attendingPersons: number;
  attendanceRate: number;
}

interface RsvpItem {
  id: string;
  name: string;
  is_attending: number;
  guest_count: number;
  message: string;
  created_at: string;
}

interface TimelineItem {
  date: string;
  count: number;
  attending: number;
}

interface Invitation {
  id: string;
  slug: string;
  partner_name: string;
  partner_name2: string;
  event_date: string;
}

export default function AnalyticsPage() {
  const params = useParams();
  const invitationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRsvps, setRecentRsvps] = useState<RsvpItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [invitationId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/${invitationId}`);
      const data = await res.json();
      setInvitation(data.invitation);
      setStats(data.stats);
      setRecentRsvps(data.recentRsvps || []);
      setTimeline(data.rsvpTimeline || []);
    } catch {
      setLoadError('Gagal memuat data analitik');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!invitation || !stats) {
    return (
      <div className="text-center py-20 text-gray-500">
        {loadError || 'Data tidak ditemukan'}
      </div>
    );
  }

  // Calculate max for timeline chart
  const maxCount = Math.max(...timeline.map(t => t.count), 1);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/invitations"
          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          ← Kembali
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm">
            {invitation.partner_name} & {invitation.partner_name2}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Tamu"
          value={stats.totalGuests}
          subtext={`${stats.totalPersons} orang`}
          color="blue"
        />
        <StatCard
          label="Hadir"
          value={stats.attending}
          subtext={`${stats.attendingPersons} orang`}
          color="green"
        />
        <StatCard
          label="Tidak Hadir"
          value={stats.notAttending}
          color="red"
        />
        <StatCard
          label="Belum RSVP"
          value={stats.pending}
          color="gray"
        />
      </div>

      {/* Attendance Rate */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Tingkat Kehadiran</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.attendanceRate}%` }}
              />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-500">
            {stats.attendanceRate}%
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          {stats.attending} dari {stats.totalGuests} tamu sudah konfirmasi hadir
        </p>
      </div>

      {/* RSVP Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Distribusi RSVP</h2>
        <div className="flex items-center gap-2 h-8 rounded-full overflow-hidden">
          {stats.totalGuests > 0 ? (
            <>
              {stats.attending > 0 && (
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${(stats.attending / stats.totalGuests) * 100}%` }}
                  title={`Hadir: ${stats.attending}`}
                />
              )}
              {stats.notAttending > 0 && (
                <div
                  className="h-full bg-red-400 transition-all"
                  style={{ width: `${(stats.notAttending / stats.totalGuests) * 100}%` }}
                  title={`Tidak Hadir: ${stats.notAttending}`}
                />
              )}
              {stats.pending > 0 && (
                <div
                  className="h-full bg-gray-300 transition-all"
                  style={{ width: `${(stats.pending / stats.totalGuests) * 100}%` }}
                  title={`Belum RSVP: ${stats.pending}`}
                />
              )}
            </>
          ) : (
            <div className="h-full bg-gray-200 w-full" />
          )}
        </div>
        <div className="flex gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600">Hadir ({stats.attending})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-gray-600">Tidak Hadir ({stats.notAttending})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="text-gray-600">Pending ({stats.pending})</span>
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      {timeline.length > 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Timeline RSVP</h2>
          <div className="flex items-end gap-1 h-32">
            {timeline.map((item) => (
              <div key={item.date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-amber-400 rounded-t transition-all"
                  style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: 4 }}
                  title={`${item.date}: ${item.count} RSVP`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            {timeline.length > 0 && (
              <>
                <span>{timeline[0]?.date}</span>
                <span>{timeline[timeline.length - 1]?.date}</span>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6 text-center">
          <p className="text-gray-400 text-sm">Belum ada data RSVP untuk timeline</p>
        </div>
      )}

      {/* Recent RSVPs */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">RSVP Terbaru</h2>
          <Link
            href={`/dashboard/invitations/${invitationId}/guests`}
            className="text-sm text-amber-600 hover:text-amber-700"
          >
            Lihat Semua →
          </Link>
        </div>
        {recentRsvps.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada RSVP masuk</p>
        ) : (
          <div className="space-y-3">
            {recentRsvps.map((rsvp) => (
              <div key={rsvp.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{rsvp.name}</p>
                  <p className="text-sm text-gray-500">
                    {rsvp.is_attending === 1 ? `${rsvp.guest_count} orang hadir` : 'Tidak hadir'}
                    {rsvp.message && ` • "${rsvp.message}"`}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rsvp.is_attending === 1
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {rsvp.is_attending === 1 ? '✓' : '✗'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
  color,
}: {
  label: string;
  value: number;
  subtext?: string;
  color: 'blue' | 'green' | 'red' | 'gray';
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    gray: 'text-gray-600 bg-gray-50',
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
      )}
    </div>
  );
}
