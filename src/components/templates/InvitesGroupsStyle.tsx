'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import ScrollToTop from './ScrollToTop';
import { TemplateProps } from './types';

export default function InvitesGroupsStyle({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#e8a87c', secondary: '#fef9f4', accent: '#8b5e3c' };
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

  // === EXACT COLORS FROM invites.groups.id ===
  const BROWN = '#744d2d';          // rgb(116, 77, 45) - primary button, text
  const LIGHT_BROWN = '#a0734d';    // rgb(160, 115, 77) - secondary accent
  const WARM_CREAM = '#fff6e7';     // rgb(255, 246, 231) - section bg
  const WHITE = '#ffffff';
  const DARK_TEXT = '#333333';

  return (
    <div style={{ fontFamily: '"Cormorant Garamond", "Lora", serif', color: DARK_TEXT, backgroundColor: WHITE, paddingBottom: '80px' }}>
      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* ===== COVER OVERLAY ===== */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ background: `linear-gradient(160deg, ${WHITE} 50%, ${'#e6bf8e'} 100%)` }}
      >
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.5em] mb-8 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]" style={{ color: BROWN, fontFamily: '"Poltawski Nowy", sans-serif' }}>
            Wedding Invitation
          </p>

          <h1 className="text-5xl md:text-6xl mb-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ fontFamily: '"Pinyon Script", cursive', color: BROWN, letterSpacing: '0.02em' }}>
            {invitation.partner_name}
          </h1>
          <p className="text-2xl my-3 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]" style={{ color: LIGHT_BROWN, fontFamily: '"Pinyon Script", cursive' }}>&amp;</p>
          <h1 className="text-5xl md:text-6xl mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ fontFamily: '"Pinyon Script", cursive', color: BROWN, letterSpacing: '0.02em' }}>
            {invitation.partner_name2}
          </h1>

          {targetDate && (
            <p className="text-sm tracking-[0.3em] mb-14 uppercase opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]" style={{ color: `${BROWN}aa`, fontFamily: '"Roboto Condensed", sans-serif' }}>
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <button
            type="button"
            onClick={handleOpen}
            className="px-8 py-3 text-xs uppercase tracking-[0.3em] transition-all duration-300 hover:scale-105 active:scale-95 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{
              background: BROWN,
              color: WHITE,
              border: 'none',
              borderRadius: '8px',
              fontFamily: '"Roboto Condensed", sans-serif',
            }}
          >
            Buka Undangan
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className={opened ? '' : 'hidden'}>

        {/* Bismillah */}
        <section id="section-bismillah" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: BROWN }}>
          <ScrollReveal className="flex flex-col items-center max-w-md">
            <p className="text-white/60 text-lg mb-2" style={{ fontFamily: '"Amiri", serif' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            <p className="text-white/40 text-xs uppercase tracking-[0.4em] mb-10">Bismillahirrahmanirrahim</p>
            <p className="text-white/70 text-sm leading-relaxed mb-2 italic">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya..."
            </p>
            <p className="text-white/40 text-xs mb-10">(QS. Ar-Rum : 21)</p>
            {targetDate && <Countdown targetDate={targetDate} primaryColor={WARM_CREAM} accentColor="#ffffff66" />}
          </ScrollReveal>
        </section>

        {/* Bride & Groom */}
        {(invitation.parent_name || invitation.parent_name2) && (
          <section id="section-couple" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: WARM_CREAM }}>
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BROWN, fontFamily: '"Roboto Condensed", sans-serif' }}>Mempelai</p>
              <div className="flex flex-col sm:flex-row gap-8 max-w-xl mx-auto">
                {[
                  { name: invitation.partner_name, parent: invitation.parent_name, photo: photos[0] },
                  { name: invitation.partner_name2, parent: invitation.parent_name2, photo: photos[1] || photos[0] },
                ].map((p, i) => p.parent && (
                  <div key={i} className="flex-1 p-6 rounded-2xl text-center" style={{ background: WHITE, boxShadow: '0 2px 12px rgba(116,77,45,0.08)' }}>
                    <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded" style={{ border: `2px solid ${BROWN}44` }}>
                      {p.photo ? <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${BROWN}10`, color: BROWN }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          </div>}
                    </div>
                    <p className="text-lg mb-1" style={{ fontFamily: '"Pinyon Script", cursive', color: BROWN }}>{p.name}</p>
                    <p className="text-xs opacity-60">Putra{i === 1 ? 'ri' : ''} dari {p.parent}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* Event */}
        <section id="section-event" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: WHITE }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BROWN, fontFamily: '"Roboto Condensed", sans-serif' }}>Acara Pernikahan</p>
          </ScrollReveal>
          <div className="flex flex-col sm:flex-row gap-6 max-w-xl mx-auto px-4">
            {invitation.date_akad && (
              <ScrollReveal>
                <div className="flex-1 p-6 rounded-xl text-left" style={{ background: WARM_CREAM }}>
                  <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: BROWN, fontFamily: '"Roboto Condensed", sans-serif' }}>Akad Nikah</p>
                  <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_akad)}</p>
                  {invitation.time_akad && <p className="text-sm opacity-60 mb-1">Pukul {invitation.time_akad} WIB</p>}
                  {invitation.location && <p className="text-sm opacity-60">{invitation.location}</p>}
                  {invitation.maps_url && (
                    <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 px-6 py-3 text-xs uppercase tracking-[0.2em] transition-all hover:opacity-80"
                      style={{ background: BROWN, color: WHITE, borderRadius: '3px', fontFamily: '"Roboto Condensed", sans-serif' }}
                    >
                      Kunjungi Lokasi
                    </a>
                  )}
                </div>
              </ScrollReveal>
            )}
            {invitation.date_resepsi && (
              <ScrollReveal>
                <div className="flex-1 p-6 rounded-xl text-left" style={{ background: WARM_CREAM }}>
                  <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: BROWN, fontFamily: '"Roboto Condensed", sans-serif' }}>Resepsi</p>
                  <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_resepsi)}</p>
                  {invitation.time_resepsi && <p className="text-sm opacity-60 mb-1">Pukul {invitation.time_resepsi} WIB</p>}
                  {invitation.location && <p className="text-sm opacity-60">{invitation.location}</p>}
                  {invitation.maps_url && (
                    <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-4 px-6 py-3 text-xs uppercase tracking-[0.2em] transition-all hover:opacity-80"
                      style={{ background: BROWN, color: WHITE, borderRadius: '3px', fontFamily: '"Roboto Condensed", sans-serif' }}
                    >
                      Kunjungi Lokasi
                    </a>
                  )}
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>

        {/* Gallery */}
        {photos.length > 0 && (
          <section id="section-gallery" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: WARM_CREAM }}>
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BROWN, fontFamily: '"Roboto Condensed", sans-serif' }}>Wedding Gallery</p>
            </ScrollReveal>
            <div className="grid grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto w-full px-4">
              {photos.map((photo, idx) => (
                <ScrollReveal key={idx}>
                  <div className="aspect-[3/4] overflow-hidden cursor-pointer group rounded" onClick={() => setLightboxImg(photo)}>
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
              <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BROWN, fontFamily: '"Roboto Condensed", sans-serif' }}>Love Story</p>
            </ScrollReveal>
            <div className="max-w-lg mx-auto w-full px-4 text-left">
              {storyTimeline ? storyTimeline.map((item, idx) => (
                <ScrollReveal key={idx}>
                  <div className="flex gap-5 mb-8">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: LIGHT_BROWN }} />
                      {idx < storyTimeline.length - 1 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: `${BROWN}33` }} />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-xs opacity-60 mb-1">{item.date || ''}</p>
                      <p className="text-base font-semibold mb-1" style={{ fontFamily: '"Pinyon Script", cursive', color: BROWN, fontSize: '1.3rem' }}>{item.title || ''}</p>
                      <p className="text-sm opacity-70 leading-relaxed">{item.description || ''}</p>
                    </div>
                  </div>
                </ScrollReveal>
              )) : <ScrollReveal><p className="text-sm opacity-70 leading-relaxed italic">{invitation.story}</p></ScrollReveal>}
            </div>
          </section>
        )}

        {/* Gift */}
        <section className="py-24 px-6 text-center" style={{ background: WARM_CREAM }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BROWN, fontFamily: '"Roboto Condensed", sans-serif' }}>Wedding Gift</p>
            <p className="text-sm opacity-60 mb-10">Doa restu Anda adalah hadiah. Jika ingin memberi tanda kasih:</p>
          </ScrollReveal>
          <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto px-4">
            {[{ name: 'BCA', acc: '123 456 7890' }, { name: 'Mandiri', acc: '987 654 3210' }].map((b) => (
              <ScrollReveal key={b.name}>
                <div className="flex-1 p-6 rounded-xl text-left" style={{ background: WHITE, boxShadow: '0 2px 12px rgba(116,77,45,0.08)' }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: BROWN }}>{b.name}</p>
                  <p className="text-xs opacity-60 mb-1">a.n. {invitation.partner_name} &amp; {invitation.partner_name2}</p>
                  <p className="text-lg tracking-wider">{b.acc}</p>
                  <button type="button" onClick={() => handleCopy(b.acc.replace(/\s/g, ''), b.name.toLowerCase())}
                    className="mt-3 px-4 py-1.5 text-xs transition-all hover:opacity-80"
                    style={{ background: BROWN, color: WHITE, border: 'none', borderRadius: '3px', fontFamily: '"Roboto Condensed", sans-serif' }}>
                    {copied === b.name.toLowerCase() ? '✓ Tersalin' : 'Copy'}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Wishes */}
        <section id="section-wishes" className="py-24 px-6 text-center" style={{ background: WHITE }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: BROWN, fontFamily: '"Roboto Condensed", sans-serif' }}>R.S.V.P</p>
          </ScrollReveal>
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={BROWN} accentColor={DARK_TEXT} bgColor={WARM_CREAM} />
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 text-center" style={{ background: BROWN }}>
          <p className="text-white/70 text-sm mb-6 max-w-xs mx-auto leading-relaxed">Merupakan kebahagiaan kami apabila Anda berkenan hadir.</p>
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-3">The Wedding of</p>
          <p className="text-2xl text-white mb-2" style={{ fontFamily: '"Pinyon Script", cursive', color: WARM_CREAM }}>
            {invitation.partner_name} &amp; {invitation.partner_name2}
          </p>
          <p className="text-white/30 text-xs mt-8">© 2025 — Made with Love</p>
        </footer>

        {invitation.music_url && (
          <button type="button" onClick={toggleMusic}
            className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            style={{ background: BROWN, color: WHITE }}>
            {musicPlaying ? '🔊' : '🔇'}
          </button>
        )}

        <nav className="fixed bottom-0 left-0 right-0 z-40" style={{ background: `${BROWN}ee`, backdropFilter: 'blur(8px)' }}>
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
        <ScrollToTop primaryColor={BROWN} />
      </div>
    </div>
  );
}
