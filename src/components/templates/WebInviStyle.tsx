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

  // === EXACT COLORS FROM webinvi.com ===
  const BURGUNDY = '#63343e';       // rgb(99, 52, 62) - primary button/header
  const BEIGE_GOLD = '#e9d8bc';      // rgb(233, 216, 188) - secondary gold
  const CREAM_BG = '#fff9f0';        // rgb(255, 249, 240) - page bg
  const DARK_BROWN = '#522428';      // rgb(82, 36, 40) - dark shade
  const WHITE = '#ffffff';

  return (
    <div style={{ fontFamily: '"Vidaloka", "ABeeZee", sans-serif', color: BURGUNDY, backgroundColor: CREAM_BG, paddingBottom: '80px' }}>
      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* ===== COVER OVERLAY ===== */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ background: `linear-gradient(140deg, #7c5059 0%, ${BURGUNDY} 100%)` }}
      >
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${BEIGE_GOLD}, transparent)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${BEIGE_GOLD}, transparent)` }} />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.5em] mb-8 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]" style={{ color: BEIGE_GOLD, fontFamily: '"ABeeZee", sans-serif' }}>
            The Wedding Of
          </p>

          <h1 className="text-5xl md:text-6xl text-white mb-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ fontFamily: '"Imperial Script", cursive', letterSpacing: '0.02em' }}>
            {invitation.partner_name}
          </h1>
          <p className="text-3xl my-3 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]" style={{ color: BEIGE_GOLD, fontFamily: '"Imperial Script", cursive' }}>&</p>
          <h1 className="text-5xl md:text-6xl text-white mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ fontFamily: '"Imperial Script", cursive', letterSpacing: '0.02em' }}>
            {invitation.partner_name2}
          </h1>

          {targetDate && (
            <p className="text-white/70 text-sm tracking-[0.3em] mb-14 uppercase opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]" style={{ fontFamily: '"ABeeZee", sans-serif' }}>
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <button
            type="button"
            onClick={handleOpen}
            className="px-10 py-3 text-xs font-semibold tracking-[0.4em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{
              background: BEIGE_GOLD,
              color: BURGUNDY,
              border: 'none',
              letterSpacing: '0.4em',
              fontFamily: '"ABeeZee", sans-serif',
            }}
          >
            BUKA UNDANGAN
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 text-white/30 text-xs tracking-[0.2em] opacity-0 animate-[fadeIn_0.8s_ease-out_0.8s_forwards]" style={{ fontFamily: '"ABeeZee", sans-serif' }}>
          — Scroll —
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className={opened ? '' : 'hidden'}>

        {/* SECTION: Bismillah */}
        <section id="section-bismillah" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(140deg, ${BURGUNDY} 0%, ${BURGUNDY}dd 60%, ${BEIGE_GOLD}22 100%)` }}
        >
          <ScrollReveal className="flex flex-col items-center max-w-md">
            <p className="text-white/70 text-lg mb-2" style={{ fontFamily: '"Alike", serif', fontSize: '1.3rem' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            <p className="text-white/50 text-xs uppercase tracking-[0.4em] mb-10">Bismillahirrahmanirrahim</p>

            <p className="text-white/80 text-sm leading-relaxed mb-2 italic">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
            </p>
            <p className="text-white/50 text-xs mb-10">(QS. Ar-Rum : 21)</p>

            {invitation.quote && (
              <p className="text-white/70 text-sm mb-8">{invitation.quote}</p>
            )}

            {targetDate && (
              <Countdown targetDate={targetDate} primaryColor={BEIGE_GOLD} accentColor="#ffffff88" />
            )}
          </ScrollReveal>
        </section>

        {/* SECTION: Bride & Groom */}
        {(invitation.parent_name || invitation.parent_name2) && (
          <section id="section-couple" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center"
            style={{ background: CREAM_BG }}
          >
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"ABeeZee", sans-serif' }}>Bride &amp; Groom</p>
              <div className="w-16 h-px mx-auto mb-12" style={{ backgroundColor: BEIGE_GOLD }} />

              <div className="flex flex-col sm:flex-row gap-8 max-w-2xl mx-auto">
                {/* Pria */}
                <div className="flex-1 p-8 rounded-sm" style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${BEIGE_GOLD}66`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden" style={{ border: `2px solid ${BEIGE_GOLD}66` }}>
                    {photos[0] ? (
                      <img src={photos[0]} alt={invitation.partner_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${BURGUNDY}15`, color: BURGUNDY }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                    )}
                  </div>
                  <p className="text-xl mb-1" style={{ fontFamily: '"Imperial Script", cursive', color: BURGUNDY }}>{invitation.partner_name}</p>
                  {invitation.parent_name && (
                    <p className="text-xs opacity-70" style={{ fontFamily: '"ABeeZee", sans-serif' }}>Putra dari {invitation.parent_name}</p>
                  )}
                </div>

                {/* Wanita */}
                <div className="flex-1 p-8 rounded-sm" style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${BEIGE_GOLD}66`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden" style={{ border: `2px solid ${BEIGE_GOLD}66` }}>
                    {(photos[1] || photos[0]) ? (
                      <img src={photos[1] || photos[0]} alt={invitation.partner_name2} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${BURGUNDY}15`, color: BURGUNDY }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                    )}
                  </div>
                  <p className="text-xl mb-1" style={{ fontFamily: '"Imperial Script", cursive', color: BURGUNDY }}>{invitation.partner_name2}</p>
                  {invitation.parent_name2 && (
                    <p className="text-xs opacity-70" style={{ fontFamily: '"ABeeZee", sans-serif' }}>Putri dari {invitation.parent_name2}</p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* SECTION: Event */}
        <section id="section-event" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center"
          style={{ background: `linear-gradient(140deg, ${BURGUNDY}08 0%, ${CREAM_BG} 100%)` }}
        >
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"ABeeZee", sans-serif' }}>Acara Pernikahan</p>
            <div className="w-16 h-px mx-auto mb-12" style={{ backgroundColor: BEIGE_GOLD }} />

            <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
              {invitation.date_akad && (
                <div className="flex-1 p-8 rounded-sm text-left" style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${BEIGE_GOLD}66`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}>
                  <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: BURGUNDY, fontFamily: '"ABeeZee", sans-serif' }}>Akad Nikah</p>
                  <div className="w-10 h-px mb-4" style={{ backgroundColor: BEIGE_GOLD }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: DARK_BROWN }}>{formatDate(invitation.date_akad)}</p>
                  {invitation.time_akad && <p className="text-sm opacity-70 mb-1">Pukul {invitation.time_akad} WIB</p>}
                  {invitation.location && <p className="text-sm opacity-70">{invitation.location}</p>}
                  {invitation.maps_url && (
                    <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 px-5 py-2 text-xs uppercase tracking-[0.2em] transition-all hover:opacity-80"
                      style={{ color: BURGUNDY, border: `1px solid ${BURGUNDY}`, fontFamily: '"ABeeZee", sans-serif' }}
                    >
                      📍 Lihat Lokasi
                    </a>
                  )}
                </div>
              )}
              {invitation.date_resepsi && (
                <div className="flex-1 p-8 rounded-sm text-left" style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${BEIGE_GOLD}66`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}>
                  <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: BURGUNDY, fontFamily: '"ABeeZee", sans-serif' }}>Resepsi</p>
                  <div className="w-10 h-px mb-4" style={{ backgroundColor: BEIGE_GOLD }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: DARK_BROWN }}>{formatDate(invitation.date_resepsi)}</p>
                  {invitation.time_resepsi && <p className="text-sm opacity-70 mb-1">Pukul {invitation.time_resepsi} WIB</p>}
                  {invitation.location && <p className="text-sm opacity-70">{invitation.location}</p>}
                  {invitation.maps_url && (
                    <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 px-5 py-2 text-xs uppercase tracking-[0.2em] transition-all hover:opacity-80"
                      style={{ color: BURGUNDY, border: `1px solid ${BURGUNDY}`, fontFamily: '"ABeeZee", sans-serif' }}
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
            style={{ background: CREAM_BG }}
          >
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"ABeeZee", sans-serif' }}>Wedding Gallery</p>
              <div className="w-16 h-px mx-auto mb-10" style={{ backgroundColor: BEIGE_GOLD }} />
            </ScrollReveal>
            <div className="grid grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto w-full px-4">
              {photos.map((photo, idx) => (
                <ScrollReveal key={idx}>
                  <div className="aspect-[3/4] overflow-hidden cursor-pointer group" onClick={() => setLightboxImg(photo)}>
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
            style={{ background: `linear-gradient(140deg, ${BURGUNDY}08 0%, ${CREAM_BG} 100%)` }}
          >
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"ABeeZee", sans-serif' }}>Love Story</p>
              <div className="w-16 h-px mx-auto mb-12" style={{ backgroundColor: BEIGE_GOLD }} />
            </ScrollReveal>

            <div className="max-w-lg mx-auto w-full px-4">
              {storyTimeline ? (
                storyTimeline.map((item, idx) => (
                  <ScrollReveal key={idx}>
                    <div className="flex gap-6 mb-10 text-left">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: BURGUNDY }} />
                        {idx < storyTimeline.length - 1 && (
                          <div className="w-px flex-1 mt-1" style={{ backgroundColor: `${BURGUNDY}44` }} />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-xs opacity-60 mb-1">{item.date || ''}</p>
                        <p className="text-lg font-semibold mb-2" style={{ fontFamily: '"Imperial Script", cursive', color: BURGUNDY }}>
                          {item.title || ''}
                        </p>
                        <p className="text-sm opacity-80 leading-relaxed">{item.description || ''}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))
              ) : (
                <ScrollReveal><p className="text-sm opacity-80 leading-relaxed italic max-w-sm mx-auto">{invitation.story}</p></ScrollReveal>
              )}
            </div>
          </section>
        )}

        {/* SECTION: Gift */}
        <section className="py-24 px-6 text-center" style={{ background: CREAM_BG }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"ABeeZee", sans-serif' }}>Wedding Gift</p>
            <div className="w-16 h-px mx-auto mb-4" style={{ backgroundColor: BEIGE_GOLD }} />
            <p className="text-sm opacity-70 mb-10 max-w-xs mx-auto">Doa restu Anda merupakan hadiah terindah. Jika ingin memberi tanda kasih:</p>
          </ScrollReveal>

          <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto px-4">
            {[
              { name: 'BCA', acc: '123 456 7890' },
              { name: 'Mandiri', acc: '987 654 3210' },
            ].map((bank) => (
              <ScrollReveal key={bank.name}>
                <div className="flex-1 p-6 rounded-sm text-left" style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${BEIGE_GOLD}66`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: BURGUNDY }}>{bank.name}</p>
                  <p className="text-xs opacity-60 mb-1">a.n. {invitation.partner_name} &amp; {invitation.partner_name2}</p>
                  <p className="text-lg tracking-wider" style={{ color: DARK_BROWN }}>{bank.acc}</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(bank.acc.replace(/\s/g, ''), bank.name.toLowerCase())}
                    className="mt-3 px-4 py-1.5 text-xs transition-all hover:opacity-80"
                    style={{ color: WHITE, background: BEIGE_GOLD, border: 'none', fontFamily: '"ABeeZee", sans-serif' }}
                  >
                    {copied === bank.name.toLowerCase() ? '✓ Tersalin' : 'Copy'}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* SECTION: Wishes */}
        <section id="section-wishes" className="py-24 px-6 text-center"
          style={{ background: `linear-gradient(140deg, ${BURGUNDY}08 0%, ${CREAM_BG} 100%)` }}
        >
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"ABeeZee", sans-serif' }}>R.S.V.P</p>
            <div className="w-16 h-px mx-auto mb-10" style={{ backgroundColor: BEIGE_GOLD }} />
          </ScrollReveal>
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={BURGUNDY} accentColor={DARK_BROWN} bgColor={CREAM_BG} />
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 text-center" style={{ background: BURGUNDY }}>
          <p className="text-white/70 text-sm mb-6 max-w-xs mx-auto leading-relaxed" style={{ fontFamily: '"ABeeZee", sans-serif' }}>
            Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.
          </p>
          <p className="text-white/50 text-xs uppercase tracking-[0.3em] mb-3">The Wedding of</p>
          <p className="text-2xl text-white mb-2" style={{ fontFamily: '"Imperial Script", cursive', color: BEIGE_GOLD }}>
            {invitation.partner_name} &amp; {invitation.partner_name2}
          </p>
          <p className="text-white/30 text-xs mt-8">© 2025 — Made with Love</p>
        </footer>

        {/* Music */}
        {invitation.music_url && (
          <button type="button" onClick={toggleMusic}
            className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            style={{ backgroundColor: BEIGE_GOLD, color: BURGUNDY }}
          >
            {musicPlaying ? '🔊' : '🔇'}
          </button>
        )}

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-40" style={{ backgroundColor: `${BURGUNDY}ee`, backdropFilter: 'blur(8px)' }}>
          <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
            {[
              { id: 'section-bismillah', icon: '⌂', label: 'Home' },
              { id: 'section-couple', icon: '♡', label: 'Couple' },
              { id: 'section-event', icon: '◷', label: 'Event' },
              { id: 'section-gallery', icon: '◱', label: 'Gallery' },
              { id: 'section-wishes', icon: '✉', label: 'Wishes' },
            ].map((item) => (
              <button key={item.id} type="button" onClick={() => scrollTo(item.id)}
                className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all hover:opacity-80">
                <span className="text-lg" style={{ color: BEIGE_GOLD }}>{item.icon}</span>
                <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: `${BEIGE_GOLD}bb`, fontFamily: '"ABeeZee", sans-serif' }}>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Lightbox */}
        {lightboxImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 cursor-pointer" onClick={() => setLightboxImg(null)}>
            <img src={lightboxImg} alt="Gallery" className="max-w-full max-h-full object-contain" />
          </div>
        )}

        <ScrollToTop primaryColor={BEIGE_GOLD} />
      </div>
    </div>
  );
}
