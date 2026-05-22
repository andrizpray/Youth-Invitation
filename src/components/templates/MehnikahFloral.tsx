'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import { TemplateProps } from './types';

const PRIMARY = '#c9a97a';
const SECONDARY = '#fdf8f3';
const ACCENT = '#8b6f5a';
const TEXT = '#4a3f35';

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
      <span style={{ color: PRIMARY }} className="text-lg">✦</span>
      <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.35em] mb-1" style={{ color: ACCENT + 'aa' }}>
      {children}
    </p>
  );
}

function FloralHeader() {
  return (
    <div className="flex items-center justify-center gap-2 text-xl" style={{ color: PRIMARY + '88' }}>
      <span>✿</span><span>❀</span><span>✿</span>
    </div>
  );
}

export default function MehnikahFloral({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let photos: string[];
  try {
    photos = JSON.parse(invitation.gallery_photos || '[]') as string[];
  } catch {
    photos = [];
  }
  const targetDate = invitation.date_akad || invitation.date_resepsi;
  const [copied, setCopied] = useState<string | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(null), 2000);
    });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const card = {
    backgroundColor: '#fff',
    border: `1px solid ${PRIMARY}33`,
    borderRadius: '1.25rem',
    boxShadow: '0 4px 24px rgba(201,169,122,0.10)',
  } as React.CSSProperties;

  return (
    <div style={{ fontFamily: '"Playfair Display", serif', color: TEXT, backgroundColor: SECONDARY }}>

      {/* Header / Hero */}
      <section
        className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center relative overflow-hidden"
        style={{ backgroundColor: SECONDARY }}
      >
        <div
          className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 -translate-x-1/3 -translate-y-1/3"
          style={{ background: `radial-gradient(circle, ${PRIMARY}, transparent)` }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 translate-x-1/3 translate-y-1/3"
          style={{ background: `radial-gradient(circle, ${PRIMARY}, transparent)` }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <FloralHeader />
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
            <span style={{ color: PRIMARY }} className="text-lg">✦</span>
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
          </div>
          <SectionLabel>The Wedding Of</SectionLabel>

          <h1
            className="text-6xl md:text-7xl mt-3 mb-1"
            style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}
          >
            {invitation.partner_name}
          </h1>
          <p
            className="text-3xl my-1"
            style={{ fontFamily: '"Great Vibes", cursive', color: ACCENT + 'aa' }}
          >
            &amp;
          </p>
          <h1
            className="text-6xl md:text-7xl mb-4"
            style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}
          >
            {invitation.partner_name2}
          </h1>

          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
            <span style={{ color: PRIMARY }} className="text-lg">✦</span>
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
          </div>
          <FloralHeader />
        </div>
      </section>

      {/* Quote */}
      {invitation.quote && (
        <section className="py-20 px-8 text-center" style={{ backgroundColor: PRIMARY + '0d' }}>
          <FloralHeader />
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
            <span style={{ color: PRIMARY }} className="text-lg">✦</span>
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
          </div>
          <blockquote
            className="text-sm md:text-base italic leading-relaxed max-w-md mx-auto"
            style={{ color: ACCENT }}
          >
            &ldquo;{invitation.quote}&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
            <span style={{ color: PRIMARY }} className="text-lg">✦</span>
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
          </div>
        </section>
      )}

      {/* Countdown */}
      {targetDate && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: SECONDARY }}>
          <SectionLabel>Menuju Hari Bahagia</SectionLabel>
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
            <span style={{ color: PRIMARY }} className="text-lg">✦</span>
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
          </div>
          <Countdown targetDate={targetDate} primaryColor={PRIMARY} accentColor={ACCENT} />
        </section>
      )}

      {/* Bismillah + Couple */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: PRIMARY + '0d' }}>
        <p className="text-sm italic leading-relaxed max-w-xs mx-auto mb-2" style={{ color: ACCENT }}>
          Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan
        </p>
        <p className="text-xs mb-8" style={{ color: ACCENT + '88' }}>— QS. Yaasin: 36</p>

        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
          <span style={{ color: PRIMARY }} className="text-lg">✦</span>
          <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
        </div>

        <p className="text-xs uppercase tracking-[0.3em] mb-8" style={{ color: ACCENT + 'aa' }}>
          Dengan memohon rahmat dan ridho Allah SWT
        </p>

        <div className="flex flex-col md:flex-row gap-6 max-w-lg mx-auto">
          <div className="flex-1 p-6 text-center" style={card}>
            <div className="text-3xl mb-3" style={{ color: PRIMARY }}>✿</div>
            <p
              className="text-3xl mb-2"
              style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}
            >
              {invitation.partner_name}
            </p>
            {invitation.parent_name && (
              <p className="text-xs leading-relaxed mt-2" style={{ color: ACCENT + 'bb' }}>
                {invitation.parent_name}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center">
            <p
              className="text-4xl"
              style={{ fontFamily: '"Great Vibes", cursive', color: ACCENT + '66' }}
            >
              &amp;
            </p>
          </div>

          <div className="flex-1 p-6 text-center" style={card}>
            <div className="text-3xl mb-3" style={{ color: PRIMARY }}>❀</div>
            <p
              className="text-3xl mb-2"
              style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}
            >
              {invitation.partner_name2}
            </p>
            {invitation.parent_name2 && (
              <p className="text-xs leading-relaxed mt-2" style={{ color: ACCENT + 'bb' }}>
                {invitation.parent_name2}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Akad Nikah */}
      {(invitation.date_akad || invitation.time_akad) && (
        <section className="py-24 px-6 text-center" style={{ backgroundColor: SECONDARY }}>
          <SectionLabel>Akad Nikah</SectionLabel>
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
            <span style={{ color: PRIMARY }} className="text-lg">✦</span>
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
          </div>
          <div className="max-w-sm mx-auto p-8" style={card}>
            <p
              className="text-2xl mb-4"
              style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}
            >
              Akad Nikah
            </p>
            {invitation.date_akad && (
              <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>
                {formatDate(invitation.date_akad)}
              </p>
            )}
            {invitation.time_akad && (
              <p className="text-sm mb-4" style={{ color: ACCENT }}>
                Pukul {invitation.time_akad} WIB
              </p>
            )}
            {invitation.location && (
              <>
                <div className="h-px w-12 mx-auto mb-4" style={{ backgroundColor: PRIMARY + '55' }} />
                <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>{invitation.location}</p>
              </>
            )}
            {invitation.address && (
              <p className="text-xs leading-relaxed mb-5" style={{ color: ACCENT + 'bb' }}>
                {invitation.address}
              </p>
            )}
            {invitation.maps_url && (
              <a
                href={invitation.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                📍 Lihat Lokasi
              </a>
            )}
          </div>
        </section>
      )}

      {/* Resepsi */}
      {(invitation.date_resepsi || invitation.time_resepsi) && (
        <section className="py-24 px-6 text-center" style={{ backgroundColor: PRIMARY + '0d' }}>
          <SectionLabel>Resepsi Pernikahan</SectionLabel>
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
            <span style={{ color: PRIMARY }} className="text-lg">✦</span>
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
          </div>
          <div className="max-w-sm mx-auto p-8" style={card}>
            <p
              className="text-2xl mb-4"
              style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}
            >
              Resepsi
            </p>
            {invitation.date_resepsi && (
              <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>
                {formatDate(invitation.date_resepsi)}
              </p>
            )}
            {invitation.time_resepsi && (
              <p className="text-sm mb-4" style={{ color: ACCENT }}>
                Pukul {invitation.time_resepsi} WIB
              </p>
            )}
            {invitation.maps_url && (
              <>
                <div className="h-px w-12 mx-auto mb-4" style={{ backgroundColor: PRIMARY + '55' }} />
                <a
                  href={invitation.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: PRIMARY }}
                >
                  📍 Lihat Lokasi
                </a>
              </>
            )}
          </div>
        </section>
      )}

      {/* Gallery */}
      {photos.length > 0 && (
        <section className="py-24 px-6" style={{ backgroundColor: SECONDARY }}>
          <div className="text-center mb-8">
            <SectionLabel>Galeri Foto</SectionLabel>
            <div className="flex items-center justify-center gap-3 my-6">
              <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
              <span style={{ color: PRIMARY }} className="text-lg">✦</span>
              <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {photos.map((url, i) => (
              <div
                key={i}
                className={`overflow-hidden ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                style={{ borderRadius: '1rem', border: `1px solid ${PRIMARY}22` }}
              >
                <img
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Amplop / Gift */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: PRIMARY + '0d' }}>
        <SectionLabel>Kirim Hadiah</SectionLabel>
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
          <span style={{ color: PRIMARY }} className="text-lg">✦</span>
          <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
        </div>
        <p className="text-sm mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: ACCENT }}>
          Doa restu Anda adalah hadiah terbesar bagi kami. Namun jika ingin memberikan hadiah, Anda dapat mengirimkan melalui:
        </p>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <div className="p-5 text-left" style={card}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: ACCENT + '99' }}>Transfer Bank</p>
            <p className="text-sm font-semibold mb-0.5" style={{ color: TEXT }}>Bank BCA</p>
            <p className="text-base font-bold mb-3" style={{ color: PRIMARY }}>1234567890</p>
            <p className="text-xs mb-3" style={{ color: ACCENT }}>a.n. {invitation.partner_name}</p>
            <button
              onClick={() => handleCopy('1234567890', 'bca')}
              className="text-xs px-4 py-2 rounded-full font-medium transition-all"
              style={copied === 'bca'
                ? { backgroundColor: PRIMARY, color: '#fff' }
                : { border: `1px solid ${PRIMARY}55`, color: PRIMARY }}
            >
              {copied === 'bca' ? '✓ Tersalin' : 'Salin Nomor'}
            </button>
          </div>

          <div className="p-5 text-left" style={card}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: ACCENT + '99' }}>Transfer Bank</p>
            <p className="text-sm font-semibold mb-0.5" style={{ color: TEXT }}>Bank Mandiri</p>
            <p className="text-base font-bold mb-3" style={{ color: PRIMARY }}>0987654321</p>
            <p className="text-xs mb-3" style={{ color: ACCENT }}>a.n. {invitation.partner_name2}</p>
            <button
              onClick={() => handleCopy('0987654321', 'mandiri')}
              className="text-xs px-4 py-2 rounded-full font-medium transition-all"
              style={copied === 'mandiri'
                ? { backgroundColor: PRIMARY, color: '#fff' }
                : { border: `1px solid ${PRIMARY}55`, color: PRIMARY }}
            >
              {copied === 'mandiri' ? '✓ Tersalin' : 'Salin Nomor'}
            </button>
          </div>
        </div>
      </section>

      {/* Ucapan + RSVP */}
      <section className="py-24 px-6" style={{ backgroundColor: SECONDARY }}>
        <div className="text-center mb-10">
          <SectionLabel>Ucapan &amp; Konfirmasi</SectionLabel>
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
            <span style={{ color: PRIMARY }} className="text-lg">✦</span>
            <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
          </div>
          <p className="text-sm max-w-xs mx-auto" style={{ color: ACCENT }}>
            Sampaikan doa dan ucapan terbaik Anda untuk kedua mempelai
          </p>
        </div>
        <RsvpSection
          guests={guests}
          onSubmit={onRsvpSubmit}
          rsvpStatus={rsvpStatus}
          rsvpError={rsvpError}
          primaryColor={PRIMARY}
          accentColor={ACCENT}
          bgColor={SECONDARY}
        />
      </section>

      {/* Footer */}
      <footer
        className="py-20 px-6 text-center"
        style={{ background: `linear-gradient(160deg, ${ACCENT}ee, ${ACCENT})` }}
      >
        <FloralHeader />
        <div className="flex items-center justify-center gap-3 mt-3 mb-1">
          <div className="h-px w-10" style={{ backgroundColor: PRIMARY + '88' }} />
          <span style={{ color: PRIMARY, fontSize: '0.6rem' }}>✦</span>
          <div className="h-px w-10" style={{ backgroundColor: PRIMARY + '88' }} />
        </div>

        <p
          className="text-5xl mt-4 text-white"
          style={{ fontFamily: '"Great Vibes", cursive' }}
        >
          {invitation.partner_name} &amp; {invitation.partner_name2}
        </p>

        <p className="text-white/50 text-xs uppercase tracking-[0.3em] mt-6 mb-2">
          Terima kasih
        </p>
        <p className="text-white/40 text-xs max-w-xs mx-auto leading-relaxed">
          Atas doa, restu, dan kehadiran Bapak/Ibu/Saudara/i
        </p>

        <div className="flex items-center justify-center gap-2 mt-8" style={{ color: '#fff3' }}>
          <span>✿</span><span>❀</span><span>✿</span>
        </div>

        <p className="text-white/20 text-xs mt-6">
          Made with love · Youth Invitation
        </p>
      </footer>
    </div>
  );
}
