'use client';

import { useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import ScrollToTop from './ScrollToTop';
import { TemplateProps } from './types';

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
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#c9a84c', secondary: '#0a1628', accent: '#e8d5a3' };
  }
  let photos: string[];
  try {
    photos = JSON.parse(invitation.gallery_photos || '[]') as string[];
  } catch {
    photos = [];
  }

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const targetDate = invitation.date_akad || invitation.date_resepsi;

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
        <div className="absolute top-4 left-4"><CornerOrnament color={gold} /></div>
        <div className="absolute top-4 right-4"><CornerOrnament color={gold} flip /></div>
        <div className="absolute bottom-4 left-4" style={{ transform: 'scaleY(-1)' }}><CornerOrnament color={gold} /></div>
        <div className="absolute bottom-4 right-4" style={{ transform: 'scale(-1,-1)' }}><CornerOrnament color={gold} flip /></div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${gold}18 0%, transparent 70%)` }}
        />

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

        <h1
          className="text-5xl md:text-6xl mb-2 leading-tight"
          style={{ color: cream, fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          {invitation.partner_name}
        </h1>
        <p className="text-4xl my-3" style={{ color: gold }}>✦</p>
        <h2
          className="text-5xl md:text-6xl mb-8 leading-tight"
          style={{ color: cream, fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          {invitation.partner_name2}
        </h2>

        <OrnamentDivider color={gold} />

        <p className="text-sm mb-10 max-w-xs leading-relaxed" style={{ color: `${cream}bb` }}>
          {invitation.quote || 'Assalamualaikum Warahmatullahi Wabarakatuh'}
        </p>

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
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: `${gold}99` }}>
              Mempelai
            </p>
            <OrnamentDivider color={gold} />

            <div className="max-w-sm mx-auto space-y-10 mt-6">
              {invitation.parent_name && (
                <div
                  className="p-6 rounded-2xl"
                  style={{ border: `1px solid ${gold}33`, background: `${gold}08`, boxShadow: `0 8px 32px ${gold}14` }}
                >
                  <div className="flex justify-center mb-4">
                    <span style={{ color: gold, fontSize: '1.5rem' }}>☽</span>
                  </div>
                  <h2 className="text-2xl mb-1" style={{ color: cream }}>{invitation.partner_name}</h2>
                  <p className="text-sm mt-2" style={{ color: `${cream}99` }}>Putra dari</p>
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
                  style={{ border: `1px solid ${gold}33`, background: `${gold}08`, boxShadow: `0 8px 32px ${gold}14` }}
                >
                  <div className="flex justify-center mb-4">
                    <span style={{ color: gold, fontSize: '1.5rem' }}>☽</span>
                  </div>
                  <h2 className="text-2xl mb-1" style={{ color: cream }}>{invitation.partner_name2}</h2>
                  <p className="text-sm mt-2" style={{ color: `${cream}99` }}>Putri dari</p>
                  <p className="text-base mt-1" style={{ color: `${cream}cc` }}>{invitation.parent_name2}</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── Ayat Quran ── */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: `linear-gradient(180deg, #0d1f3c 0%, #091525 100%)` }}
      >
        <ScrollReveal>
          <div className="max-w-sm mx-auto">
            <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: `${gold}99` }}>
              Firman Allah ﷻ
            </p>
            <OrnamentDivider color={gold} />
            <div
              className="p-6 rounded-2xl mt-4"
              style={{ border: `1px solid ${gold}44`, background: `${gold}0a`, boxShadow: `0 8px 32px ${gold}10` }}
            >
              <p
                className="text-xl leading-loose mb-4"
                style={{ color: cream, direction: 'rtl', fontFamily: 'serif' }}
              >
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
              </p>
              <div style={{ height: '1px', backgroundColor: `${gold}33` }} className="my-3" />
              <p className="text-sm leading-relaxed italic" style={{ color: `${cream}cc` }}>
                &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.&rdquo;
              </p>
              <p className="text-xs mt-3" style={{ color: gold }}>QS. Ar-Rum: 21</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Akad ── */}
      {(invitation.date_akad || invitation.time_akad) && (
        <section
          className="py-20 px-6 text-center"
          style={{ background: `linear-gradient(180deg, #091525 0%, ${navy} 100%)` }}
        >
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: `${gold}99` }}>
              Akad Nikah
            </p>
            <OrnamentDivider color={gold} />

            <div
              className="max-w-xs mx-auto mt-6 p-8 rounded-2xl"
              style={{ border: `1px solid ${gold}55`, background: `${gold}0d`, boxShadow: `0 8px 40px ${gold}14` }}
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
          </ScrollReveal>
        </section>
      )}

      {/* ── Resepsi ── */}
      {(invitation.date_resepsi || invitation.time_resepsi) && (
        <section
          className="py-20 px-6 text-center"
          style={{ background: `linear-gradient(180deg, ${navy} 0%, #0d1f3c 100%)` }}
        >
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: `${gold}99` }}>
              Resepsi Pernikahan
            </p>
            <OrnamentDivider color={gold} />

            <div
              className="max-w-xs mx-auto mt-6 p-8 rounded-2xl"
              style={{ border: `1px solid ${gold}55`, background: `${gold}0d`, boxShadow: `0 8px 40px ${gold}14` }}
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
          </ScrollReveal>
        </section>
      )}

      {/* ── Lokasi ── */}
      {invitation.location && (
        <section
          className="py-20 px-6 text-center"
          style={{ background: `linear-gradient(180deg, #0d1f3c 0%, #091525 100%)` }}
        >
          <ScrollReveal>
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
                  className="inline-flex items-center gap-2 px-6 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: gold, color: navy, minHeight: '48px' }}
                >
                  Buka Google Maps
                </a>
              )}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── Love Story ── */}
      {invitation.story && (
        <section
          className="py-20 px-6 text-center"
          style={{ background: `linear-gradient(180deg, #091525 0%, ${navy} 100%)` }}
        >
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: `${gold}99` }}>
              Kisah Kami
            </p>
            <OrnamentDivider color={gold} />

            <div
              className="max-w-sm mx-auto mt-6 p-6 rounded-2xl"
              style={{ border: `1px solid ${gold}33`, background: `${gold}08`, boxShadow: `0 8px 32px ${gold}10` }}
            >
              <p className="text-3xl mb-4" style={{ color: gold }}>❤</p>
              <p className="text-sm leading-relaxed italic" style={{ color: `${cream}cc` }}>
                &ldquo;{invitation.story}&rdquo;
              </p>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── Galeri ── */}
      {photos.length > 0 && (
        <section
          className="py-20 px-6"
          style={{ background: `linear-gradient(180deg, ${navy} 0%, #0d1f3c 100%)` }}
        >
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: `${gold}99` }}>
              Galeri
            </p>
            <OrnamentDivider color={gold} />

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mt-6">
              {photos.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxImg(url)}
                  className="aspect-square rounded-xl overflow-hidden gallery-item cursor-zoom-in block"
                  style={{ border: `1px solid ${gold}44` }}
                  aria-label={`Lihat foto ${i + 1}`}
                >
                  <img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover gallery-img"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── RSVP ── */}
      <section
        className="py-20 px-6"
        style={{ background: `linear-gradient(180deg, #0d1f3c 0%, #091525 100%)` }}
      >
        <ScrollReveal>
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
        </ScrollReveal>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-16 px-6 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(180deg, #091525 0%, #040c18 100%)` }}
      >
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

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.94)' }}
          onClick={() => setLightboxImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Foto galeri"
        >
          <img
            src={lightboxImg}
            alt="Foto"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
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

      <ScrollToTop primaryColor={gold} />
    </div>
  );
}
