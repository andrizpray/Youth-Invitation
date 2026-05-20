'use client';

import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import { TemplateProps } from './types';

// Inline SVG ornament components
function OrnamentDivider({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 6 Q15 0 30 6 Q45 12 60 6" stroke={color} strokeWidth="1" fill="none" opacity="0.7" />
        <circle cx="30" cy="6" r="2" fill={color} opacity="0.9" />
      </svg>
      <span style={{ color, fontSize: '1.1rem', opacity: 0.9 }}>✦</span>
      <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 6 Q15 12 30 6 Q45 0 60 6" stroke={color} strokeWidth="1" fill="none" opacity="0.7" />
        <circle cx="30" cy="6" r="2" fill={color} opacity="0.9" />
      </svg>
    </div>
  );
}

function CornerOrnament({ color, flip }: { color: string; flip?: boolean }) {
  return (
    <svg
      width="64" height="64" viewBox="0 0 64 64" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, opacity: 0.5 }}
    >
      <path d="M4 4 L4 28 Q4 4 28 4 Z" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M4 4 L20 4" stroke={color} strokeWidth="1.5" />
      <path d="M4 4 L4 20" stroke={color} strokeWidth="1.5" />
      <circle cx="4" cy="4" r="2.5" fill={color} />
      <circle cx="20" cy="4" r="1.5" fill={color} opacity="0.6" />
      <circle cx="4" cy="20" r="1.5" fill={color} opacity="0.6" />
    </svg>
  );
}

function SectionBorder({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-2 justify-center my-4">
      <div style={{ height: '1px', width: '40px', background: `linear-gradient(to right, transparent, ${color})` }} />
      <span style={{ color, fontSize: '0.7rem', letterSpacing: '0.3em' }}>❧</span>
      <div style={{ height: '1px', width: '80px', backgroundColor: color, opacity: 0.6 }} />
      <span style={{ color, fontSize: '0.7rem', letterSpacing: '0.3em' }}>❧</span>
      <div style={{ height: '1px', width: '40px', background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

export default function IslamiElegant({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  const colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  const photos: string[] = JSON.parse(invitation.gallery_photos || '[]');
  const targetDate = invitation.date_akad || invitation.date_resepsi;

  // Use template defaults if colors aren't overridden
  const gold = colors.primary || '#c9a84c';
  const navy = colors.secondary || '#0a1628';
  const cream = colors.accent || '#e8d5a3';

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', backgroundColor: navy, color: cream }}>

      {/* ── Cover ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden"
        style={{ background: `linear-gradient(180deg, #060e1a 0%, ${navy} 40%, #0d1f3c 100%)` }}
      >
        {/* Corner ornaments */}
        <div className="absolute top-4 left-4"><CornerOrnament color={gold} /></div>
        <div className="absolute top-4 right-4"><CornerOrnament color={gold} flip /></div>
        <div className="absolute bottom-4 left-4" style={{ transform: 'scaleY(-1)' }}><CornerOrnament color={gold} /></div>
        <div className="absolute bottom-4 right-4" style={{ transform: 'scale(-1,-1)' }}><CornerOrnament color={gold} flip /></div>

        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${gold}18 0%, transparent 70%)` }}
        />

        {/* Bismillah */}
        <p
          className="text-2xl mb-2 leading-relaxed"
          style={{ color: gold, fontFamily: 'serif', direction: 'rtl' }}
          aria-label="Bismillahirrahmanirrahim"
        >
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>

        <SectionBorder color={gold} />

        <p className="text-xs uppercase tracking-[0.35em] mb-8 mt-2" style={{ color: `${cream}99` }}>
          Undangan Pernikahan
        </p>

        {/* Names */}
        <h1
          className="text-5xl md:text-6xl mb-2 leading-tight"
          style={{ color: cream, fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          {invitation.partner_name}
        </h1>
        <p className="text-4xl my-3" style={{ color: gold }}>✦</p>
        <h1
          className="text-5xl md:text-6xl mb-8 leading-tight"
          style={{ color: cream, fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          {invitation.partner_name2}
        </h1>

        <OrnamentDivider color={gold} />

        <p className="text-sm mb-10 max-w-xs leading-relaxed" style={{ color: `${cream}bb` }}>
          {invitation.quote || 'Assalamualaikum Warahmatullahi Wabarakatuh'}
        </p>

        {/* Countdown */}
        {targetDate && (
          <div className="w-full max-w-xs">
            <Countdown targetDate={targetDate} primaryColor={gold} accentColor={cream} />
          </div>
        )}

        <div className="mt-14 text-xl animate-bounce" style={{ color: `${gold}88` }} aria-hidden="true">↓</div>
      </section>

      {/* ── Couple Info ── */}
      {(invitation.parent_name || invitation.parent_name2) && (
        <section
          className="py-20 px-6 text-center"
          style={{ background: `linear-gradient(180deg, ${navy} 0%, #0d1f3c 100%)` }}
        >
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: `${gold}99` }}>
            Mempelai
          </p>
          <OrnamentDivider color={gold} />

          <div className="max-w-sm mx-auto space-y-10 mt-6">
            {invitation.parent_name && (
              <div
                className="p-6 rounded-2xl"
                style={{ border: `1px solid ${gold}33`, background: `${gold}08` }}
              >
                {/* Decorative top */}
                <div className="flex justify-center mb-4">
                  <span style={{ color: gold, fontSize: '1.5rem' }}>☽</span>
                </div>
                <h2 className="text-2xl mb-1" style={{ color: cream }}>{invitation.partner_name}</h2>
                <p className="text-sm mt-2" style={{ color: `${cream}99` }}>
                  Putra dari
                </p>
                <p className="text-base mt-1" style={{ color: `${cream}cc` }}>{invitation.parent_name}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <div style={{ height: '1px', flex: 1, backgroundColor: `${gold}44` }} />
              <span style={{ color: gold, fontSize: '1.4rem' }}>✦</span>
              <div style={{ height: '1px', flex: 1, backgroundColor: `${gold}44` }} />
            </div>

            {invitation.parent_name2 && (
              <div
                className="p-6 rounded-2xl"
                style={{ border: `1px solid ${gold}33`, background: `${gold}08` }}
              >
                <div className="flex justify-center mb-4">
                  <span style={{ color: gold, fontSize: '1.5rem' }}>☽</span>
                </div>
                <h2 className="text-2xl mb-1" style={{ color: cream }}>{invitation.partner_name2}</h2>
                <p className="text-sm mt-2" style={{ color: `${cream}99` }}>
                  Putri dari
                </p>
                <p className="text-base mt-1" style={{ color: `${cream}cc` }}>{invitation.parent_name2}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Ayat Quran ── */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: `linear-gradient(180deg, #0d1f3c 0%, #091525 100%)` }}
      >
        <div className="max-w-sm mx-auto">
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: `${gold}99` }}>
            Firman Allah ﷻ
          </p>
          <OrnamentDivider color={gold} />
          <div
            className="p-6 rounded-2xl mt-4"
            style={{ border: `1px solid ${gold}44`, background: `${gold}0a` }}
          >
            <p
              className="text-xl leading-loose mb-4"
              style={{ color: cream, direction: 'rtl', fontFamily: 'serif' }}
            >
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
            </p>
            <div style={{ height: '1px', backgroundColor: `${gold}33` }} className="my-3" />
            <p className="text-sm leading-relaxed italic" style={{ color: `${cream}cc` }}>
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri."
            </p>
            <p className="text-xs mt-3" style={{ color: gold }}>QS. Ar-Rum: 21</p>
          </div>
        </div>
      </section>

      {/* ── Akad ── */}
      {(invitation.date_akad || invitation.time_akad) && (
        <section
          className="py-20 px-6 text-center"
          style={{ background: `linear-gradient(180deg, #091525 0%, ${navy} 100%)` }}
        >
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: `${gold}99` }}>
            Akad Nikah
          </p>
          <OrnamentDivider color={gold} />

          <div
            className="max-w-xs mx-auto mt-6 p-8 rounded-2xl"
            style={{ border: `1px solid ${gold}55`, background: `${gold}0d` }}
          >
            <div className="text-3xl mb-4" style={{ color: gold }}>🕌</div>
            {invitation.date_akad && (
              <p className="text-xl font-semibold mb-3 leading-snug" style={{ color: cream }}>
                {formatDate(invitation.date_akad)}
              </p>
            )}
            {invitation.time_akad && (
              <p className="text-base" style={{ color: `${cream}cc` }}>
                Pukul {invitation.time_akad} WIB
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Resepsi ── */}
      {(invitation.date_resepsi || invitation.time_resepsi) && (
        <section
          className="py-20 px-6 text-center"
          style={{ background: `linear-gradient(180deg, ${navy} 0%, #0d1f3c 100%)` }}
        >
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: `${gold}99` }}>
            Resepsi Pernikahan
          </p>
          <OrnamentDivider color={gold} />

          <div
            className="max-w-xs mx-auto mt-6 p-8 rounded-2xl"
            style={{ border: `1px solid ${gold}55`, background: `${gold}0d` }}
          >
            <div className="text-3xl mb-4" style={{ color: gold }}>🌙</div>
            {invitation.date_resepsi && (
              <p className="text-xl font-semibold mb-3 leading-snug" style={{ color: cream }}>
                {formatDate(invitation.date_resepsi)}
              </p>
            )}
            {invitation.time_resepsi && (
              <p className="text-base" style={{ color: `${cream}cc` }}>
                Pukul {invitation.time_resepsi} WIB
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Lokasi ── */}
      {invitation.location && (
        <section
          className="py-20 px-6 text-center"
          style={{ background: `linear-gradient(180deg, #0d1f3c 0%, #091525 100%)` }}
        >
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: `${gold}99` }}>
            Lokasi
          </p>
          <OrnamentDivider color={gold} />

          <div className="max-w-sm mx-auto mt-6">
            <div className="text-3xl mb-4" style={{ color: gold }}>📍</div>
            <p className="text-xl font-semibold mb-3" style={{ color: cream }}>
              {invitation.location}
            </p>
            {invitation.address && (
              <p className="text-sm leading-relaxed mb-8" style={{ color: `${cream}99` }}>
                {invitation.address}
              </p>
            )}
            {invitation.maps_url && (
              <a
                href={invitation.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
                style={{ backgroundColor: gold, color: navy }}
              >
                Buka Google Maps
              </a>
            )}
          </div>
        </section>
      )}

      {/* ── Love Story ── */}
      {invitation.story && (
        <section
          className="py-20 px-6 text-center"
          style={{ background: `linear-gradient(180deg, #091525 0%, ${navy} 100%)` }}
        >
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: `${gold}99` }}>
            Kisah Kami
          </p>
          <OrnamentDivider color={gold} />

          <div
            className="max-w-sm mx-auto mt-6 p-6 rounded-2xl"
            style={{ border: `1px solid ${gold}33`, background: `${gold}08` }}
          >
            <p className="text-3xl mb-4" style={{ color: gold }}>❤</p>
            <p className="text-sm leading-relaxed italic" style={{ color: `${cream}cc` }}>
              "{invitation.story}"
            </p>
          </div>
        </section>
      )}

      {/* ── Galeri ── */}
      {photos.length > 0 && (
        <section
          className="py-20 px-6"
          style={{ background: `linear-gradient(180deg, ${navy} 0%, #0d1f3c 100%)` }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: `${gold}99` }}>
            Galeri
          </p>
          <OrnamentDivider color={gold} />

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mt-6">
            {photos.map((url, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden"
                style={{ border: `1px solid ${gold}44` }}
              >
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── RSVP ── */}
      <section
        className="py-20 px-6"
        style={{ background: `linear-gradient(180deg, #0d1f3c 0%, #091525 100%)` }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: `${gold}99` }}>
          Konfirmasi Kehadiran
        </p>
        <OrnamentDivider color={gold} />

        <div className="mt-6">
          <RsvpSection
            guests={guests}
            onSubmit={onRsvpSubmit}
            rsvpStatus={rsvpStatus}
            rsvpError={rsvpError}
            primaryColor={gold}
            accentColor={cream}
            bgColor={`${navy}cc`}
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-16 px-6 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(180deg, #091525 0%, #040c18 100%)` }}
      >
        {/* Corner ornaments */}
        <div className="absolute top-4 left-4"><CornerOrnament color={gold} /></div>
        <div className="absolute top-4 right-4"><CornerOrnament color={gold} flip /></div>

        <p className="text-xs uppercase tracking-[0.35em] mb-4" style={{ color: `${gold}88` }}>
          Jazakumullahu Khairan
        </p>
        <OrnamentDivider color={gold} />

        <p
          className="text-4xl mt-4 mb-2"
          style={{ color: cream, fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          {invitation.partner_name}
        </p>
        <p className="text-2xl my-2" style={{ color: gold }}>✦</p>
        <p
          className="text-4xl mb-8"
          style={{ color: cream, fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          {invitation.partner_name2}
        </p>

        <p className="text-xs leading-relaxed" style={{ color: `${cream}66` }}>
          Terima kasih atas doa dan kehadiran Anda
        </p>
        <p className="text-xs mt-2" style={{ color: `${gold}66` }}>
          بَارَكَ اللهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا
        </p>
      </footer>
    </div>
  );
}
