'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
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

  return (
    <div style={{ fontFamily: '"Playfair Display", serif', color: colors.accent, backgroundColor: colors.secondary, paddingBottom: '80px' }}>

      {invitation.music_url && (
        <audio ref={audioRef} src={invitation.music_url} loop />
      )}

      {/* === COVER OVERLAY === */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ background: `linear-gradient(180deg, #1a1208 0%, ${colors.accent}f0 50%, #1a1208 100%)` }}
      >
        {/* Gold line top */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)` }} />

        {/* Corner ornaments */}
        <div className="absolute top-8 left-8 w-16 h-16 opacity-40" style={{ borderTop: `2px solid ${colors.primary}`, borderLeft: `2px solid ${colors.primary}` }} />
        <div className="absolute top-8 right-8 w-16 h-16 opacity-40" style={{ borderTop: `2px solid ${colors.primary}`, borderRight: `2px solid ${colors.primary}` }} />
        <div className="absolute bottom-8 left-8 w-16 h-16 opacity-40" style={{ borderBottom: `2px solid ${colors.primary}`, borderLeft: `2px solid ${colors.primary}` }} />
        <div className="absolute bottom-8 right-8 w-16 h-16 opacity-40" style={{ borderBottom: `2px solid ${colors.primary}`, borderRight: `2px solid ${colors.primary}` }} />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.5em] mb-6 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]" style={{ color: colors.primary }}>The Wedding Of</p>

          <h1 className="text-6xl md:text-7xl text-white mb-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {invitation.partner_name}
          </h1>
          <p className="text-2xl my-3 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]" style={{ color: colors.primary }}>✦ &amp; ✦</p>
          <h1 className="text-6xl md:text-7xl text-white mb-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {invitation.partner_name2}
          </h1>

          {targetDate && (
            <p className="text-white/60 text-xs tracking-[0.3em] mb-12 uppercase opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]">
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <button
            type="button"
            onClick={handleOpen}
            className="px-10 py-3 text-sm font-semibold tracking-[0.3em] uppercase transition-all hover:scale-105 active:scale-95 shadow-lg opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{ backgroundColor: 'transparent', color: colors.primary, border: `1.5px solid ${colors.primary}`, minHeight: '48px' }}
          >
            ✉ Buka Undangan
          </button>
        </div>
      </div>

      {/* === SECTION 1: COVER === */}
      <section id="section-cover" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1a1208 0%, #2c1f0a 60%, #1a1208 100%)' }}>
        {/* Subtle video placeholder with gradient overlay */}
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at center, ${colors.primary}66 0%, transparent 70%)` }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: colors.primary + '88' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: colors.primary + '88' }} />

        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.5em] mb-6" style={{ color: colors.primary }}>The Wedding Of</p>
          <h1 className="text-5xl md:text-6xl text-white mb-1" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name}</h1>
          <p className="text-2xl my-3" style={{ color: colors.primary }}>✦ &amp; ✦</p>
          <h1 className="text-5xl md:text-6xl text-white mb-8" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name2}</h1>
          {targetDate && (
            <p className="text-white/60 text-xs tracking-[0.3em] uppercase">
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </section>

      {/* === SECTION 2: BISMILLAH + AYAT + COUNTDOWN === */}
      <section id="section-bismillah" className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: colors.primary }}>Bismillahirrahmanirrahim</p>
          <div className="flex items-center gap-4 justify-center my-6">
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
            <span style={{ color: colors.primary }}>✦</span>
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
          </div>
          <p className="italic max-w-sm mx-auto leading-relaxed text-sm opacity-80 mb-3">
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.&rdquo;
          </p>
          <p className="text-xs tracking-widest" style={{ color: colors.primary }}>— QS. Ar-Rum: 21</p>
          <div className="flex items-center gap-4 justify-center my-8">
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
            <span style={{ color: colors.primary }}>✦</span>
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
          </div>
          {targetDate && <Countdown targetDate={targetDate} primaryColor={colors.primary} accentColor={colors.accent} />}
        </ScrollReveal>
      </section>

      {/* === SECTION 3: BRIDE & GROOM === */}
      <section id="section-couple" className="py-20 px-6 text-center" style={{ background: `linear-gradient(160deg, ${colors.accent}0d 0%, ${colors.primary}0d 100%)` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: colors.primary }}>Mempelai</p>
          <div className="flex items-center gap-4 justify-center my-6">
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
            <span style={{ color: colors.primary }}>✦</span>
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
          </div>

          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-8">
            <div className="p-8 text-center" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}44`, boxShadow: `0 4px 24px ${colors.primary}1a` }}>
              {heroPhoto && (
                <div className="w-32 h-32 mx-auto mb-4 overflow-hidden border-2" style={{ borderColor: colors.primary }}>
                  <img src={heroPhoto} alt={invitation.partner_name} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs tracking-[0.3em] uppercase opacity-50 mb-3">Mempelai Pria</p>
              <p className="text-3xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.primary }}>{invitation.partner_name}</p>
              {invitation.parent_name && (
                <>
                  <p className="text-xs opacity-60 mb-1">Putra dari</p>
                  <p className="text-sm">{invitation.parent_name}</p>
                </>
              )}
            </div>

            <div className="p-8 text-center" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}44`, boxShadow: `0 4px 24px ${colors.primary}1a` }}>
              {photos[1] && (
                <div className="w-32 h-32 mx-auto mb-4 overflow-hidden border-2" style={{ borderColor: colors.primary }}>
                  <img src={photos[1]} alt={invitation.partner_name2} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs tracking-[0.3em] uppercase opacity-50 mb-3">Mempelai Wanita</p>
              <p className="text-3xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.primary }}>{invitation.partner_name2}</p>
              {invitation.parent_name2 && (
                <>
                  <p className="text-xs opacity-60 mb-1">Putri dari</p>
                  <p className="text-sm">{invitation.parent_name2}</p>
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
          <div className="flex items-center gap-4 justify-center my-6">
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
            <span style={{ color: colors.primary }}>✦</span>
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
          </div>

          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-8">
            {(invitation.date_akad || invitation.time_akad) && (
              <div className="p-8" style={{ backgroundColor: colors.accent + '0d', border: `1px solid ${colors.primary}44` }}>
                <p className="text-2xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.primary }}>Akad Nikah</p>
                <div className="w-8 h-px mx-auto my-3" style={{ backgroundColor: colors.primary }} />
                {invitation.date_akad && <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_akad)}</p>}
                {invitation.time_akad && <p className="text-sm opacity-70 mb-3">{invitation.time_akad} WIB</p>}
                {invitation.location && <p className="text-xs opacity-60 leading-relaxed mb-4">{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-widest uppercase"
                    style={{ border: `1px solid ${colors.primary}`, color: colors.primary, minHeight: '40px' }}>
                    📍 Lokasi
                  </a>
                )}
              </div>
            )}

            {(invitation.date_resepsi || invitation.time_resepsi) && (
              <div className="p-8" style={{ backgroundColor: colors.accent + '0d', border: `1px solid ${colors.primary}44` }}>
                <p className="text-2xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.primary }}>Resepsi</p>
                <div className="w-8 h-px mx-auto my-3" style={{ backgroundColor: colors.primary }} />
                {invitation.date_resepsi && <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_resepsi)}</p>}
                {invitation.time_resepsi && <p className="text-sm opacity-70 mb-3">{invitation.time_resepsi} WIB</p>}
                {invitation.location && <p className="text-xs opacity-60 leading-relaxed mb-4">{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-widest uppercase"
                    style={{ border: `1px solid ${colors.primary}`, color: colors.primary, minHeight: '40px' }}>
                    📍 Lokasi
                  </a>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* === SECTION 5: GALLERY === */}
      {photos.length > 0 && (
        <section id="section-gallery" className="py-20 px-6" style={{ background: `linear-gradient(160deg, ${colors.accent}0d 0%, ${colors.primary}0d 100%)` }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] text-center mb-2" style={{ color: colors.primary }}>Wedding Gallery</p>
            <div className="flex items-center gap-4 justify-center my-6">
              <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
              <span style={{ color: colors.primary }}>✦</span>
              <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
            </div>
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
            <div className="flex items-center gap-4 justify-center my-6">
              <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
              <span style={{ color: colors.primary }}>✦</span>
              <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
            </div>

            <div className="max-w-md mx-auto space-y-8 mt-6">
              {['The Beginning', 'Becoming One', 'The Sacred Promise'].map((label, idx) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: colors.primary }}>{label}</p>
                  <p className="text-sm italic opacity-70 leading-relaxed">
                    {idx === 0 && invitation.story}
                    {idx === 1 && 'Perjalanan kami berlanjut, saling memahami dan tumbuh bersama dalam cinta yang tulus.'}
                    {idx === 2 && 'Dan kini, kami siap untuk mengikat janji suci di hadapan Allah SWT dan orang-orang tercinta.'}
                  </p>
                  {idx < 2 && <p className="text-lg mt-6" style={{ color: colors.primary }}>✦</p>}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* === SECTION 7: WEDDING GIFT === */}
      <section className="py-20 px-6 text-center" style={{ background: `linear-gradient(160deg, ${colors.accent}0d 0%, ${colors.primary}0d 100%)` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: colors.primary }}>Wedding Gift</p>
          <div className="flex items-center gap-4 justify-center my-6">
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
            <span style={{ color: colors.primary }}>✦</span>
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
          </div>
          <p className="text-sm opacity-70 max-w-xs mx-auto leading-relaxed mb-8">
            Doa restu Anda adalah hadiah terbesar. Namun jika ingin memberi, dapat melalui:
          </p>
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="p-5 text-left" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}44`, boxShadow: `0 2px 16px ${colors.primary}11` }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.primary }}>{item.bank}</p>
                <p className="text-xl font-bold mb-1" style={{ color: colors.accent }}>{item.no}</p>
                <p className="text-xs mb-4 opacity-60">a.n. {item.name}</p>
                <button type="button" onClick={() => handleCopy(item.no, item.key)}
                  className="w-full text-sm font-semibold tracking-widest uppercase transition-all active:scale-95"
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
          <div className="flex items-center gap-4 justify-center my-6">
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
            <span style={{ color: colors.primary }}>✦</span>
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
          </div>
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={colors.primary} accentColor={colors.accent} bgColor={colors.secondary} />
        </ScrollReveal>
      </section>

      {/* === FOOTER === */}
      <footer className="py-16 px-6 text-center" style={{ background: 'linear-gradient(180deg, #1a1208 0%, #2c1f0a 100%)' }}>
        <ScrollReveal>
          <div className="flex items-center gap-4 justify-center mb-8">
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
            <span style={{ color: colors.primary }}>✦</span>
            <div className="flex-1 h-px max-w-16" style={{ backgroundColor: colors.primary + '66' }} />
          </div>
          <p className="text-white/50 text-xs uppercase tracking-[0.4em] mb-4">Terima Kasih</p>
          <p className="text-5xl text-white mb-4" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {invitation.partner_name} &amp; {invitation.partner_name2}
          </p>
          <p className="text-white/50 text-xs mt-8">© Made with Love</p>
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
