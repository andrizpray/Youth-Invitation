'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import { TemplateProps } from './types';

export default function ClassicGold({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
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

  const storyTimeline = (() => {
    try {
      const parsed = JSON.parse(invitation.story || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as { title: string; date: string; description: string }[];
    } catch {}
    return null;
  })();

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else { audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {}); }
  };

  const targetDate = invitation.date_akad || invitation.date_resepsi;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const heroPhoto = photos[0];

  const navItems = [
    { id: 'section-cover', icon: '🏠', label: 'Home' },
    { id: 'section-couple', icon: '💑', label: 'Couple' },
    { id: 'section-event', icon: '📅', label: 'Event' },
    { id: 'section-gallery', icon: '📷', label: 'Gallery' },
    { id: 'section-wishes', icon: '💬', label: 'Wishes' },
  ];

  const GoldDivider = () => (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to right, transparent, ${colors.primary})` }} />
      <span className="text-sm" style={{ color: colors.primary }}>✦ ✧ ✦</span>
      <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to left, transparent, ${colors.primary})` }} />
    </div>
  );

  return (
    <div style={{ fontFamily: '"Playfair Display", serif', color: colors.accent, backgroundColor: colors.secondary, paddingBottom: '80px' }}>
      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* === COVER BACKGROUND === */}
      <section id="section-cover" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
        style={{ background: `linear-gradient(160deg, #1a0e02 0%, ${colors.accent} 45%, #2a1a02 100%)` }}>
        <p className="text-base mb-4" style={{ color: colors.primary }}>✦ ✧ ✦</p>
        <h1 className="text-5xl text-white" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name}</h1>
        <p className="text-2xl my-2" style={{ color: colors.primary, fontFamily: '"Great Vibes", cursive' }}>&amp;</p>
        <h1 className="text-5xl text-white" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name2}</h1>
        {targetDate && (
          <p className="text-xs mt-5 tracking-[0.4em]" style={{ color: `${colors.primary}bb` }}>
            {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </section>

      {/* === BISMILLAH + AYAT + COUNTDOWN === */}
      <section id="section-bismillah" className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: colors.primary }}>Bismillahirrahmanirrahim</p>

          {/* Ornamental framed ayat */}
          <div className="relative max-w-sm mx-auto py-10 px-8 my-4">
            <div className="absolute top-0 left-0 w-8 h-8" style={{ borderTop: `2px solid ${colors.primary}`, borderLeft: `2px solid ${colors.primary}` }} />
            <div className="absolute top-0 right-0 w-8 h-8" style={{ borderTop: `2px solid ${colors.primary}`, borderRight: `2px solid ${colors.primary}` }} />
            <div className="absolute bottom-0 left-0 w-8 h-8" style={{ borderBottom: `2px solid ${colors.primary}`, borderLeft: `2px solid ${colors.primary}` }} />
            <div className="absolute bottom-0 right-0 w-8 h-8" style={{ borderBottom: `2px solid ${colors.primary}`, borderRight: `2px solid ${colors.primary}` }} />
            <div className="absolute inset-3 pointer-events-none" style={{ border: `1px solid ${colors.primary}33` }} />
            <p className="text-xl mb-4" style={{ color: colors.primary }}>✦</p>
            <p className="italic leading-relaxed text-sm opacity-80 mb-4">
              &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.&rdquo;
            </p>
            <p className="text-xs tracking-widest" style={{ color: colors.primary }}>— QS. Ar-Rum: 21</p>
          </div>

          <GoldDivider />
          {targetDate && <Countdown targetDate={targetDate} primaryColor={colors.primary} accentColor={colors.accent} />}
        </ScrollReveal>
      </section>

      {/* === COUPLE === */}
      <section id="section-couple" className="py-20 px-6 text-center"
        style={{ background: `linear-gradient(180deg, ${colors.primary}08, ${colors.primary}18)` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: colors.primary }}>Mempelai</p>
          <GoldDivider />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto mt-4">
            {[
              { photo: heroPhoto, label: 'MEMPELAI PRIA', name: invitation.partner_name, parent: invitation.parent_name, parentLabel: 'Putra dari' },
              { photo: photos[1], label: 'MEMPELAI WANITA', name: invitation.partner_name2, parent: invitation.parent_name2, parentLabel: 'Putri dari' },
            ].map((person, idx) => (
              <div key={idx} className="relative p-8 text-center"
                style={{ backgroundColor: colors.secondary, boxShadow: `0 8px 40px ${colors.primary}22` }}>
                {/* Double-layer ornamental border */}
                <div className="absolute inset-0 pointer-events-none" style={{ border: `3px solid ${colors.primary}cc` }} />
                <div className="absolute inset-2 pointer-events-none" style={{ border: `1px solid ${colors.primary}44` }} />
                {/* Corner ✦ accents */}
                <span className="absolute top-2.5 left-3 text-xs" style={{ color: colors.primary }}>✦</span>
                <span className="absolute top-2.5 right-3 text-xs" style={{ color: colors.primary }}>✦</span>
                <span className="absolute bottom-2.5 left-3 text-xs" style={{ color: colors.primary }}>✦</span>
                <span className="absolute bottom-2.5 right-3 text-xs" style={{ color: colors.primary }}>✦</span>

                {person.photo ? (
                  <div className="relative w-32 h-32 mx-auto mb-5 rounded-full">
                    <div className="absolute inset-0 rounded-full pointer-events-none"
                      style={{ border: `4px solid ${colors.primary}`, boxShadow: `0 0 0 3px ${colors.secondary}, 0 0 0 6px ${colors.primary}88` }} />
                    <img src={person.photo} alt={person.name} className="w-full h-full rounded-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto mb-5 rounded-full flex items-center justify-center text-4xl"
                    style={{ border: `4px solid ${colors.primary}`, boxShadow: `0 0 0 3px ${colors.secondary}, 0 0 0 6px ${colors.primary}88`, background: `${colors.primary}22` }}>
                    ✦
                  </div>
                )}
                <p className="text-xs tracking-[0.3em] mb-2 opacity-60">{person.label}</p>
                <p className="text-3xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.primary }}>{person.name}</p>
                {person.parent && (
                  <>
                    <p className="text-xs opacity-60">{person.parentLabel}</p>
                    <p className="text-sm mt-1 opacity-80">{person.parent}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* === EVENT DETAILS === */}
      <section id="section-event" className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: colors.primary }}>Save The Date</p>
          <GoldDivider />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-4">
            {[
              { title: 'Akad Nikah', date: invitation.date_akad, time: invitation.time_akad },
              { title: 'Resepsi', date: invitation.date_resepsi, time: invitation.time_resepsi },
            ].filter(ev => ev.date || ev.time).map((ev, idx) => (
              <div key={idx} className="relative p-8 text-center"
                style={{ backgroundColor: `${colors.primary}06`, borderTop: `4px solid ${colors.primary}`, border: `1px solid ${colors.primary}33`, borderTopWidth: '4px', boxShadow: `0 4px 24px ${colors.primary}22` }}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3" style={{ backgroundColor: colors.secondary }}>
                  <span className="text-sm" style={{ color: colors.primary }}>✦</span>
                </div>
                <p className="text-3xl mb-3 mt-1" style={{ fontFamily: '"Great Vibes", cursive', color: colors.primary }}>{ev.title}</p>
                <div className="h-px my-3" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}88, transparent)` }} />
                {ev.date && <p className="text-sm font-semibold mb-1">{formatDate(ev.date)}</p>}
                {ev.time && <p className="text-sm opacity-70 mb-4">{ev.time} WIB</p>}
                {invitation.location && <p className="text-xs opacity-70 leading-relaxed mb-5">{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 text-xs font-semibold tracking-[0.2em] uppercase"
                    style={{ background: `linear-gradient(135deg, ${colors.primary}, #e8c96b)`, color: colors.accent, borderRadius: '2px', minHeight: '40px', boxShadow: `0 2px 14px ${colors.primary}55` }}>
                    ✦ Lihat Lokasi
                  </a>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* === GALLERY === */}
      {photos.length > 0 && (
        <section id="section-gallery" className="py-20 px-6"
          style={{ background: `linear-gradient(180deg, ${colors.primary}08, ${colors.primary}18)` }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] text-center mb-2" style={{ color: colors.primary }}>Wedding Gallery</p>
            <GoldDivider />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {photos.map((url, i) => (
                <button key={i} type="button" onClick={() => setLightboxImg(url)}
                  className="aspect-square overflow-hidden cursor-zoom-in relative block"
                  style={{ border: `2px solid ${colors.primary}66`, boxShadow: `0 4px 16px ${colors.primary}22` }}
                  aria-label={`Lihat foto ${i + 1}`}>
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 pointer-events-none" style={{ border: `1px solid ${colors.primary}22`, margin: '4px' }} />
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* === LOVE STORY === */}
      {(storyTimeline || invitation.story) && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: colors.primary }}>Our Love Story</p>
            <GoldDivider />

            {storyTimeline ? (
              <div className="max-w-md mx-auto mt-4 text-left">
                {storyTimeline.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex gap-5">
                      <div className="flex flex-col items-center">
                        {/* Gold numbered circle — double ring */}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${colors.primary}, #e8c96b)`, color: colors.accent, boxShadow: `0 0 0 3px ${colors.secondary}, 0 0 0 5px ${colors.primary}99` }}>
                          {idx + 1}
                        </div>
                        {idx < storyTimeline.length - 1 && (
                          <div className="w-0.5 mt-2 flex-1" style={{ background: `linear-gradient(to bottom, ${colors.primary}99, ${colors.primary}22)`, minHeight: '40px' }} />
                        )}
                      </div>
                      <div className="pt-1 pb-6 flex-1">
                        <p className="text-xs uppercase tracking-[0.25em] font-semibold mb-2" style={{ color: colors.primary }}>{item.title}</p>
                        {item.date && <p className="text-xs opacity-50 mb-3">{item.date}</p>}
                        <p className="text-sm leading-relaxed" style={{ color: colors.accent, opacity: 0.85 }}>{item.description}</p>
                      </div>
                    </div>
                    {idx < storyTimeline.length - 1 && (
                      <p className="text-xs mb-3 ml-14 opacity-50 text-center" style={{ color: colors.primary }}>✦ ✧ ✦</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto mt-4">
                {[
                  { label: 'The Beginning', text: 'Perkenalan yang sederhana menjadi awal dari sebuah perjalanan cinta yang indah.' },
                  { label: 'Becoming One', text: 'Perjalanan kami berlanjut, saling memahami dan tumbuh bersama dalam cinta yang tulus.' },
                  { label: 'The Sacred Promise', text: 'Dan kini, kami siap untuk mengikat janji suci di hadapan Allah SWT dan orang-orang tercinta.' },
                ].map((item, idx) => (
                  <div key={item.label}>
                    <p className="text-xs uppercase tracking-[0.25em] font-semibold mb-2" style={{ color: colors.primary }}>{item.label}</p>
                    <p className="text-sm leading-relaxed" style={{ color: colors.accent, opacity: 0.85 }}>{item.text}</p>
                    {idx < 2 && <p className="text-base my-6" style={{ color: colors.primary }}>✦ ✧ ✦</p>}
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </section>
      )}

      {/* === WEDDING GIFT === */}
      <section className="py-20 px-6 text-center"
        style={{ background: `linear-gradient(180deg, ${colors.primary}08, ${colors.primary}18)` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: colors.primary }}>Wedding Gift</p>
          <GoldDivider />
          <p className="text-sm opacity-70 max-w-xs mx-auto leading-relaxed mb-8">
            Doa restu Anda adalah hadiah terbesar bagi kami. Namun jika berkenan memberikan hadiah, dapat melalui:
          </p>
          <div className="flex flex-col gap-5 max-w-sm mx-auto">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="relative p-6 text-left"
                style={{ backgroundColor: colors.secondary, borderTop: `3px solid ${colors.primary}`, border: `1px solid ${colors.primary}33`, borderTopWidth: '3px', boxShadow: `0 4px 20px ${colors.primary}22` }}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3" style={{ backgroundColor: colors.secondary }}>
                  <span className="text-sm" style={{ color: colors.primary }}>✦</span>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-2" style={{ color: colors.primary }}>{item.bank}</p>
                <p className="text-2xl font-bold mb-1" style={{ color: colors.accent }}>{item.no}</p>
                <p className="text-xs mb-5 opacity-60">a.n. {item.name}</p>
                <button type="button" onClick={() => handleCopy(item.no, item.key)}
                  className="w-full text-sm font-semibold tracking-[0.2em] uppercase transition-all active:scale-95"
                  style={{ minHeight: '44px', ...(copied === item.key
                    ? { background: `linear-gradient(135deg, ${colors.primary}, #e8c96b)`, color: colors.accent, borderRadius: '2px', border: 'none' }
                    : { border: `1.5px solid ${colors.primary}`, color: colors.primary, borderRadius: '2px', backgroundColor: 'transparent' }) }}>
                  {copied === item.key ? '✦ Tersalin!' : 'Copy Rekening'}
                </button>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* === WISHES / RSVP === */}
      <section id="section-wishes" className="py-20 px-6" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] text-center mb-2" style={{ color: colors.primary }}>Wishes &amp; RSVP</p>
          <GoldDivider />
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={colors.primary} accentColor={colors.accent} bgColor={colors.secondary} />
        </ScrollReveal>
      </section>

      {/* === FOOTER === */}
      <footer className="relative py-20 px-6 text-center overflow-hidden"
        style={{ background: `linear-gradient(160deg, #1a0e02 0%, ${colors.accent} 40%, #2a1a02 100%)` }}>
        {/* Scattered ✦ pattern */}
        {[
          'top-5 left-6', 'top-7 right-10', 'top-14 left-1/4', 'top-10 right-1/3',
          'bottom-8 left-8', 'bottom-6 right-10', 'bottom-14 right-1/4', 'bottom-16 left-1/3',
        ].map((pos, i) => (
          <span key={i} className={`absolute ${pos} text-xs pointer-events-none`}
            style={{ color: `${colors.primary}${i % 2 === 0 ? '55' : '33'}` }}>✦</span>
        ))}
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.5em] mb-2" style={{ color: `${colors.primary}aa` }}>Terima Kasih</p>
          <div className="flex items-center justify-center gap-3 my-5">
            <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}88)` }} />
            <span style={{ color: colors.primary }}>✦ ✧ ✦</span>
            <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}88)` }} />
          </div>
          <p className="text-white/60 text-sm max-w-xs mx-auto leading-relaxed mb-8">
            Terima kasih atas doa dan restu yang diberikan kepada kami
          </p>
          <h2 className="text-6xl text-white mb-1" style={{ fontFamily: '"Great Vibes", cursive', textShadow: `0 2px 24px ${colors.primary}99` }}>
            {invitation.partner_name}
          </h2>
          <p className="text-3xl my-2" style={{ color: colors.primary, fontFamily: '"Great Vibes", cursive' }}>&amp;</p>
          <h2 className="text-6xl text-white" style={{ fontFamily: '"Great Vibes", cursive', textShadow: `0 2px 24px ${colors.primary}99` }}>
            {invitation.partner_name2}
          </h2>
          <p className="text-xs mt-10 tracking-[0.3em]" style={{ color: `${colors.primary}66` }}>✦ Made with Love ✦</p>
        </ScrollReveal>
      </footer>

      {/* === BOTTOM NAV === */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-3 backdrop-blur-md"
        style={{ backgroundColor: `${colors.secondary}ee`, borderTop: `1px solid ${colors.primary}44` }}>
        {navItems.map((item) => (
          <button key={item.id} type="button" onClick={() => scrollTo(item.id)}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all hover:scale-110 active:scale-95"
            aria-label={item.label}>
            <span className="text-2xl">{item.icon}</span>
          </button>
        ))}
      </nav>

      {/* Music Button */}
      {invitation.music_url && (
        <button type="button" onClick={toggleMusic}
          className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, #e8c96b)`, color: colors.accent }}
          aria-label={musicPlaying ? 'Pause music' : 'Play music'}>
          <span className={musicPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}>{musicPlaying ? '⏸' : '🎵'}</span>
        </button>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightboxImg(null)} role="dialog" aria-modal="true">
          <img src={lightboxImg} alt="Foto" className="max-w-full max-h-full object-contain"
            style={{ border: `2px solid ${colors.primary}66` }}
            onClick={(e) => e.stopPropagation()} />
          <button type="button" className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white text-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: `1px solid ${colors.primary}66` }}
            onClick={() => setLightboxImg(null)} aria-label="Tutup">×</button>
        </div>
      )}

      {/* Toast */}
      {copied && (
        <div className="fixed bottom-40 left-1/2 z-[60] px-6 py-3 text-sm text-white shadow-xl pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`, transform: 'translateX(-50%)', borderRadius: '2px', boxShadow: `0 4px 20px ${colors.primary}66` }}>
          ✦ Nomor rekening disalin!
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes sparkle { 0%, 100% { opacity: 0.3; transform: scale(0.85); } 50% { opacity: 0.9; transform: scale(1.15); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
