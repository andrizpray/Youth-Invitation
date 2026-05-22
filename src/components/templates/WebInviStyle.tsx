'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import ScrollToTop from './ScrollToTop';
import { TemplateProps } from './types';

export default function WebInviStyle({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#c9a84c', secondary: '#fffdf5', accent: '#7c6124' };
  }
  let photos: string[];
  try {
    photos = JSON.parse(invitation.gallery_photos || '[]') as string[];
  } catch {
    photos = [];
  }

  const [opened, setOpened] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [storyTimeline, setStoryTimeline] = useState<any[] | null>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(invitation.story || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) setStoryTimeline(parsed);
    } catch {}
  }, [invitation.story]);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(null), 2000);
    });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => scrollTo('section-bismillah'), 500);
    if (invitation.music_url && audioRef.current) {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else { audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {}); }
  };

  const targetDate = invitation.date_akad || invitation.date_resepsi;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const DARK_BG = '#1a1208';
  const GOLD = colors.primary;
  const WHITE = '#ffffff';

  return (
    <div style={{ fontFamily: '"Playfair Display", serif', color: colors.accent, backgroundColor: colors.secondary, paddingBottom: '80px' }}>
      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* ===== COVER OVERLAY ===== */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ background: `linear-gradient(180deg, ${DARK_BG} 0%, ${colors.accent}f0 60%, ${DARK_BG} 100%)` }}
      >
        {/* Gold lines top & bottom */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

        {/* Corner brackets */}
        <div className="absolute top-10 left-10 w-20 h-20 opacity-50" style={{ borderTop: `2px solid ${GOLD}99`, borderLeft: `2px solid ${GOLD}99` }} />
        <div className="absolute top-10 right-10 w-20 h-20 opacity-50" style={{ borderTop: `2px solid ${GOLD}99`, borderRight: `2px solid ${GOLD}99` }} />
        <div className="absolute bottom-10 left-10 w-20 h-20 opacity-50" style={{ borderBottom: `2px solid ${GOLD}99`, borderLeft: `2px solid ${GOLD}99` }} />
        <div className="absolute bottom-10 right-10 w-20 h-20 opacity-50" style={{ borderBottom: `2px solid ${GOLD}99`, borderRight: `2px solid ${GOLD}99` }} />

        {/* Decorative diamonds at corners */}
        <div className="absolute top-[calc(10px+5rem)] left-10 w-2 h-2 rotate-45 opacity-60" style={{ backgroundColor: GOLD }} />
        <div className="absolute top-[calc(10px+5rem)] right-10 w-2 h-2 rotate-45 opacity-60" style={{ backgroundColor: GOLD }} />
        <div className="absolute bottom-[calc(10px+5rem)] left-10 w-2 h-2 rotate-45 opacity-60" style={{ backgroundColor: GOLD }} />
        <div className="absolute bottom-[calc(10px+5rem)] right-10 w-2 h-2 rotate-45 opacity-60" style={{ backgroundColor: GOLD }} />

        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <p className="text-xs uppercase tracking-[0.5em] mb-8 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]" style={{ color: GOLD }}>The Wedding Of</p>

          <h1 className="text-5xl md:text-6xl text-white mb-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ fontFamily: '"Great Vibes", cursive', letterSpacing: '0.02em' }}>
            {invitation.partner_name}
          </h1>
          <p className="text-3xl my-3 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]" style={{ color: GOLD, fontFamily: '"Great Vibes", cursive' }}>&</p>
          <h1 className="text-5xl md:text-6xl text-white mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ fontFamily: '"Great Vibes", cursive', letterSpacing: '0.02em' }}>
            {invitation.partner_name2}
          </h1>

          {targetDate && (
            <p className="text-white/60 text-sm tracking-[0.3em] mb-14 uppercase opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]" style={{ fontFamily: '"Inter", sans-serif' }}>
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <button
            type="button"
            onClick={handleOpen}
            className="px-12 py-3.5 text-sm font-semibold tracking-[0.4em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{
              background: 'transparent',
              color: GOLD,
              border: `1.5px solid ${GOLD}`,
              letterSpacing: '0.4em',
            }}
          >
            ✉ Buka Undangan
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 text-white/30 text-xs tracking-[0.2em] opacity-0 animate-[fadeIn_0.8s_ease-out_0.8s_forwards]">
          — Scroll —
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className={opened ? '' : 'hidden'}>

        {/* SECTION: Bismillah + Ayat + Countdown */}
        <section id="section-bismillah" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${colors.accent} 0%, ${colors.accent}dd 60%, ${GOLD}22 100%)` }}
        >
          <ScrollReveal className="flex flex-col items-center max-w-md">
            <p className="text-white/70 text-lg mb-2" style={{ fontFamily: '"Amiri", serif' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            <p className="text-white/50 text-xs uppercase tracking-[0.4em] mb-10">Bismillahirrahmanirrahim</p>

            <p className="text-white/80 text-sm leading-relaxed mb-2 italic">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
            </p>
            <p className="text-white/50 text-xs mb-10">(QS. Ar-Rum : 21)</p>

            {invitation.quote && (
              <p className="text-white/70 text-sm mb-8">{invitation.quote}</p>
            )}

            {targetDate && (
              <Countdown targetDate={targetDate} primaryColor={GOLD} accentColor="#ffffff88" />
            )}
          </ScrollReveal>

          {/* Ornament divider */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <div className="w-12 h-px" style={{ backgroundColor: `${GOLD}66` }} />
            <span className="text-sm" style={{ color: GOLD }}>✦ ✦ ✦</span>
            <div className="w-12 h-px" style={{ backgroundColor: `${GOLD}66` }} />
          </div>
        </section>

        {/* SECTION: Bride & Groom */}
        {(invitation.parent_name || invitation.parent_name2) && (
          <section id="section-couple" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center"
            style={{ backgroundColor: colors.secondary }}
          >
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: GOLD }}>Bride &amp; Groom</p>
              <div className="w-16 h-px mx-auto mb-12" style={{ backgroundColor: GOLD }} />

              <div className="flex flex-col sm:flex-row gap-8 max-w-2xl mx-auto">
                {/* Pria */}
                <div className="flex-1 p-8 rounded-sm" style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${GOLD}33`,
                  boxShadow: `0 4px 24px ${GOLD}15`,
                }}>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden" style={{ border: `2px solid ${GOLD}44` }}>
                    {photos[0] ? (
                      <img src={photos[0]} alt={invitation.partner_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${GOLD}22`, color: GOLD }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                    )}
                  </div>
                  <p className="text-2xl mb-1" style={{ fontFamily: '"Great Vibes", cursive', color: colors.accent }}>{invitation.partner_name}</p>
                  {invitation.parent_name && (
                    <p className="text-xs opacity-70">Putra dari {invitation.parent_name}</p>
                  )}
                </div>

                {/* Wanita */}
                <div className="flex-1 p-8 rounded-sm" style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${GOLD}33`,
                  boxShadow: `0 4px 24px ${GOLD}15`,
                }}>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden" style={{ border: `2px solid ${GOLD}44` }}>
                    {photos[1] ? (
                      <img src={photos[1]} alt={invitation.partner_name2} className="w-full h-full object-cover" />
                    ) : photos[0] ? (
                      <img src={photos[0]} alt={invitation.partner_name2} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${GOLD}22`, color: GOLD }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                    )}
                  </div>
                  <p className="text-2xl mb-1" style={{ fontFamily: '"Great Vibes", cursive', color: colors.accent }}>{invitation.partner_name2}</p>
                  {invitation.parent_name2 && (
                    <p className="text-xs opacity-70">Putri dari {invitation.parent_name2}</p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* SECTION: Event Details */}
        <section id="section-event" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center"
          style={{ background: `linear-gradient(180deg, ${colors.accent}08 0%, ${colors.secondary} 100%)` }}
        >
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: GOLD }}>Acara Pernikahan</p>
            <div className="w-16 h-px mx-auto mb-12" style={{ backgroundColor: GOLD }} />

            <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
              {/* Akad */}
              {invitation.date_akad && (
                <div className="flex-1 p-8 rounded-sm text-left" style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${GOLD}33`,
                  boxShadow: `0 4px 24px ${GOLD}12`,
                }}>
                  <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: GOLD }}>Akad Nikah</p>
                  <div className="w-10 h-px mb-4" style={{ backgroundColor: GOLD }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: colors.accent }}>
                    {formatDate(invitation.date_akad)}
                  </p>
                  {invitation.time_akad && <p className="text-sm opacity-70 mb-1">Pukul {invitation.time_akad} WIB</p>}
                  {invitation.location && <p className="text-sm opacity-70">{invitation.location}</p>}
                  {invitation.maps_url && (
                    <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 px-5 py-2 text-xs uppercase tracking-[0.2em] transition-all hover:opacity-80"
                      style={{ color: GOLD, border: `1px solid ${GOLD}` }}
                    >
                      📍 Lihat Lokasi
                    </a>
                  )}
                </div>
              )}

              {/* Resepsi */}
              {invitation.date_resepsi && (
                <div className="flex-1 p-8 rounded-sm text-left" style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${GOLD}33`,
                  boxShadow: `0 4px 24px ${GOLD}12`,
                }}>
                  <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: GOLD }}>Resepsi</p>
                  <div className="w-10 h-px mb-4" style={{ backgroundColor: GOLD }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: colors.accent }}>
                    {formatDate(invitation.date_resepsi)}
                  </p>
                  {invitation.time_resepsi && <p className="text-sm opacity-70 mb-1">Pukul {invitation.time_resepsi} WIB</p>}
                  {invitation.location && <p className="text-sm opacity-70">{invitation.location}</p>}
                  {invitation.maps_url && (
                    <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 px-5 py-2 text-xs uppercase tracking-[0.2em] transition-all hover:opacity-80"
                      style={{ color: GOLD, border: `1px solid ${GOLD}` }}
                    >
                      📍 Lihat Lokasi
                    </a>
                  )}
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>

        {/* SECTION: Gallery */}
        {photos.length > 0 && (
          <section id="section-gallery" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center"
            style={{ backgroundColor: colors.secondary }}
          >
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: GOLD }}>Wedding Gallery</p>
              <div className="w-16 h-px mx-auto mb-10" style={{ backgroundColor: GOLD }} />
            </ScrollReveal>
            <div className="grid grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto w-full px-4">
              {photos.map((photo, idx) => (
                <ScrollReveal key={idx}>
                  <div
                    className="aspect-[3/4] overflow-hidden cursor-pointer group"
                    style={{ border: `1px solid ${GOLD}33` }}
                    onClick={() => setLightboxImg(photo)}
                  >
                    <img src={photo} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: Love Story */}
        {invitation.story && (
          <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center"
            style={{ background: `linear-gradient(180deg, ${colors.accent}08 0%, ${colors.secondary} 100%)` }}
          >
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: GOLD }}>Love Story</p>
              <div className="w-16 h-px mx-auto mb-12" style={{ backgroundColor: GOLD }} />
            </ScrollReveal>

            <div className="max-w-lg mx-auto w-full px-4">
              {storyTimeline ? (
                storyTimeline.map((item, idx) => (
                  <ScrollReveal key={idx}>
                    <div className="flex gap-6 mb-10 text-left">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: GOLD }} />
                        {idx < storyTimeline.length - 1 && (
                          <div className="w-px flex-1 mt-1" style={{ backgroundColor: `${GOLD}44` }} />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-xs opacity-60 mb-1">{item.date || ''}</p>
                        <p className="text-lg font-semibold mb-2" style={{ fontFamily: '"Great Vibes", cursive', color: colors.accent }}>
                          {item.title || ''}
                        </p>
                        <p className="text-sm opacity-80 leading-relaxed">{item.description || ''}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))
              ) : (
                <ScrollReveal>
                  <p className="text-sm opacity-80 leading-relaxed italic max-w-sm mx-auto">{invitation.story}</p>
                </ScrollReveal>
              )}
            </div>
          </section>
        )}

        {/* SECTION: Wedding Gift */}
        <section className="py-24 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: GOLD }}>Wedding Gift</p>
            <div className="w-16 h-px mx-auto mb-4" style={{ backgroundColor: GOLD }} />
            <p className="text-sm opacity-70 mb-10 max-w-xs mx-auto">
              Doa restu Anda merupakan hadiah terindah bagi kami. Jika ingin memberi tanda kasih, dapat melalui:
            </p>
          </ScrollReveal>

          <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto px-4">
            {/* BCA */}
            <ScrollReveal>
              <div className="p-6 rounded-sm text-left" style={{
                backgroundColor: WHITE,
                border: `1px solid ${GOLD}33`,
                boxShadow: `0 4px 24px ${GOLD}12`,
              }}>
                <p className="text-sm font-semibold mb-1" style={{ color: colors.accent }}>BCA</p>
                <p className="text-xs opacity-60 mb-1">a.n. {invitation.partner_name} &amp; {invitation.partner_name2}</p>
                <p className="text-lg tracking-wider" style={{ color: GOLD }}>123 456 7890</p>
                <button
                  type="button"
                  onClick={() => handleCopy('1234567890', 'bca')}
                  className="mt-3 px-4 py-1.5 text-xs transition-all hover:opacity-80"
                  style={{ color: GOLD, border: `1px solid ${GOLD}66` }}
                >
                  {copied === 'bca' ? '✓ Tersalin' : '📋 Salin Rekening'}
                </button>
              </div>
            </ScrollReveal>

            {/* Mandiri */}
            <ScrollReveal>
              <div className="p-6 rounded-sm text-left" style={{
                backgroundColor: WHITE,
                border: `1px solid ${GOLD}33`,
                boxShadow: `0 4px 24px ${GOLD}12`,
              }}>
                <p className="text-sm font-semibold mb-1" style={{ color: colors.accent }}>Mandiri</p>
                <p className="text-xs opacity-60 mb-1">a.n. {invitation.partner_name} &amp; {invitation.partner_name2}</p>
                <p className="text-lg tracking-wider" style={{ color: GOLD }}>987 654 3210</p>
                <button
                  type="button"
                  onClick={() => handleCopy('9876543210', 'mandiri')}
                  className="mt-3 px-4 py-1.5 text-xs transition-all hover:opacity-80"
                  style={{ color: GOLD, border: `1px solid ${GOLD}66` }}
                >
                  {copied === 'mandiri' ? '✓ Tersalin' : '📋 Salin Rekening'}
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* SECTION: RSVP / Wishes */}
        <section id="section-wishes" className="py-24 px-6 text-center"
          style={{ background: `linear-gradient(180deg, ${colors.accent}08 0%, ${colors.secondary} 100%)` }}
        >
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: GOLD }}>R.S.V.P</p>
            <div className="w-16 h-px mx-auto mb-10" style={{ backgroundColor: GOLD }} />
          </ScrollReveal>
          <RsvpSection
            guests={guests}
            onSubmit={onRsvpSubmit}
            rsvpStatus={rsvpStatus}
            rsvpError={rsvpError}
            primaryColor={GOLD}
            accentColor={colors.accent}
            bgColor={colors.secondary}
          />
        </section>

        {/* SECTION: Footer */}
        <footer className="py-16 px-6 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${colors.accent} 0%, ${DARK_BG} 100%)` }}
        >
          <p className="text-white/60 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
            Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.
          </p>

          <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-3">The Wedding of</p>
          <p className="text-3xl text-white mb-2" style={{ fontFamily: '"Great Vibes", cursive', color: GOLD }}>
            {invitation.partner_name} &amp; {invitation.partner_name2}
          </p>
          <p className="text-white/30 text-xs mt-8">© 2025 — Made with Love</p>
        </footer>

        {/* Floating Music Button */}
        {invitation.music_url && (
          <button
            type="button"
            onClick={toggleMusic}
            className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            style={{ backgroundColor: GOLD, color: DARK_BG }}
          >
            {musicPlaying ? '🔊' : '🔇'}
          </button>
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t"
          style={{ backgroundColor: `${colors.accent}dd`, borderColor: `${GOLD}33` }}
        >
          <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
            {[
              { id: 'section-bismillah', icon: '⌂', label: 'Home' },
              { id: 'section-couple', icon: '♡', label: 'Couple' },
              { id: 'section-event', icon: '◷', label: 'Event' },
              { id: 'section-gallery', icon: '◱', label: 'Gallery' },
              { id: 'section-wishes', icon: '✉', label: 'Wishes' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all hover:opacity-80"
              >
                <span className="text-lg" style={{ color: GOLD }}>{item.icon}</span>
                <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: `${GOLD}cc` }}>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Lightbox */}
        {lightboxImg && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            <img src={lightboxImg} alt="Gallery" className="max-w-full max-h-full object-contain" />
          </div>
        )}

        <ScrollToTop primaryColor={GOLD} />

      </div>
    </div>
  );
}
