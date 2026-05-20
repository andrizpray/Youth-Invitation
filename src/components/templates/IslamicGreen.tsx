'use client';

import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import { TemplateProps } from './types';

export default function IslamicGreen({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  const colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  const photos: string[] = JSON.parse(invitation.gallery_photos || '[]');
  const targetDate = invitation.date_akad || invitation.date_resepsi;

  const sectionClass = 'min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center';

  return (
    <div style={{ fontFamily: '"Amiri", "Playfair Display", serif', color: colors.accent, backgroundColor: colors.secondary }}>

      {/* Cover */}
      <section
        className={sectionClass + ' relative overflow-hidden'}
        style={{ background: `linear-gradient(180deg, ${colors.accent} 0%, ${colors.primary}cc 100%)` }}
      >
        {/* Geometric ornament top */}
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-8 opacity-20">
          <div className="w-32 h-32 border-2 rotate-45" style={{ borderColor: colors.secondary }} />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Arabic bismillah style */}
          <p className="text-white/80 text-lg mb-2" style={{ fontFamily: '"Amiri", serif', letterSpacing: '0.05em' }}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
          <p className="text-white/70 text-xs uppercase tracking-[0.3em] mb-10">Bismillahirrahmanirrahim</p>

          <p className="text-white/60 text-sm mb-2">Assalamualaikum Warahmatullahi Wabarakatuh</p>
          <p className="text-white/70 text-sm mb-10 max-w-xs leading-relaxed">
            {invitation.quote || 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang kehadiran Anda'}
          </p>

          <h1 className="text-5xl md:text-6xl text-white mb-2" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {invitation.partner_name}
          </h1>
          <p className="text-3xl my-2 text-white/60" style={{ fontFamily: '"Great Vibes", cursive' }}>&</p>
          <h1 className="text-5xl md:text-6xl text-white mb-12" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {invitation.partner_name2}
          </h1>

          {targetDate && (
            <Countdown targetDate={targetDate} primaryColor={colors.secondary} accentColor="#ffffff88" />
          )}
        </div>

        {/* Geometric ornament bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 opacity-20">
          <div className="w-32 h-32 border-2 rotate-45" style={{ borderColor: colors.secondary }} />
        </div>

        <div className="absolute bottom-8 animate-bounce text-white/60 text-xl z-10" aria-hidden="true">↓</div>
      </section>

      {/* Ayat */}
      <section className="py-16 px-8 text-center" style={{ backgroundColor: colors.primary + '18' }}>
        <p className="text-lg leading-relaxed opacity-80 mb-3" style={{ fontFamily: '"Amiri", serif' }}>
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
        </p>
        <p className="text-xs opacity-70 uppercase tracking-widest">QS. Ar-Rum: 21</p>
      </section>

      {/* Mempelai */}
      {(invitation.parent_name || invitation.parent_name2) && (
        <section className={sectionClass} style={{ backgroundColor: colors.secondary }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: '#3d5c3e' }}>Mempelai</p>
          <div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
          <div className="flex flex-col gap-6 max-w-xs w-full">
            {invitation.parent_name && (
              <div className="p-5 rounded-xl text-left" style={{ backgroundColor: colors.primary + '15', border: `1px solid ${colors.primary}33` }}>
                <p className="text-xl font-semibold" style={{ color: colors.primary }}>{invitation.partner_name}</p>
                <p className="text-xs opacity-70 mt-1">Putra dari</p>
                <p className="text-sm opacity-90">{invitation.parent_name}</p>
              </div>
            )}
            {invitation.parent_name2 && (
              <div className="p-5 rounded-xl text-left" style={{ backgroundColor: colors.primary + '15', border: `1px solid ${colors.primary}33` }}>
                <p className="text-xl font-semibold" style={{ color: colors.primary }}>{invitation.partner_name2}</p>
                <p className="text-xs opacity-70 mt-1">Putri dari</p>
                <p className="text-sm opacity-90">{invitation.parent_name2}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Akad */}
      {(invitation.date_akad || invitation.time_akad) && (
        <section className={sectionClass} style={{ backgroundColor: colors.primary + '15' }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#3d5c3e' }}>Akad Nikah</p>
          <div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
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
          <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#3d5c3e' }}>Resepsi Pernikahan</p>
          <div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
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
          <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#3d5c3e' }}>Lokasi</p>
          <div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
          <p className="text-2xl font-semibold mb-2">{invitation.location}</p>
          {invitation.address && (
            <p className="text-sm opacity-85 max-w-xs leading-relaxed mb-8">{invitation.address}</p>
          )}
          {invitation.maps_url && (
            <a
              href={invitation.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: colors.primary }}
            >
              📍 Buka Google Maps
            </a>
          )}
        </section>
      )}

      {/* Story */}
      {invitation.story && (
        <section className={sectionClass} style={{ backgroundColor: colors.secondary }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#3d5c3e' }}>Kisah Kami</p>
          <div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
          <p className="text-sm opacity-90 max-w-sm leading-relaxed italic">"{invitation.story}"</p>
        </section>
      )}

      {/* Galeri */}
      {photos.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: colors.primary + '15' }}>
          <p className="text-xs uppercase tracking-[0.3em] text-center mb-4" style={{ color: '#3d5c3e' }}>Galeri</p>
          <div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {photos.map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden">
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP */}
      <section className={sectionClass} style={{ backgroundColor: colors.secondary }}>
        <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#3d5c3e' }}>Konfirmasi Kehadiran</p>
        <div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: colors.primary }} />
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
        style={{ background: `linear-gradient(180deg, ${colors.accent}, ${colors.primary}cc)` }}
      >
        <p className="text-white/70 text-sm mb-2">Wassalamualaikum Warahmatullahi Wabarakatuh</p>
        <p className="text-4xl text-white mt-6" style={{ fontFamily: '"Great Vibes", cursive' }}>
          {invitation.partner_name} & {invitation.partner_name2}
        </p>
        <p className="text-white/60 text-xs mt-8">Terima kasih atas doa dan restu Anda</p>
      </footer>
    </div>
  );
}
