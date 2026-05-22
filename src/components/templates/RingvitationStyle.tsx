'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import ScrollToTop from './ScrollToTop';
import { TemplateProps } from './types';

export default function RingvitationStyle({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#9b59b6', secondary: '#f8f4fc', accent: '#4a235a' };
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

  // === EXACT COLORS FROM ringvitation.com ===
  const BURGUNDY = '#611a20';       // rgb(97, 26, 32) - main accent
  const CREAM = '#fffaf2';           // rgb(255, 250, 242) - light bg
  const WARM_CREAM = '#fff4de';      // rgb(255, 244, 222) - warm section
  const DARK = '#4b4f58';            // rgb(75, 79, 88) - text
  const WHITE = '#ffffff';
  const LIGHT_GRAY = '#85899a';      // rgb(133, 138, 154) - secondary button

  return (
    <div style={{ fontFamily: '"Playfair Display SC", "Poppins", serif', color: DARK, backgroundColor: CREAM, paddingBottom: '80px' }}>
      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* ===== COVER OVERLAY ===== */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ background: `linear-gradient(rgba(0,0,0,0.5) 0%, ${BURGUNDY} 100%)` }}
      >
        <div className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: photos[0] ? `url(${photos[0]})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.5em] mb-8 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]" style={{ color: `${WARM_CREAM}cc`, fontFamily: '"Cinzel Decorative", cursive' }}>
            The Wedding Of
          </p>

          <h1 className="text-5xl md:text-6xl text-white mb-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ fontFamily: '"Playfair Display SC", serif', letterSpacing: '0.03em' }}>
            {invitation.partner_name}
          </h1>
          <p className="text-2xl my-3 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]" style={{ color: WARM_CREAM, fontFamily: '"Cinzel Decorative", cursive' }}>✦</p>
          <h1 className="text-5xl md:text-6xl text-white mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ fontFamily: '"Playfair Display SC", serif', letterSpacing: '0.03em' }}>
            {invitation.partner_name2}
          </h1>

          {targetDate && (
            <p className="text-white/60 text-sm tracking-[0.3em] mb-14 uppercase opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <button
            type="button"
            onClick={handleOpen}
            className="px-10 py-3 text-xs font-semibold uppercase transition-all duration-300 hover:scale-105 active:scale-95 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{
              background: BURGUNDY,
              color: WHITE,
              border: `1px solid ${WARM_CREAM}`,
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            BUKA UNDANGAN
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className={opened ? '' : 'hidden'}>

        {/* Bismillah */}
        <section id="section-bismillah" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center"
          style={{ background: `radial-gradient(at 50% 100%, ${WARM_CREAM} 40%, ${CREAM} 64%)` }}
        >
          <ScrollReveal className="flex flex-col items-center max-w-md">
            <p className="text-white/60 text-lg mb-2" style={{ fontFamily: '"Amiri", serif' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            <p className="text-xs uppercase tracking-[0.4em] mb-10" style={{ color: `${BURGUNDY}aa` }}>Bismillahirrahmanirrahim</p>
            <p className="text-sm leading-relaxed mb-2 italic" style={{ color: `${DARK}cc` }}>
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri..."
            </p>
            <p className="text-xs mb-10" style={{ color: `${DARK}88` }}>(QS. Ar-Rum : 21)</p>
            {targetDate && <Countdown targetDate={targetDate} primaryColor={BURGUNDY} accentColor={`${DARK}88`} />}
          </ScrollReveal>
        </section>

        {/* Bride & Groom */}
        {(invitation.parent_name || invitation.parent_name2) && (
          <section id="section-couple" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: CREAM }}>
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"Cinzel Decorative", cursive' }}>Bride &amp; Groom</p>
              <div className="flex flex-col sm:flex-row gap-8 max-w-xl mx-auto">
                {[
                  { name: invitation.partner_name, parent: invitation.parent_name, photo: photos[0] },
                  { name: invitation.partner_name2, parent: invitation.parent_name2, photo: photos[1] || photos[0] },
                ].map((p, i) => p.parent && (
                  <div key={i} className="flex-1 text-center" style={{
                    background: WHITE,
                    border: `1px solid ${WARM_CREAM}`,
                  }}>
                    <div className="p-6">
                      <div className="w-20 h-20 mx-auto mb-3 overflow-hidden" style={{ border: `1px solid ${WARM_CREAM}` }}>
                        {p.photo ? <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${BURGUNDY}10`, color: BURGUNDY }}>
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>}
                      </div>
                      <p className="text-lg mb-1" style={{ fontFamily: '"Playfair Display SC", serif', color: BURGUNDY }}>{p.name}</p>
                      <p className="text-xs opacity-60" style={{ fontFamily: '"Poppins", sans-serif' }}>Putra{i === 1 ? 'ri' : ''} dari {p.parent}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* Event */}
        <section id="section-event" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center"
          style={{ background: `linear-gradient(120deg, ${CREAM} 0%, ${WHITE} 100%)` }}
        >
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"Cinzel Decorative", cursive' }}>Acara</p>
            <div className="flex flex-col sm:flex-row gap-6 max-w-xl mx-auto">
              {invitation.date_akad && (
                <div className="flex-1 p-6 text-left" style={{
                  background: WHITE,
                  border: `1px solid rgba(146,146,146,0.3)`,
                }}>
                  <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: BURGUNDY, fontFamily: '"Poppins", sans-serif' }}>Akad Nikah</p>
                  <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_akad)}</p>
                  {invitation.time_akad && <p className="text-sm opacity-60 mb-1">Pukul {invitation.time_akad} WIB</p>}
                  {invitation.location && <p className="text-sm opacity-60">{invitation.location}</p>}
                  {invitation.maps_url && (
                    <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 px-5 py-2 text-xs transition-all hover:opacity-80"
                      style={{ color: '#747474', border: `1px solid #929292`, fontFamily: '"Poppins", sans-serif' }}
                    >
                      Google Map
                    </a>
                  )}
                </div>
              )}
              {invitation.date_resepsi && (
                <div className="flex-1 p-6 text-left" style={{
                  background: WHITE,
                  border: `1px solid rgba(146,146,146,0.3)`,
                }}>
                  <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: BURGUNDY, fontFamily: '"Poppins", sans-serif' }}>Resepsi</p>
                  <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_resepsi)}</p>
                  {invitation.time_resepsi && <p className="text-sm opacity-60 mb-1">Pukul {invitation.time_resepsi} WIB</p>}
                  {invitation.location && <p className="text-sm opacity-60">{invitation.location}</p>}
                  {invitation.maps_url && (
                    <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 px-5 py-2 text-xs transition-all hover:opacity-80"
                      style={{ color: '#747474', border: `1px solid #929292`, fontFamily: '"Poppins", sans-serif' }}
                    >
                      Google Map
                    </a>
                  )}
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>

        {/* Gallery */}
        {photos.length > 0 && (
          <section id="section-gallery" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: CREAM }}>
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"Cinzel Decorative", cursive' }}>Gallery</p>
            </ScrollReveal>
            <div className="grid grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 gap-2 max-w-3xl mx-auto w-full px-4">
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

        {/* Love Story */}
        {invitation.story && (
          <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: WHITE }}>
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"Cinzel Decorative", cursive' }}>Our Story</p>
            </ScrollReveal>
            <div className="max-w-lg mx-auto w-full px-4 text-left">
              {storyTimeline ? storyTimeline.map((item, idx) => (
                <ScrollReveal key={idx}>
                  <div className="flex gap-5 mb-8">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: BURGUNDY, transform: 'rotate(45deg)' }} />
                      {idx < storyTimeline.length - 1 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: `${BURGUNDY}33` }} />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-xs opacity-60 mb-1">{item.date || ''}</p>
                      <p className="text-base font-semibold mb-1" style={{ fontFamily: '"Playfair Display SC", serif', color: BURGUNDY }}>{item.title || ''}</p>
                      <p className="text-sm opacity-70 leading-relaxed">{item.description || ''}</p>
                    </div>
                  </div>
                </ScrollReveal>
              )) : <ScrollReveal><p className="text-sm opacity-70 leading-relaxed italic">{invitation.story}</p></ScrollReveal>}
            </div>
          </section>
        )}

        {/* Gift */}
        <section className="py-24 px-6 text-center" style={{ background: CREAM }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"Cinzel Decorative", cursive' }}>Wedding Gift</p>
            <p className="text-sm opacity-60 mb-10">Doa restu Anda adalah hadiah terindah. Jika ingin memberi tanda kasih:</p>
          </ScrollReveal>
          <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto px-4">
            {[{ name: 'BCA', acc: '123 456 7890' }, { name: 'Mandiri', acc: '987 654 3210' }].map((b) => (
              <ScrollReveal key={b.name}>
                <div className="flex-1 p-6 text-left" style={{ background: WHITE }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: BURGUNDY }}>{b.name}</p>
                  <p className="text-xs opacity-60 mb-1">a.n. {invitation.partner_name} &amp; {invitation.partner_name2}</p>
                  <p className="text-lg tracking-wider">{b.acc}</p>
                  <button type="button" onClick={() => handleCopy(b.acc.replace(/\s/g, ''), b.name.toLowerCase())}
                    className="mt-3 px-4 py-1.5 text-xs transition-all hover:opacity-80"
                    style={{ background: LIGHT_GRAY, color: WHITE, border: 'none', fontFamily: '"Poppins", sans-serif' }}>
                    {copied === b.name.toLowerCase() ? '✓ Tersalin' : 'Salin Rekening'}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Wishes */}
        <section id="section-wishes" className="py-24 px-6 text-center" style={{ background: WHITE }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BURGUNDY, fontFamily: '"Cinzel Decorative", cursive' }}>R.S.V.P</p>
          </ScrollReveal>
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={BURGUNDY} accentColor={DARK} bgColor={CREAM} />
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 text-center" style={{ background: BURGUNDY }}>
          <p className="text-white/70 text-sm mb-6 max-w-xs mx-auto leading-relaxed" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Merupakan kebahagiaan dan kehormatan apabila Anda berkenan hadir memberikan doa restu.
          </p>
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-3">The Wedding of</p>
          <p className="text-2xl text-white mb-2" style={{ fontFamily: '"Playfair Display SC", serif', color: WARM_CREAM }}>
            {invitation.partner_name} &amp; {invitation.partner_name2}
          </p>
          <p className="text-white/30 text-xs mt-8">© 2025 — Made with Love</p>
        </footer>

        {invitation.music_url && (
          <button type="button" onClick={toggleMusic}
            className="fixed bottom-20 right-4 z-40 w-12 h-12 flex items-center justify-center shadow-lg transition-all hover:scale-110"
            style={{ background: BURGUNDY, color: WHITE }}>
            {musicPlaying ? '🔊' : '🔇'}
          </button>
        )}

        <nav className="fixed bottom-0 left-0 right-0 z-40" style={{ background: `${DARK}ee`, backdropFilter: 'blur(8px)' }}>
          <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
            {[{ id: 'section-bismillah', icon: '@' }, { id: 'section-couple', icon: 'P' }, { id: 'section-event', icon: 'c' }, { id: 'section-gallery', icon: ';' }, { id: 'section-wishes', icon: '6' }].map((item) => (
              <button key={item.id} type="button" onClick={() => scrollTo(item.id)}
                className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all hover:opacity-80">
                <span className="text-lg text-white/80" style={{ fontFamily: '"wedding icon", sans-serif' }}>{item.icon}</span>
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
        <ScrollToTop primaryColor={BURGUNDY} />
      </div>
    </div>
  );
}
