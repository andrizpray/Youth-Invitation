'use client';

import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import { TemplateProps } from './types';

export default function RomanticBlush({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#e8b4b8', secondary: '#fdf6f6', accent: '#8b4a4f' };
  }
  let photos: string[];
  try {
    photos = JSON.parse(invitation.gallery_photos || '[]') as string[];
  } catch {
    photos = [];
  }
  const targetDate = invitation.date_akad || invitation.date_resepsi;

  const sectionClass = 'min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center';

  return (
    <div style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif', color: colors.accent, backgroundColor: colors.secondary }}>

      {/* Cover — soft floral feel */}
      <section
        className={sectionClass + ' relative overflow-hidden'}
        style={{ background: `linear-gradient(180deg, ${colors.accent}ee 0%, ${colors.primary}55 50%, ${colors.secondary} 100%)` }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: colors.primary }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 translate-x-1/3 translate-y-1/3"
          style={{ backgroundColor: colors.primary }} />

        <div className="relative z-10">
          <p className="text-white/80 text-xs uppercase tracking-[0.4em] mb-8">~ Undangan Pernikahan ~</p>

          <div className="mb-4">
            <p className="text-white/80 text-sm mb-1">Bismillahirrahmanirrahim</p>
          </div>

          <h1 className="text-6xl md:text-7xl text-white mb-2" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {invitation.partner_name}
          </h1>
          <p className="text-4xl my-2" style={{ color: colors.primary, fontFamily: '"Great Vibes", cursive' }}>
            &amp;
          </p>
          <h1 className="text-6xl md:text-7xl text-white mb-10" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {invitation.partner_name2}
          </h1>

          <p className="text-white/80 text-sm max-w-xs mx-auto leading-relaxed mb-10">
            {invitation.quote || 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang kehadiran Anda'}
          </p>

          {targetDate && (
            <Countdown targetDate={targetDate} primaryColor="#fff" accentColor="#ffffff88" />
          )}
        </div>

        <div className="absolute bottom-8 animate-bounce text-white/60 text-xl" aria-hidden="true">↓</div>
      </section>

      {/* Ornament divider */}
      <div className="py-8 text-center" style={{ backgroundColor: colors.secondary }}>
        <p className="text-2xl" style={{ color: colors.primary }}>✦ ✦ ✦</p>
      </div>

      {/* Mempelai */}
      {(invitation.parent_name || invitation.parent_name2) && (
        <section className={sectionClass} style={{ backgroundColor: colors.secondary }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: '#9b6b97' }}>Mempelai</p>
          <div className="flex flex-col gap-8 max-w-xs">
            {invitation.parent_name && (
              <div className="p-6 rounded-2xl" style={{ backgroundColor: colors.primary + '18', border: `1px solid ${colors.primary}33` }}>
                <p className="text-2xl font-semibold mb-1" style={{ fontFamily: '"Great Vibes", cursive', color: colors.accent }}>
                  {invitation.partner_name}
                </p>
                <p className="text-xs opacity-70">Putra dari</p>
                <p className="text-sm opacity-90 mt-1">{invitation.parent_name}</p>
              </div>
            )}
            {invitation.parent_name2 && (
              <div className="p-6 rounded-2xl" style={{ backgroundColor: colors.primary + '18', border: `1px solid ${colors.primary}33` }}>
                <p className="text-2xl font-semibold mb-1" style={{ fontFamily: '"Great Vibes", cursive', color: colors.accent }}>
                  {invitation.partner_name2}
                </p>
                <p className="text-xs opacity-70">Putri dari</p>
                <p className="text-sm opacity-90 mt-1">{invitation.parent_name2}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Akad */}
      {(invitation.date_akad || invitation.time_akad) && (
        <section className={sectionClass} style={{ backgroundColor: colors.primary + '15' }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: '#9b6b97' }}>Akad Nikah</p>
          <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
          <p className="text-3xl font-bold mb-3" style={{ color: colors.accent }}>
            {invitation.date_akad
              ? new Date(invitation.date_akad).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
              : ''}
          </p>
          {invitation.time_akad && (
            <p className="text-lg opacity-85">{invitation.time_akad} WIB</p>
          )}
        </section>
      )}

      {/* Resepsi */}
      {(invitation.date_resepsi || invitation.time_resepsi) && (
        <section className={sectionClass} style={{ backgroundColor: colors.secondary }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: '#9b6b97' }}>Resepsi Pernikahan</p>
          <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
          <p className="text-3xl font-bold mb-3" style={{ color: colors.accent }}>
            {invitation.date_resepsi
              ? new Date(invitation.date_resepsi).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
              : ''}
          </p>
          {invitation.time_resepsi && (
            <p className="text-lg opacity-85">{invitation.time_resepsi} WIB</p>
          )}
        </section>
      )}

      {/* Lokasi */}
      {invitation.location && (
        <section className={sectionClass} style={{ backgroundColor: colors.primary + '15' }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: '#9b6b97' }}>Lokasi</p>
          <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
          <p className="text-2xl font-semibold mb-2">{invitation.location}</p>
          {invitation.address && (
            <p className="text-sm opacity-85 max-w-xs leading-relaxed mb-8">{invitation.address}</p>
          )}
          {invitation.maps_url && (
            <a
              href={invitation.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium"
              style={{ backgroundColor: colors.primary, color: colors.accent }}
            >
              📍 Buka Google Maps
            </a>
          )}
        </section>
      )}

      {/* Story */}
      {invitation.story && (
        <section className={sectionClass} style={{ backgroundColor: colors.secondary }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: '#9b6b97' }}>Kisah Kami</p>
          <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
          <p className="text-sm opacity-90 max-w-sm leading-relaxed italic">"{invitation.story}"</p>
        </section>
      )}

      {/* Galeri */}
      {photos.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: colors.primary + '15' }}>
          <p className="text-xs uppercase tracking-[0.3em] text-center mb-6" style={{ color: '#9b6b97' }}>Galeri</p>
          <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {photos.map((url, i) => (
              <div key={i} className={`overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP */}
      <section className={sectionClass} style={{ backgroundColor: colors.secondary }}>
        <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: '#9b6b97' }}>Konfirmasi Kehadiran</p>
        <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
        <RsvpSection
          guests={guests}
          onSubmit={onRsvpSubmit}
          rsvpStatus={rsvpStatus}
          rsvpError={rsvpError}
          primaryColor={colors.primary}
          accentColor={colors.accent}
          bgColor={colors.secondary}
        />
      </section>

      {/* Footer */}
      <footer
        className="py-16 px-6 text-center"
        style={{ background: `linear-gradient(180deg, ${colors.primary}33, ${colors.accent}cc)` }}
      >
        <p className="text-white/70 text-xs uppercase tracking-widest mb-6">~ Dengan Cinta ~</p>
        <p className="text-5xl text-white" style={{ fontFamily: '"Great Vibes", cursive' }}>
          {invitation.partner_name} & {invitation.partner_name2}
        </p>
        <p className="text-white/60 text-xs mt-8" aria-hidden="true">Terima kasih atas doa dan restu Anda</p>
      </footer>
    </div>
  );
}
