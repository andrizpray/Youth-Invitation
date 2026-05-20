'use client';

import { useState } from 'react';
import { RsvpForm, GuestData } from './types';

interface RsvpSectionProps {
  guests: GuestData[];
  onSubmit: (form: RsvpForm) => Promise<void>;
  rsvpStatus: 'idle' | 'submitting' | 'success' | 'error';
  rsvpError: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
}

export default function RsvpSection({
  guests,
  onSubmit,
  rsvpStatus,
  rsvpError,
  primaryColor,
  accentColor,
  bgColor,
}: RsvpSectionProps) {
  const [form, setForm] = useState<RsvpForm>({
    name: '',
    is_attending: true,
    guest_count: 1,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    if (rsvpStatus === 'success') {
      setForm({ name: '', is_attending: true, guest_count: 1, message: '' });
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {rsvpStatus === 'success' ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-xl font-semibold" style={{ color: primaryColor }}>Terima kasih!</p>
          <p className="text-sm mt-2 opacity-70">Konfirmasi kehadiran Anda sudah kami terima.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: primaryColor + '44', backgroundColor: bgColor, focusRingColor: primaryColor } as React.CSSProperties}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, is_attending: true })}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={form.is_attending
                ? { backgroundColor: primaryColor, color: '#fff' }
                : { border: `1px solid ${primaryColor}44`, color: accentColor }}
            >
              ✅ Hadir
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_attending: false })}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={!form.is_attending
                ? { backgroundColor: '#dc2626', color: '#fff' }
                : { border: `1px solid ${primaryColor}44`, color: accentColor }}
            >
              ❌ Tidak Hadir
            </button>
          </div>

          {form.is_attending && (
            <input
              type="number"
              placeholder="Jumlah Tamu"
              value={form.guest_count}
              onChange={(e) => setForm({ ...form, guest_count: parseInt(e.target.value) || 1 })}
              min={1}
              max={10}
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none"
              style={{ borderColor: primaryColor + '44', backgroundColor: bgColor }}
            />
          )}

          <textarea
            placeholder="Ucapan & Doa (opsional)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none resize-none"
            style={{ borderColor: primaryColor + '44', backgroundColor: bgColor }}
          />

          <button
            type="submit"
            disabled={rsvpStatus === 'submitting'}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity disabled:opacity-60"
            style={{ backgroundColor: primaryColor }}
          >
            {rsvpStatus === 'submitting' ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>

          {rsvpStatus === 'error' && (
            <p className="text-red-500 text-xs text-center">{rsvpError || 'Terjadi kesalahan, coba lagi.'}</p>
          )}
        </form>
      )}

      {/* Wishes list */}
      {guests.filter(g => g.message).length > 0 && (
        <div className="mt-10">
          <p className="text-center text-xs uppercase tracking-widest opacity-50 mb-4">Ucapan & Doa</p>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {guests.filter(g => g.message).map((g) => (
              <div
                key={g.id}
                className="p-3 rounded-xl text-sm"
                style={{ backgroundColor: primaryColor + '11', border: `1px solid ${primaryColor}22` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium" style={{ color: accentColor }}>{g.name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={g.is_attending
                      ? { backgroundColor: primaryColor + '22', color: primaryColor }
                      : { backgroundColor: '#dc2626' + '22', color: '#dc2626' }}
                  >
                    {g.is_attending ? 'Hadir' : 'Tidak Hadir'}
                  </span>
                </div>
                <p className="italic opacity-70">"{g.message}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
