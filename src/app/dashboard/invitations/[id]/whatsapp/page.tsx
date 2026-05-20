'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Guest {
  id: string;
  name: string;
  phone: string;
  waLink: string;
}

interface Stats {
  total: number;
  withPhone: number;
  withoutPhone: number;
}

interface Invitation {
  id: string;
  slug: string;
  partner_name: string;
  partner_name2: string;
}

export default function WhatsAppPage() {
  const params = useParams();
  const invitationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending'>('all');
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadWaData();
  }, [invitationId]);

  const loadWaData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/whatsapp/${invitationId}`);
      const data = await res.json();
      setInvitation(data.invitation);
      setStats(data.stats);
      setGuests(data.guests || []);
    } catch {
      console.error('Failed to load WhatsApp data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendWa = (guest: Guest) => {
    window.open(guest.waLink, '_blank');
    setSentIds(prev => new Set([...prev, guest.id]));
  };

  const handleSendAll = async () => {
    const guestsToSend = filteredGuests.filter(g => !sentIds.has(g.id));
    if (guestsToSend.length === 0) {
      alert('Semua tamu sudah dikirimi undangan');
      return;
    }

    if (!confirm(`Kirim undangan ke ${guestsToSend.length} tamu?\n\nCatatan: WhatsApp akan terbuka satu per satu untuk setiap tamu.`)) {
      return;
    }

    for (const guest of guestsToSend) {
      window.open(guest.waLink, '_blank');
      setSentIds(prev => new Set([...prev, guest.id]));
      await new Promise(r => setTimeout(r, 500)); // Small delay between opens
    }
  };

  const filteredGuests = filter === 'pending'
    ? guests.filter(g => !sentIds.has(g.id))
    : guests;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/dashboard/invitations/${invitationId}/guests`}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          ← Kembali
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Kirim WhatsApp</h1>
          <p className="text-gray-500 text-sm">
            {invitation?.partner_name} & {invitation?.partner_name2}
          </p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Tamu</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Punya WA</p>
            <p className="text-2xl font-bold text-green-600">{stats.withPhone}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Terikirim</p>
            <p className="text-2xl font-bold text-amber-600">{sentIds.size}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Semua ({guests.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'pending'
                ? 'bg-amber-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Belum Terkirim ({guests.filter(g => !sentIds.has(g.id)).length})
          </button>
        </div>
        <button
          onClick={handleSendAll}
          disabled={filteredGuests.length === 0}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl font-medium text-sm transition-all"
        >
          📱 Kirim Semua ({filteredGuests.filter(g => !sentIds.has(g.id)).length})
        </button>
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Catatan:</strong> Klik "Kirim" akan membuka WhatsApp Web/App dengan pesan yang sudah terisi otomatis.
          Pastikan nomor tamu sudah benar sebelum mengirim.
        </p>
      </div>

      {/* Guest List */}
      {filteredGuests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <div className="text-5xl mb-4">📱</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'pending' ? 'Semua Terkirim' : 'Tidak Ada Tamu'}
          </h2>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Tidak ada tamu dengan nomor WhatsApp'
              : 'Semua tamu sudah menerima undangan via WhatsApp'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{guest.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">{guest.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    {sentIds.has(guest.id) ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        ✓ Terkirim
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        Belum
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleSendWa(guest)}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-all"
                    >
                      {sentIds.has(guest.id) ? 'Kirim Ulang' : 'Kirim'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
