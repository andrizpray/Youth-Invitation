'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
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
    setTimeout(() => scrollTo('section-bismillah'), 400);
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
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const heroPhoto = photos[0];

  const navItems = [
    { id: 'section-cover', icon: '🏠', label: 'Home' },
    { id: 'section-couple', icon: '💑', label: 'Couple' },
    { id: 'section-event', icon: '📅', label: 'Event' },
    { id: 'section-gallery', icon: '📷', label: 'Gallery' },
    { id: 'section-wishes', icon: '💬', label: 'Wishes' },
  ];

  /* Decorative corner ornament SVG */
  const CornerOrnament = ({ flip = false }: { flip?: boolean }) => (
    <svg
      width="60" height="60" viewBox="0 0 60 60" fill="none"
      className="absolute"
      style={{
        top: flip ? 'auto' : '16px',
        bottom: flip ? '16px' : 'auto',
        left: '16px',
        transform: flip ? 'scaleY(-1)' : 'none',
        opacity: 0.4,
      }}
      aria-hidden="true"
    >
      <path d="M4 4 L4 28 M4 4 L28 4" stroke={colors.primary} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4" cy="4" r="2" fill={colors.primary} />
      <path d="M14 14 L14 22 M14 14 L22 14" stroke={colors.primary} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );

  const CornerOrnamentRight = ({ flip = false }: { flip?: boolean }) => (
    <svg
      width="60" height="60" viewBox="0 0 60 60" fill="none"
      className="absolute"
      style={{
        top: flip ? 'auto' : '16px',
        bottom: flip ? '16px' : 'auto',
        right: '16px',
        transform: flip ? 'scale(-1, -1)' : 'scaleX(-1)',
        opacity: 0.4,
      }}
      aria-hidden="true"
    >
      <path d="M4 4 L4 28 M4 4 L28 4" stroke={colors.primary} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4" cy="4" r="2" fill={colors.primary} />
      <path d="M14 14 L14 22 M14 14 L22 14" stroke={colors.primary} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );

  return (
    <div style={{ fontFamily: '"Playfair Display SC", serif', color: colors.accent, backgroundColor: colors.secondary, paddingBottom: '80px' }}>

      {invitation.music_url && (
        <audio ref={audioRef} src={invitation.music_url} loop />
      )}

      {/* === COVER OVERLAY === */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ background: `linear-gradient(160deg, ${colors.accent} 0%, ${colors.primary}dd 50%, ${colors.accent}ee 100%)` }}
      >
        <CornerOrnament />
        <CornerOrnamentRight />
        <CornerOrnament flip />
        <CornerOrnamentRight flip />

        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at 30% 50%, ${colors.secondary} 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, ${colors.secondary} 0%, transparent 60%)` }} />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-white/60 text-xs uppercase tracking-[0.5em] mb-6 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]">The Wedding Of</p>

          <h1 className="text-5xl md:text-6xl text-white mb-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ fontFamily: '"Great Vibes", cursive', letterSpacing: '0.02em' }}>
            {invitation.partner_name}
          </h1>
          <p className="text-xl my-3 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]" style={{ color: colors.secondary + 'cc' }}>— &amp; —</p>
          <h1 className="text-5xl md:text-6xl text-white mb-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ fontFamily: '"Great Vibes", cursive', letterSpacing: '0.02em' }}>
            {invitation.partner_name2}
          </h1>

          {targetDate && (
            <p className="text-white/50 text-xs tracking-[0.4em] uppercase mb-12 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]">
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <button
            type="button"
            onClick={handleOpen}
            className="px-8 py-3 rounded-none text-sm font-semibold tracking-[0.3em] uppercase transition-all hover:scale-105 active:scale-95 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{ backgroundColor: colors.secondary, color: colors.accent, minHeight: '48px' }}
          >
            ✉ Buka Undangan
          </button>
        </div>
      </div>

      {/* === SECTION 1: COVER (full bg hero with gradient fallback) === */}
      <section id="section-cover" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden"
        style={{ background: heroPhoto ? `linear-gradient(160deg, ${colors.accent}cc 0%, ${colors.primary}aa 100%), url(${heroPhoto}) center/cover no-repeat` : `linear-gradient(160deg, ${colors.accent} 0%, ${colors.primary}dd 50%, ${colors.accent}ee 100%)` }}>

        <div className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(to bottom, ${colors.accent}88 0%, ${colors.accent}cc 100%)` }} />

        {/* Corner ornaments on the section itself */}
        <div className="absolute top-4 left-4 w-12 h-12 opacity-50" style={{ borderTop: `1.5px solid ${colors.secondary}`, borderLeft: `1.5px solid ${colors.secondary}` }} />
        <div className="absolute top-4 right-4 w-12 h-12 opacity-50" style={{ borderTop: `1.5px solid ${colors.secondary}`, borderRight: `1.5px solid ${colors.secondary}` }} />
        <div className="absolute bottom-24 left-4 w-12 h-12 opacity-50" style={{ borderBottom: `1.5px solid ${colors.secondary}`, borderLeft: `1.5px solid ${colors.secondary}` }} />
        <div className="absolute bottom-24 right-4 w-12 h-12 opacity-50" style={{ borderBottom: `1.5px solid ${colors.secondary}`, borderRight: `1.5px solid ${colors.secondary}` }} />

        <div className="relative z-10">
          <p className="text-white/60 text-xs uppercase tracking-[0.5em] mb-4">The Wedding Of</p>
          <h1 className="text-5xl md:text-6xl text-white mb-1" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name}</h1>
          <p className="text-xl my-3 text-white/60">— &amp; —</p>
          <h1 className="text-5xl md:text-6xl text-white mb-8" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name2}</h1>
          {targetDate && (
            <p className="text-white/50 text-xs tracking-[0.4em] uppercase">
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </section>

      {/* === SECTION 2: BISMILLAH + AYAT + COUNTDOWN === */}
      <section id="section-bismillah" className="py-20 px-6 text-center relative" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: colors.primary }}>Bismillahirrahmanirrahim</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '55' }} />
          <p className="italic max-w-sm mx-auto leading-relaxed text-sm opacity-80 mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.&rdquo;
          </p>
          <p className="text-xs tracking-widest" style={{ color: colors.primary }}>— QS. Ar-Rum: 21</p>
          <div className="w-16 h-px mx-auto my-8" style={{ backgroundColor: colors.primary + '55' }} />
          {targetDate && <Countdown targetDate={targetDate} primaryColor={colors.primary} accentColor={colors.accent} />}
        </ScrollReveal>
      </section>

      {/* === SECTION 3: BRIDE & GROOM === */}
      <section id="section-couple" className="py-20 px-6 text-center" style={{ backgroundColor: colors.primary + '12' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: colors.primary }}>Mempelai</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '55' }} />

          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-8">
            <div className="p-8 text-center relative" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}44`, boxShadow: `0 8px 32px ${colors.primary}15` }}>
              <div className="absolute top-2 left-2 w-6 h-6 opacity-30" style={{ borderTop: `1px solid ${colors.primary}`, borderLeft: `1px solid ${colors.primary}` }} />
              <div className="absolute top-2 right-2 w-6 h-6 opacity-30" style={{ borderTop: `1px solid ${colors.primary}`, borderRight: `1px solid ${colors.primary}` }} />
              <div className="absolute bottom-2 left-2 w-6 h-6 opacity-30" style={{ borderBottom: `1px solid ${colors.primary}`, borderLeft: `1px solid ${colors.primary}` }} />
              <div className="absolute bottom-2 right-2 w-6 h-6 opacity-30" style={{ borderBottom: `1px solid ${colors.primary}`, borderRight: `1px solid ${colors.primary}` }} />

              {heroPhoto && (
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4" style={{ borderColor: colors.primary + '66' }}>
                  <img src={heroPhoto} alt={invitation.partner_name} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs tracking-[0.3em] uppercase opacity-50 mb-2">Mempelai Pria</p>
              <p className="text-3xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.primary }}>{invitation.partner_name}</p>
              {invitation.parent_name && (
                <>
                  <p className="text-xs opacity-60" style={{ fontFamily: '"Playfair Display", serif' }}>Putra dari</p>
                  <p className="text-sm mt-1" style={{ fontFamily: '"Playfair Display", serif' }}>{invitation.parent_name}</p>
                </>
              )}
            </div>

            <div className="p-8 text-center relative" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}44`, boxShadow: `0 8px 32px ${colors.primary}15` }}>
              <div className="absolute top-2 left-2 w-6 h-6 opacity-30" style={{ borderTop: `1px solid ${colors.primary}`, borderLeft: `1px solid ${colors.primary}` }} />
              <div className="absolute top-2 right-2 w-6 h-6 opacity-30" style={{ borderTop: `1px solid ${colors.primary}`, borderRight: `1px solid ${colors.primary}` }} />
              <div className="absolute bottom-2 left-2 w-6 h-6 opacity-30" style={{ borderBottom: `1px solid ${colors.primary}`, borderLeft: `1px solid ${colors.primary}` }} />
              <div className="absolute bottom-2 right-2 w-6 h-6 opacity-30" style={{ borderBottom: `1px solid ${colors.primary}`, borderRight: `1px solid ${colors.primary}` }} />

              {photos[1] && (
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4" style={{ borderColor: colors.primary + '66' }}>
                  <img src={photos[1]} alt={invitation.partner_name2} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs tracking-[0.3em] uppercase opacity-50 mb-2">Mempelai Wanita</p>
              <p className="text-3xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.primary }}>{invitation.partner_name2}</p>
              {invitation.parent_name2 && (
                <>
                  <p className="text-xs opacity-60" style={{ fontFamily: '"Playfair Display", serif' }}>Putri dari</p>
                  <p className="text-sm mt-1" style={{ fontFamily: '"Playfair Display", serif' }}>{invitation.parent_name2}</p>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* === SECTION 4: EVENT DETAILS === */}
      <section id="section-event" className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: colors.primary }}>Save The Date</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '55' }} />

          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-8">
            {(invitation.date_akad || invitation.time_akad) && (
              <div className="p-8 relative" style={{ backgroundColor: colors.primary + '10', border: `1px solid ${colors.primary}44` }}>
                <div className="absolute top-2 left-2 w-5 h-5 opacity-25" style={{ borderTop: `1px solid ${colors.primary}`, borderLeft: `1px solid ${colors.primary}` }} />
                <div className="absolute top-2 right-2 w-5 h-5 opacity-25" style={{ borderTop: `1px solid ${colors.primary}`, borderRight: `1px solid ${colors.primary}` }} />
                <p className="text-2xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.primary }}>Akad Nikah</p>
                <div className="w-10 h-px mx-auto my-3" style={{ backgroundColor: colors.primary + '55' }} />
                {invitation.date_akad && <p className="text-sm font-semibold mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>{formatDate(invitation.date_akad)}</p>}
                {invitation.time_akad && <p className="text-sm opacity-70 mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>{invitation.time_akad} WIB</p>}
                {invitation.location && <p className="text-xs opacity-60 leading-relaxed mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.primary, minHeight: '40px' }}>
                    📍 Lihat Lokasi
                  </a>
                )}
              </div>
            )}

            {(invitation.date_resepsi || invitation.time_resepsi) && (
              <div className="p-8 relative" style={{ backgroundColor: colors.primary + '10', border: `1px solid ${colors.primary}44` }}>
                <div className="absolute top-2 left-2 w-5 h-5 opacity-25" style={{ borderTop: `1px solid ${colors.primary}`, borderLeft: `1px solid ${colors.primary}` }} />
                <div className="absolute top-2 right-2 w-5 h-5 opacity-25" style={{ borderTop: `1px solid ${colors.primary}`, borderRight: `1px solid ${colors.primary}` }} />
                <p className="text-2xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.primary }}>Resepsi</p>
                <div className="w-10 h-px mx-auto my-3" style={{ backgroundColor: colors.primary + '55' }} />
                {invitation.date_resepsi && <p className="text-sm font-semibold mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>{formatDate(invitation.date_resepsi)}</p>}
                {invitation.time_resepsi && <p className="text-sm opacity-70 mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>{invitation.time_resepsi} WIB</p>}
                {invitation.location && <p className="text-xs opacity-60 leading-relaxed mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.primary, minHeight: '40px' }}>
                    📍 Lihat Lokasi
                  </a>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* === SECTION 5: GALLERY === */}
      {photos.length > 0 && (
        <section id="section-gallery" className="py-20 px-6" style={{ backgroundColor: colors.primary + '12' }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] text-center mb-2" style={{ color: colors.primary }}>Wedding Gallery</p>
            <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '55' }} />
            <div className="grid grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {photos.map((url, i) => (
                <button key={i} type="button" onClick={() => setLightboxImg(url)}
                  className="aspect-square overflow-hidden cursor-zoom-in block"
                  style={{ border: `1px solid ${colors.primary}33` }}
                  aria-label={`Lihat foto ${i + 1}`}>
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* === SECTION 6: LOVE STORY === */}
      {invitation.story && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: colors.primary }}>Our Love Story</p>
            <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '55' }} />

            <div className="max-w-md mx-auto space-y-8 mt-6">
              {['The Beginning', 'Becoming One', 'The Sacred Promise'].map((label, idx) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.primary }}>{label}</p>
                  <p className="text-sm italic opacity-75 leading-relaxed" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {idx === 0 && invitation.story}
                    {idx === 1 && 'Perjalanan kami berlanjut, saling memahami dan tumbuh bersama dalam cinta yang tulus.'}
                    {idx === 2 && 'Dan kini, kami siap untuk mengikat janji suci di hadapan Allah SWT dan orang-orang tercinta.'}
                  </p>
                  {idx < 2 && <div className="w-12 h-px mx-auto mt-6" style={{ backgroundColor: colors.primary + '55' }} />}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* === SECTION 7: WEDDING GIFT === */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.primary + '12' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: colors.primary }}>Wedding Gift</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '55' }} />
          <p className="text-sm opacity-75 max-w-xs mx-auto leading-relaxed mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>
            Doa restu Anda adalah hadiah terbesar. Namun jika ingin memberi, dapat melalui:
          </p>
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="p-5 text-left relative" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}44` }}>
                <div className="absolute top-2 left-2 w-4 h-4 opacity-25" style={{ borderTop: `1px solid ${colors.primary}`, borderLeft: `1px solid ${colors.primary}` }} />
                <div className="absolute bottom-2 right-2 w-4 h-4 opacity-25" style={{ borderBottom: `1px solid ${colors.primary}`, borderRight: `1px solid ${colors.primary}` }} />
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.primary }}>{item.bank}</p>
                <p className="text-xl font-bold mb-1" style={{ color: colors.accent }}>{item.no}</p>
                <p className="text-xs mb-4 opacity-60">a.n. {item.name}</p>
                <button type="button" onClick={() => handleCopy(item.no, item.key)}
                  className="w-full text-sm font-semibold transition-all active:scale-95"
                  style={{ minHeight: '44px', ...(copied === item.key ? { backgroundColor: colors.primary, color: '#fff' } : { border: `1px solid ${colors.primary}`, color: colors.primary, backgroundColor: 'transparent' }) }}>
                  {copied === item.key ? '✓ Tersalin!' : 'Copy Rekening'}
                </button>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* === SECTION 8: WISHES / RSVP === */}
      <section id="section-wishes" className="py-20 px-6" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] text-center mb-2" style={{ color: colors.primary }}>Wishes &amp; RSVP</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '55' }} />
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={colors.primary} accentColor={colors.accent} bgColor={colors.secondary} />
        </ScrollReveal>
      </section>

      {/* === FOOTER === */}
      <footer className="py-16 px-6 text-center relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${colors.accent} 0%, ${colors.primary}ee 100%)` }}>
        <ScrollReveal>
          <div className="absolute top-4 left-4 w-10 h-10 opacity-25" style={{ borderTop: `1px solid white`, borderLeft: `1px solid white` }} />
          <div className="absolute top-4 right-4 w-10 h-10 opacity-25" style={{ borderTop: `1px solid white`, borderRight: `1px solid white` }} />
          <div className="absolute bottom-4 left-4 w-10 h-10 opacity-25" style={{ borderBottom: `1px solid white`, borderLeft: `1px solid white` }} />
          <div className="absolute bottom-4 right-4 w-10 h-10 opacity-25" style={{ borderBottom: `1px solid white`, borderRight: `1px solid white` }} />

          <p className="text-white/60 text-xs uppercase tracking-widest mb-4">Terima Kasih</p>
          <p className="text-white/75 text-sm max-w-xs mx-auto leading-relaxed mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>Terima kasih atas doa dan restunya</p>
          <p className="text-5xl text-white" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {invitation.partner_name} &amp; {invitation.partner_name2}
          </p>
          <p className="text-white/40 text-xs mt-8">© Made with Love</p>
        </ScrollReveal>
      </footer>

      {/* === BOTTOM NAV === */}
      {opened && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-3 backdrop-blur-md"
          style={{ backgroundColor: colors.secondary + 'ee', borderTop: `1px solid ${colors.primary}33` }}>
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => scrollTo(item.id)}
              className="flex flex-col items-center justify-center w-14 h-14 transition-all hover:scale-110 active:scale-95"
              aria-label={item.label}>
              <span className="text-2xl">{item.icon}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Music Button */}
      {invitation.music_url && opened && (
        <button type="button" onClick={toggleMusic}
          className="fixed bottom-24 right-4 z-40 w-12 h-12 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: colors.primary, color: '#fff' }}
          aria-label={musicPlaying ? 'Pause music' : 'Play music'}>
          <span className={musicPlaying ? 'animate-spin-slow' : ''}>{musicPlaying ? '⏸' : '🎵'}</span>
        </button>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightboxImg(null)} role="dialog" aria-modal="true">
          <img src={lightboxImg} alt="Foto" className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()} />
          <button type="button" className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white text-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} onClick={() => setLightboxImg(null)} aria-label="Tutup">×</button>
        </div>
      )}

      {copied && (
        <div className="fixed bottom-40 left-1/2 z-[60] px-5 py-3 text-sm text-white shadow-xl pointer-events-none"
          style={{ backgroundColor: colors.accent, transform: 'translateX(-50%)' }}>
          ✓ Nomor rekening disalin!
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
