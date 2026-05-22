'use client';

import { useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import ScrollToTop from './ScrollToTop';
import { TemplateProps } from './types';

function ThinRule({ color }: { color: string }) {
  return <div style={{ height: '1px', backgroundColor: color, opacity: 0.2 }} className="w-full my-8" />;
}

function SmallDiamond({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="0.5" width="6.36" height="6.36" rx="0.5" transform="rotate(45 5 0.5)" fill={color} opacity="0.5" />
    </svg>
  );
}

function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex items-center gap-3 justify-center mb-10">
      <SmallDiamond color={color} />
      <p className="text-xs uppercase tracking-[0.4em]" style={{ color }}>
        {text}
      </p>
      <SmallDiamond color={color} />
    </div>
  );
}

function TimelineItem({
  label,
  date,
  time,
  isLast,
  accentColor,
  textColor,
  mutedColor,
}: {
  label: string;
  date?: string | null;
  time?: string | null;
  isLast?: boolean;
  accentColor: string;
  textColor: string;
  mutedColor: string;
}) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div
          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
          style={{ backgroundColor: accentColor, border: `2px solid ${accentColor}` }}
        />
        {!isLast && (
          <div style={{ width: '1px', flex: 1, backgroundColor: accentColor, opacity: 0.2, minHeight: '48px' }} />
        )}
      </div>
      <div className="pb-10">
        <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: mutedColor }}>{label}</p>
        {date && (
          <p className="text-lg font-light leading-snug mb-1" style={{ color: textColor }}>
            {formatDate(date)}
          </p>
        )}
        {time && (
          <p className="text-sm" style={{ color: mutedColor }}>Pukul {time} WIB</p>
        )}
      </div>
    </div>
  );
}

export default function ModernMinimal({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#2d2d2d', secondary: '#f8f8f8', accent: '#888888' };
  }
  let photos: string[];
  try {
    photos = JSON.parse(invitation.gallery_photos || '[]') as string[];
  } catch {
    photos = [];
  }

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const targetDate = invitation.date_akad || invitation.date_resepsi;

  const nearBlack = colors.primary || '#2d2d2d';
  const offWhite  = colors.secondary || '#f8f8f8';
  const gray      = colors.accent || '#888888';

  const hasAkad     = !!(invitation.date_akad || invitation.time_akad);
  const hasResepsi  = !!(invitation.date_resepsi || invitation.time_resepsi);
  const hasTimeline = hasAkad || hasResepsi;

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif', backgroundColor: offWhite, color: nearBlack }}>

      {/* ── Cover ── */}
      <section
        className="min-h-screen flex flex-col items-center justify-center px-8 text-center relative overflow-hidden"
        style={{ backgroundColor: nearBlack }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="0.5" opacity="0.04" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="0.5" opacity="0.04" />
            <rect x="10%" y="10%" width="80%" height="80%" stroke="white" strokeWidth="0.5" fill="none" opacity="0.04" />
          </svg>
        </div>

        <p
          className="text-xs uppercase tracking-[0.5em] mb-12"
          style={{ color: `${offWhite}55` }}
        >
          Wedding Invitation
        </p>

        <h1
          className="font-extralight mb-3 leading-none"
          style={{ color: offWhite, fontSize: 'clamp(2.5rem, 10vw, 4rem)', letterSpacing: '-0.02em' }}
        >
          {invitation.partner_name}
        </h1>

        <div className="flex items-center gap-4 my-6 w-full max-w-xs">
          <div style={{ height: '1px', flex: 1, backgroundColor: `${offWhite}33` }} />
          <SmallDiamond color={offWhite} />
          <div style={{ height: '1px', flex: 1, backgroundColor: `${offWhite}33` }} />
        </div>

        <h2
          className="font-extralight mb-12 leading-none"
          style={{ color: offWhite, fontSize: 'clamp(2.5rem, 10vw, 4rem)', letterSpacing: '-0.02em' }}
        >
          {invitation.partner_name2}
        </h2>

        {targetDate && (
          <div
            className="px-6 py-2 mb-12"
            style={{ border: `1px solid ${offWhite}33`, borderRadius: '2px' }}
          >
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: `${offWhite}88` }}>
              {new Date(targetDate).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
        )}

        {targetDate && (
          <div className="w-full max-w-xs">
            <Countdown targetDate={targetDate} primaryColor={offWhite} accentColor={`${offWhite}88`} />
          </div>
        )}

        <div className="mt-16 text-xl animate-bounce" style={{ color: `${offWhite}44` }} aria-hidden="true">↓</div>
      </section>

      {/* ── Couple ── */}
      {(invitation.parent_name || invitation.parent_name2) && (
        <section className="py-24 px-8 text-center" style={{ backgroundColor: offWhite }}>
          <ScrollReveal>
            <SectionLabel text="Mempelai" color={gray} />

            <div className="max-w-sm mx-auto space-y-12">
              {invitation.parent_name && (
                <div>
                  <h2
                    className="font-light mb-2"
                    style={{ color: nearBlack, fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', letterSpacing: '-0.01em' }}
                  >
                    {invitation.partner_name}
                  </h2>
                  <p className="text-sm" style={{ color: gray }}>
                    Putra dari {invitation.parent_name}
                  </p>
                </div>
              )}

              {invitation.parent_name && invitation.parent_name2 && (
                <div className="flex items-center gap-4">
                  <div style={{ height: '1px', flex: 1, backgroundColor: nearBlack, opacity: 0.1 }} />
                  <SmallDiamond color={nearBlack} />
                  <div style={{ height: '1px', flex: 1, backgroundColor: nearBlack, opacity: 0.1 }} />
                </div>
              )}

              {invitation.parent_name2 && (
                <div>
                  <h2
                    className="font-light mb-2"
                    style={{ color: nearBlack, fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', letterSpacing: '-0.01em' }}
                  >
                    {invitation.partner_name2}
                  </h2>
                  <p className="text-sm" style={{ color: gray }}>
                    Putri dari {invitation.parent_name2}
                  </p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── Timeline (Akad + Resepsi) ── */}
      {hasTimeline && (
        <section className="py-24 px-8" style={{ backgroundColor: `${nearBlack}06` }}>
          <ScrollReveal>
            <SectionLabel text="Rangkaian Acara" color={gray} />

            <div className="max-w-sm mx-auto">
              {hasAkad && (
                <TimelineItem
                  label="Akad Nikah"
                  date={invitation.date_akad}
                  time={invitation.time_akad}
                  isLast={!hasResepsi}
                  accentColor={nearBlack}
                  textColor={nearBlack}
                  mutedColor={gray}
                />
              )}
              {hasResepsi && (
                <TimelineItem
                  label="Resepsi Pernikahan"
                  date={invitation.date_resepsi}
                  time={invitation.time_resepsi}
                  isLast
                  accentColor={nearBlack}
                  textColor={nearBlack}
                  mutedColor={gray}
                />
              )}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── Lokasi ── */}
      {invitation.location && (
        <section className="py-24 px-8 text-center" style={{ backgroundColor: offWhite }}>
          <ScrollReveal>
            <SectionLabel text="Lokasi" color={gray} />

            <div className="max-w-sm mx-auto">
              <p
                className="font-light mb-3 leading-snug"
                style={{ color: nearBlack, fontSize: 'clamp(1.4rem, 5vw, 1.8rem)' }}
              >
                {invitation.location}
              </p>
              {invitation.address && (
                <p className="text-sm leading-relaxed mb-8" style={{ color: gray }}>
                  {invitation.address}
                </p>
              )}
              {invitation.maps_url && (
                <a
                  href={invitation.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 text-sm tracking-widest uppercase transition-opacity hover:opacity-80 active:scale-95"
                  style={{
                    color: offWhite,
                    backgroundColor: nearBlack,
                    borderRadius: '2px',
                    letterSpacing: '0.15em',
                    minHeight: '48px',
                  }}
                >
                  Lihat Peta
                </a>
              )}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── Love Story ── */}
      {invitation.story && (
        <section className="py-24 px-8 text-center" style={{ backgroundColor: `${nearBlack}06` }}>
          <ScrollReveal>
            <SectionLabel text="Kisah Kami" color={gray} />

            <div className="max-w-sm mx-auto">
              <p
                className="text-sm leading-loose italic"
                style={{ color: nearBlack, opacity: 0.75 }}
              >
                &ldquo;{invitation.story}&rdquo;
              </p>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── Galeri ── */}
      {photos.length > 0 && (
        <section className="py-24 px-8" style={{ backgroundColor: offWhite }}>
          <ScrollReveal>
            <SectionLabel text="Galeri" color={gray} />

            <div className="max-w-sm mx-auto">
              {photos.length === 1 ? (
                <button
                  type="button"
                  onClick={() => setLightboxImg(photos[0])}
                  className="w-full aspect-video rounded-sm overflow-hidden gallery-item cursor-zoom-in block"
                  style={{ border: `1px solid ${nearBlack}11` }}
                  aria-label="Lihat foto 1"
                >
                  <img src={photos[0]} alt="Foto 1" className="w-full h-full object-cover gallery-img" loading="lazy" />
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setLightboxImg(photos[0])}
                    className="w-full overflow-hidden gallery-item cursor-zoom-in block"
                    style={{ aspectRatio: '16/9', borderRadius: '2px', border: `1px solid ${nearBlack}11` }}
                    aria-label="Lihat foto 1"
                  >
                    <img src={photos[0]} alt="Foto 1" className="w-full h-full object-cover gallery-img" loading="lazy" />
                  </button>
                  {photos.length > 1 && (
                    <div className="grid grid-cols-2 gap-2">
                      {photos.slice(1).map((url, i) => (
                        <button
                          key={i + 1}
                          type="button"
                          onClick={() => setLightboxImg(url)}
                          className="overflow-hidden gallery-item cursor-zoom-in block"
                          style={{
                            aspectRatio: i % 3 === 1 ? '3/4' : '1/1',
                            borderRadius: '2px',
                            border: `1px solid ${nearBlack}11`,
                          }}
                          aria-label={`Lihat foto ${i + 2}`}
                        >
                          <img src={url} alt={`Foto ${i + 2}`} className="w-full h-full object-cover gallery-img" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>
      )}

      <ThinRule color={nearBlack} />

      {/* ── RSVP ── */}
      <section className="py-24 px-8" style={{ backgroundColor: offWhite }}>
        <ScrollReveal>
          <SectionLabel text="Konfirmasi Kehadiran" color={gray} />

          <RsvpSection
            guests={guests}
            onSubmit={onRsvpSubmit}
            rsvpStatus={rsvpStatus}
            rsvpError={rsvpError}
            primaryColor={nearBlack}
            accentColor={nearBlack}
            bgColor={offWhite}
          />
        </ScrollReveal>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-20 px-8 text-center"
        style={{ backgroundColor: nearBlack }}
      >
        <p
          className="text-xs uppercase tracking-[0.5em] mb-8"
          style={{ color: `${offWhite}44` }}
        >
          With Love
        </p>

        <h2
          className="font-extralight leading-none mb-3"
          style={{ color: offWhite, fontSize: 'clamp(2rem, 8vw, 3rem)', letterSpacing: '-0.02em' }}
        >
          {invitation.partner_name}
        </h2>

        <div className="flex items-center gap-4 my-5 max-w-xs mx-auto">
          <div style={{ height: '1px', flex: 1, backgroundColor: `${offWhite}22` }} />
          <SmallDiamond color={offWhite} />
          <div style={{ height: '1px', flex: 1, backgroundColor: `${offWhite}22` }} />
        </div>

        <h2
          className="font-extralight leading-none mb-10"
          style={{ color: offWhite, fontSize: 'clamp(2rem, 8vw, 3rem)', letterSpacing: '-0.02em' }}
        >
          {invitation.partner_name2}
        </h2>

        <p className="text-xs" style={{ color: `${offWhite}33` }}>
          Terima kasih atas doa dan kehadiran Anda
        </p>
      </footer>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightboxImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Foto galeri"
        >
          <img
            src={lightboxImg}
            alt="Foto"
            className="max-w-full max-h-full object-contain shadow-2xl"
            style={{ borderRadius: '2px' }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white text-2xl hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => setLightboxImg(null)}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>
      )}

      <ScrollToTop primaryColor={nearBlack} />
    </div>
  );
}
