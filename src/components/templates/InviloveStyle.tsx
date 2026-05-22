'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import ScrollToTop from './ScrollToTop';
import { TemplateProps } from './types';

export default function InviloveStyle({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#e88d9c', secondary: '#fef6f7', accent: '#8b3a4a' };
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

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

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

  // === EXACT COLORS FROM invilove.id ===
  const TAUPE = '#776b5d';         // rgb(119, 107, 93) - button bg, accent
  const WARM_BEIGE = '#ebe3d5';    // rgb(235, 227, 213) - section bg
  const DARK_BROWN = '#332c25';    // rgb(51, 44, 37) - dark text
  const OFF_WHITE = '#ffffff';
  const LIGHT_BEIGE = '#f3eeea';   // rgb(243, 238, 234)

  return (
    <div style={{ fontFamily: '"Lora", "Philosopher", serif', color: DARK_BROWN, backgroundColor: OFF_WHITE, paddingBottom: '80px' }}>
      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* ===== COVER OVERLAY ===== */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ background: `linear-gradient(174deg, rgba(0,0,0,0.12) 38%, #000 100%)` }}
      >
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.5em] mb-8 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]" style={{ color: WARM_BEIGE, fontFamily: '"Philosopher", sans-serif' }}>
            The Wedding Of
          </p>

          <h1 className="text-5xl md:text-6xl text-white mb-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ fontFamily: '"Parisienne", cursive', letterSpacing: '0.02em' }}>
            {invitation.partner_name}
          </h1>
          <p className="text-3xl my-3 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]" style={{ color: WARM_BEIGE, fontFamily: '"Parisienne", cursive' }}>&amp;</p>
          <h1 className="text-5xl md:text-6xl text-white mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ fontFamily: '"Parisienne", cursive', letterSpacing: '0.02em' }}>
            {invitation.partner_name2}
          </h1>

          {targetDate && (
            <p className="text-white/60 text-sm tracking-[0.3em] mb-14 uppercase opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]" style={{ fontFamily: '"Philosopher", sans-serif' }}>
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <button
            type="button"
            onClick={handleOpen}
            className="px-8 py-2.5 text-xs font-semibold uppercase transition-all duration-300 hover:scale-105 active:scale-95 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{
              background: OFF_WHITE,
              color: DARK_BROWN,
              border: 'none',
              borderRadius: '14px',
              padding: '10px 30px',
              fontFamily: '"Philosopher", sans-serif',
              letterSpacing: '0.5px',
            }}
          >
            BUKA UNDANGAN
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className={opened ? '' : 'hidden'}>

        {/* Bismillah */}
        <section id="section-bismillah" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: DARK_BROWN }}>
          <ScrollReveal className="flex flex-col items-center max-w-md">
            <p className="text-white/60 text-lg mb-2" style={{ fontFamily: '"Abyssinica SIL", serif' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            <p className="text-white/40 text-xs uppercase tracking-[0.4em] mb-10">Bismillahirrahmanirrahim</p>
            <p className="text-white/70 text-sm leading-relaxed mb-2 italic">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
            </p>
            <p className="text-white/40 text-xs mb-10">(QS. Ar-Rum : 21)</p>
            {targetDate && <Countdown targetDate={targetDate} primaryColor={WARM_BEIGE} accentColor="#ffffff66" />}
          </ScrollReveal>
        </section>

        {/* Bride & Groom */}
        {(invitation.parent_name || invitation.parent_name2) && (
          <section id="section-couple" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: WARM_BEIGE }}>
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: TAUPE, fontFamily: '"Philosopher", sans-serif' }}>Mempelai</p>
              <div className="flex flex-col sm:flex-row gap-6 max-w-xl mx-auto">
                {[
                  { name: invitation.partner_name, parent: invitation.parent_name, photo: photos[0] },
                  { name: invitation.partner_name2, parent: invitation.parent_name2, photo: photos[1] || photos[0] },
                ].map((p, i) => p.parent && (
                  <div key={i} className="flex-1 p-6 rounded-3xl text-center" style={{ backgroundColor: OFF_WHITE }}>
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden" style={{ border: `2px solid ${TAUPE}44` }}>
                      {p.photo ? <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${TAUPE}15`, color: TAUPE }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>}
                    </div>
                    <p className="text-lg mb-1" style={{ fontFamily: '"Parisienne", cursive', color: TAUPE }}>{p.name}</p>
                    <p className="text-xs opacity-60" style={{ fontFamily: '"Lora", serif' }}>Putra{i === 1 ? 'ri' : ''} dari {p.parent}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* Event */}
        <section id="section-event" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: OFF_WHITE }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: TAUPE, fontFamily: '"Philosopher", sans-serif' }}>Acara Pernikahan</p>
            <div className="flex flex-col sm:flex-row gap-6 max-w-xl mx-auto">
              {invitation.date_akad && (
                <div className="flex-1 p-6 rounded-3xl text-left" style={{ backgroundColor: LIGHT_BEIGE }}>
                  <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: TAUPE, fontFamily: '"Philosopher", sans-serif' }}>Akad Nikah</p>
                  <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_akad)}</p>
                  {invitation.time_akad && <p className="text-sm opacity-60 mb-1">Pukul {invitation.time_akad} WIB</p>}
                  {invitation.location && <p className="text-sm opacity-60">{invitation.location}</p>}
                  {invitation.maps_url && (
                    <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 px-5 py-2 text-xs uppercase tracking-[0.25em] transition-all hover:opacity-80"
                      style={{ background: TAUPE, color: OFF_WHITE, borderRadius: '6px', fontFamily: '"Philosopher", sans-serif', letterSpacing: '2.7px' }}
                    >
                      BUKA MAPS
                    </a>
                  )}
                </div>
              )}
              {invitation.date_resepsi && (
                <div className="flex-1 p-6 rounded-3xl text-left" style={{ backgroundColor: LIGHT_BEIGE }}>
                  <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: TAUPE, fontFamily: '"Philosopher", sans-serif' }}>Resepsi</p>
                  <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_resepsi)}</p>
                  {invitation.time_resepsi && <p className="text-sm opacity-60 mb-1">Pukul {invitation.time_resepsi} WIB</p>}
                  {invitation.location && <p className="text-sm opacity-60">{invitation.location}</p>}
                  {invitation.maps_url && (
                    <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 px-5 py-2 text-xs uppercase tracking-[0.25em] transition-all hover:opacity-80"
                      style={{ background: TAUPE, color: OFF_WHITE, borderRadius: '6px', fontFamily: '"Philosopher", sans-serif', letterSpacing: '2.7px' }}
                    >
                      BUKA MAPS
                    </a>
                  )}
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>

        {/* Gallery */}
        {photos.length > 0 && (
          <section id="section-gallery" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: WARM_BEIGE }}>
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: TAUPE, fontFamily: '"Philosopher", sans-serif' }}>Wedding Gallery</p>
            </ScrollReveal>
            <div className="grid grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto w-full px-4">
              {photos.map((photo, idx) => (
                <ScrollReveal key={idx}>
                  <div className="aspect-[3/4] overflow-hidden cursor-pointer group rounded-3xl" onClick={() => setLightboxImg(photo)}>
                    <img src={photo} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Love Story */}
        {invitation.story && (
          <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: OFF_WHITE }}>
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: TAUPE, fontFamily: '"Philosopher", sans-serif' }}>Love Story</p>
            </ScrollReveal>
            <div className="max-w-lg mx-auto w-full px-4 text-left">
              {storyTimeline ? storyTimeline.map((item, idx) => (
                <ScrollReveal key={idx}>
                  <div className="flex gap-5 mb-8">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: TAUPE }} />
                      {idx < storyTimeline.length - 1 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: `${TAUPE}33` }} />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-xs opacity-60 mb-1">{item.date || ''}</p>
                      <p className="text-base font-semibold mb-1" style={{ fontFamily: '"Parisienne", cursive', color: TAUPE }}>{item.title || ''}</p>
                      <p className="text-sm opacity-70 leading-relaxed">{item.description || ''}</p>
                    </div>
                  </div>
                </ScrollReveal>
              )) : <ScrollReveal><p className="text-sm opacity-70 leading-relaxed italic">{invitation.story}</p></ScrollReveal>}
            </div>
          </section>
        )}

        {/* Gift */}
        <section className="py-24 px-6 text-center" style={{ background: WARM_BEIGE }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: TAUPE, fontFamily: '"Philosopher", sans-serif' }}>Wedding Gift</p>
            <p className="text-sm opacity-60 mb-10 max-w-xs mx-auto">Doa restu Anda adalah hadiah. Jika ingin memberi tanda kasih:</p>
          </ScrollReveal>
          <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto px-4">
            {[{ name: 'BCA', acc: '123 456 7890' }, { name: 'Mandiri', acc: '987 654 3210' }].map((b) => (
              <ScrollReveal key={b.name}>
                <div className="flex-1 p-6 rounded-3xl text-left" style={{ background: OFF_WHITE }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: TAUPE }}>{b.name}</p>
                  <p className="text-xs opacity-60 mb-1">a.n. {invitation.partner_name} &amp; {invitation.partner_name2}</p>
                  <p className="text-lg tracking-wider">{b.acc}</p>
                  <button type="button" onClick={() => handleCopy(b.acc.replace(/\s/g, ''), b.name.toLowerCase())}
                    className="mt-3 px-4 py-1.5 text-xs transition-all hover:opacity-80" style={{ background: TAUPE, color: OFF_WHITE, border: 'none', borderRadius: '6px', fontFamily: '"Lora", serif' }}>
                    {copied === b.name.toLowerCase() ? '✓ Tersalin' : 'Copy'}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Wishes */}
        <section id="section-wishes" className="py-24 px-6 text-center" style={{ background: OFF_WHITE }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: TAUPE, fontFamily: '"Philosopher", sans-serif' }}>R.S.V.P</p>
          </ScrollReveal>
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={TAUPE} accentColor={DARK_BROWN} bgColor={WARM_BEIGE} />
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 text-center" style={{ background: `linear-gradient(rgba(0,0,0,0) 0%, ${TAUPE} 63%)` }}>
          <p className="text-white/70 text-sm mb-6 max-w-xs mx-auto leading-relaxed">Merupakan kebahagiaan bagi kami jika Anda berkenan hadir.</p>
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-3">The Wedding of</p>
          <p className="text-2xl text-white mb-2" style={{ fontFamily: '"Parisienne", cursive', color: WARM_BEIGE }}>
            {invitation.partner_name} &amp; {invitation.partner_name2}
          </p>
          <p className="text-white/30 text-xs mt-8">© 2025 — Made with Love</p>
        </footer>

        {invitation.music_url && (
          <button type="button" onClick={toggleMusic}
            className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            style={{ background: TAUPE, color: OFF_WHITE }}>
            {musicPlaying ? '🔊' : '🔇'}
          </button>
        )}

        <nav className="fixed bottom-0 left-0 right-0 z-40" style={{ background: `${TAUPE}ee`, backdropFilter: 'blur(8px)' }}>
          <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
            {[{ id: 'section-bismillah', icon: '⌂' }, { id: 'section-couple', icon: '♡' }, { id: 'section-event', icon: '◷' }, { id: 'section-gallery', icon: '◱' }, { id: 'section-wishes', icon: '✉' }].map((item) => (
              <button key={item.id} type="button" onClick={() => scrollTo(item.id)}
                className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all hover:opacity-80">
                <span className="text-lg text-white/80">{item.icon}</span>
                <span className="text-[10px] uppercase tracking-[0.1em] text-white/60">{item.id.replace('section-', '')}</span>
              </button>
            ))}
          </div>
        </nav>

        {lightboxImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 cursor-pointer" onClick={() => setLightboxImg(null)}>
            <img src={lightboxImg} alt="Gallery" className="max-w-full max-h-full object-contain" />
          </div>
        )}
        <ScrollToTop primaryColor={TAUPE} />
      </div>
    </div>
  );
}
