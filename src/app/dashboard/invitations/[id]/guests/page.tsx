'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Guest {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  code: string | null;
  is_attending: number;
  guest_count: number;
  message: string | null;
  created_at: string;
}

interface Invitation {
  id: string;
  slug: string;
}

export default function GuestsPage() {
  const params = useParams();
  const invitationId = params.id as string;

  const [guests, setGuests] = useState<Guest[]>([]);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [guestError, setGuestError] = useState('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // CSV states
  const [csvText, setCsvText] = useState('');
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvResult, setCsvResult] = useState<{ added: number; errors?: string[] } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/guests/${invitationId}`);
      const data = await res.json();
      setGuests(data.guests || []);
      setInvitation(data.invitation || null);
    } catch {
      setGuestError('Gagal memuat daftar tamu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuests();
  }, [invitationId]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formName.trim()) {
      setFormError('Nama wajib diisi');
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch(`/api/guests/${invitationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail || null,
          phone: formPhone || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Gagal menambah tamu');
        return;
      }
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setShowAddForm(false);
      loadGuests();
    } catch {
      setFormError('Terjadi kesalahan');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Hapus tamu ini?')) return;
    await fetch(`/api/guests/${invitationId}?guestId=${guestId}`, { method: 'DELETE' });
    loadGuests();
  };

  const handleCopyLink = (code: string) => {
    const url = `${window.location.origin}/${invitation?.slug}?tamu=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSendWa = async (guestId: string) => {
    try {
      const res = await fetch(`/api/whatsapp/${invitationId}/${guestId}`);
      const data = await res.json();
      if (data.waLink) {
        window.open(data.waLink, '_blank');
      } else {
        setGuestError(data.error || 'Gagal membuat link WhatsApp');
      }
    } catch {
      setGuestError('Terjadi kesalahan');
    }
  };

  const handleCsvUpload = async () => {
    if (!csvText.trim()) {
      setCsvResult({ added: 0, errors: ['CSV kosong'] });
      return;
    }

    setCsvLoading(true);
    try {
      // Parse CSV: name,email,phone
      const lines = csvText.trim().split('\n');
      const guests = lines
        .map(line => {
          const parts = line.split(',').map(p => p.trim());
          return {
            name: parts[0] || '',
            email: parts[1] || '',
            phone: parts[2] || '',
          };
        })
        .filter(g => g.name);

      const res = await fetch(`/api/guests/${invitationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests }),
      });
      const data = await res.json();
      setCsvResult({ added: data.added, errors: data.errors });
      if (data.added > 0) {
        loadGuests();
      }
    } catch {
      setCsvResult({ added: 0, errors: ['Gagal mengunggah'] });
    } finally {
      setCsvLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCsvText(evt.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  // Export guests to CSV
  const handleExportCsv = () => {
    if (guests.length === 0) return;

    const headers = ['Nama', 'Email', 'Telepon', 'Kode', 'Status', 'Jumlah Orang', 'Pesan'];
    const rows = guests.map(g => [
      g.name,
      g.email || '',
      g.phone || '',
      g.code || '',
      g.is_attending === 1 ? 'Hadir' : g.is_attending === 0 && g.message ? 'Tidak Hadir' : 'Belum RSVP',
      g.guest_count.toString(),
      g.message || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tamu-${invitation?.slug || 'export'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const totalGuests = guests.length;
  const attendingGuests = guests.filter(g => g.is_attending === 1).length;
  const totalPersonCount = guests.reduce((sum, g) => sum + g.guest_count, 0);

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
          href="/dashboard/invitations"
          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          ← Kembali
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Kelola Tamu</h1>
          <p className="text-gray-500 text-sm">
            {invitation?.slug && `${window.location.origin}/${invitation.slug}`}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Tamu</p>
          <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Hadir</p>
          <p className="text-2xl font-bold text-green-600">{attendingGuests}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Jumlah Orang</p>
          <p className="text-2xl font-bold text-gray-900">{totalPersonCount}</p>
        </div>
      </div>

      {guestError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          ❌ {guestError}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition-all"
        >
          + Tambah Tamu
        </button>
        <button
          onClick={() => setShowCsvModal(true)}
          className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium text-sm border border-gray-200 transition-all"
        >
          📄 Upload CSV
        </button>
        <button
          onClick={handleExportCsv}
          disabled={guests.length === 0}
          className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium text-sm border border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📥 Export CSV
        </button>
        <a
          href={`/dashboard/invitations/${invitationId}/whatsapp`}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition-all"
        >
          📱 Kirim WA
        </a>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tambah Tamu Baru</h2>
          {formError && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{formError}</div>
          )}
          <form onSubmit={handleAddGuest} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Nama tamu"
                />
              </div>
              <div className="col-span-3 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="email@contoh.com"
                />
              </div>
              <div className="col-span-3 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="08xxx"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={formLoading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl font-medium text-sm transition-all"
              >
                {formLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Guest List */}
      {guests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Tamu</h2>
          <p className="text-gray-500 mb-6">Tambahkan tamu satu per satu atau upload CSV</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Kontak</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{guest.name}</p>
                    <p className="text-xs text-gray-400 md:hidden">{guest.phone || guest.email}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{guest.phone || '-'}</p>
                    <p className="text-xs text-gray-400">{guest.email || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    {guest.is_attending === 1 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        ✓ Hadir ({guest.guest_count})
                      </span>
                    ) : guest.is_attending === 0 && guest.message ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        ✗ Tidak Hadir
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        Belum RSVP
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => guest.code && handleCopyLink(guest.code)}
                      disabled={!guest.code}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium disabled:text-gray-400"
                    >
                      {copiedCode === guest.code ? '✓ Disalin' : 'Salin Link'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {guest.phone && (
                        <button
                          onClick={() => handleSendWa(guest.id)}
                          className="text-xs text-green-600 hover:text-green-700 font-medium"
                        >
                          📱 WA
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CSV Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload CSV Tamu</h2>
            <p className="text-sm text-gray-500 mb-4">
              Format: <code className="bg-gray-100 px-1 rounded">nama,email,phone</code> (satu per baris)
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-amber-400 hover:text-amber-600 transition-all mb-4"
            >
              📁 Pilih File CSV
            </button>

            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Atau paste CSV di sini...&#10;Budi,budi@email.com,08123456789&#10;Ani,ani@email.com,08987654321"
              className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-mono resize-none"
            />

            {csvResult && (
              <div className={`mt-4 p-3 rounded-xl text-sm ${csvResult.errors ? 'bg-yellow-50 text-yellow-800' : 'bg-green-50 text-green-800'}`}>
                <p className="font-medium">{csvResult.added} tamu berhasil ditambahkan</p>
                {csvResult.errors && csvResult.errors.length > 0 && (
                  <ul className="mt-2 text-xs list-disc list-inside">
                    {csvResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCsvUpload}
                disabled={csvLoading || !csvText.trim()}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl font-medium text-sm transition-all"
              >
                {csvLoading ? 'Mengunggah...' : 'Upload'}
              </button>
              <button
                onClick={() => { setShowCsvModal(false); setCsvText(''); setCsvResult(null); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
