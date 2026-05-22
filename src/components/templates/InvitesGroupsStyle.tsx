'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
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
  const [carouselIdx, setCarouselIdx] = useState(0);
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

  const storyItems = [
    {
      label: 'The Beginning',
      year: '2021',
      text: invitation.story || 'Kisah kita dimulai dari sebuah pertemuan sederhana yang terasa luar biasa.',
    },
    {
      label: 'Becoming One',
      year: '2022',
      text: 'Perjalanan kami berlanjut, saling memahami dan tumbuh bersama dalam cinta yang tulus.',
    },
    {
      label: 'The Sacred Promise',
      year: '2024',
      text: 'Dan kini, kami siap untuk mengikat janji suci di hadapan Allah SWT dan orang-orang tercinta.',
    },
  ];

  return (
    <div style={{ fontFamily: '"Playfair Display", serif', color: colors.accent, backgroundColor: colors.secondary, paddingBottom: '80px' }}>

      {invitation.music_url && (
        <audio ref={audioRef} src={invitation.music_url} loop />
      )}

      {/* === COVER OVERLAY === */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ background: `linear-gradient(160deg, ${colors.accent}f5 0%, ${colors.primary}dd 50%, ${colors.accent}f0 100%)` }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'2\' fill=\'white\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-white/60 text-xs uppercase tracking-[0.4em] mb-4 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]">The Wedding Of</p>

          <h1 className="text-6xl md:text-7xl text-white mb-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ fontFamily: '"Pinyon Script", cursive' }}>
            {invitation.partner_name}
          </h1>
          <p className="text-white/60 text-lg my-3 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]">~ &amp; ~</p>
          <h1 className="text-6xl md:text-7xl text-white mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ fontFamily: '"Pinyon Script", cursive' }}>
            {invitation.partner_name2}
          </h1>

          {targetDate && (
            <p className="text-white/60 text-xs tracking-widest mb-10 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]">
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <button
            type="button"
            onClick={handleOpen}
            className="px-8 py-3 rounded-xl text-sm font-semibold tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-md opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{ backgroundColor: colors.secondary, color: colors.accent, minHeight: '48px' }}
          >
            ✉ Buka Undangan
          </button>
        </div>
      </div>

      {/* === SECTION 1: COVER === */}
      <section id="section-cover" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${colors.accent}f5 0%, ${colors.primary}dd 50%, ${colors.accent}f0 100%)` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'2\' fill=\'white\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '40px 40px' }} />

        <div className="relative z-10">
          <p className="text-white/60 text-xs uppercase tracking-[0.4em] mb-4">The Wedding Of</p>
          <h1 className="text-5xl md:text-6xl text-white mb-1" style={{ fontFamily: '"Pinyon Script", cursive' }}>{invitation.partner_name}</h1>
          <p className="text-white/60 text-lg my-3">~ &amp; ~</p>
          <h1 className="text-5xl md:text-6xl text-white mb-8" style={{ fontFamily: '"Pinyon Script", cursive' }}>{invitation.partner_name2}</h1>
          {targetDate && (
            <p className="text-white/60 text-xs tracking-widest">
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </section>

      {/* === SECTION 2: BISMILLAH + AYAT + COUNTDOWN === */}
      <section id="section-bismillah" className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-4" style={{ color: colors.primary }}>Bismillahirrahmanirrahim</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '66' }} />
          <p className="italic max-w-sm mx-auto leading-relaxed text-sm opacity-80 mb-3">
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.&rdquo;
          </p>
          <p className="text-xs tracking-widest" style={{ color: colors.primary }}>— QS. Ar-Rum: 21</p>
          <div className="w-16 h-px mx-auto my-8" style={{ backgroundColor: colors.primary + '66' }} />
          {targetDate && <Countdown targetDate={targetDate} primaryColor={colors.primary} accentColor={colors.accent} />}
        </ScrollReveal>
      </section>

      {/* === SECTION 3: BRIDE & GROOM === */}
      <section id="section-couple" className="py-20 px-6 text-center" style={{ backgroundColor: colors.primary + '14' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: colors.primary }}>Mempelai</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '66' }} />

          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-8">
            <div className="p-8 rounded-xl text-center" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}44`, boxShadow: `0 8px 24px ${colors.primary}18` }}>
              {heroPhoto && (
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4" style={{ borderColor: colors.primary + '77' }}>
                  <img src={heroPhoto} alt={invitation.partner_name} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs tracking-widest opacity-50 mb-2">MEMPELAI PRIA</p>
              <p className="text-4xl mb-3" style={{ fontFamily: '"Pinyon Script", cursive', color: colors.primary }}>{invitation.partner_name}</p>
              {invitation.parent_name && (
                <>
                  <p className="text-xs opacity-60">Putra dari</p>
                  <p className="text-sm mt-1">{invitation.parent_name}</p>
                </>
              )}
            </div>

            <div className="p-8 rounded-xl text-center" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}44`, boxShadow: `0 8px 24px ${colors.primary}18` }}>
              {photos[1] && (
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4" style={{ borderColor: colors.primary + '77' }}>
                  <img src={photos[1]} alt={invitation.partner_name2} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs tracking-widest opacity-50 mb-2">MEMPELAI WANITA</p>
              <p className="text-4xl mb-3" style={{ fontFamily: '"Pinyon Script", cursive', color: colors.primary }}>{invitation.partner_name2}</p>
              {invitation.parent_name2 && (
                <>
                  <p className="text-xs opacity-60">Putri dari</p>
                  <p className="text-sm mt-1">{invitation.parent_name2}</p>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* === SECTION 4: EVENT DETAILS === */}
      <section id="section-event" className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: colors.primary }}>Save The Date</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '66' }} />

          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-8">
            {(invitation.date_akad || invitation.time_akad) && (
              <div className="p-8 rounded-xl" style={{ backgroundColor: colors.primary + '12', border: `1px solid ${colors.primary}44` }}>
                <p className="text-2xl mb-3" style={{ fontFamily: '"Pinyon Script", cursive', color: colors.primary }}>Akad Nikah</p>
                <div className="w-10 h-px mx-auto my-3" style={{ backgroundColor: colors.primary + '66' }} />
                {invitation.date_akad && <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_akad)}</p>}
                {invitation.time_akad && <p className="text-sm opacity-70 mb-3">{invitation.time_akad} WIB</p>}
                {invitation.location && <p className="text-xs opacity-60 leading-relaxed mb-4">{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.primary, minHeight: '40px' }}>
                    📍 Lihat Lokasi
                  </a>
                )}
              </div>
            )}

            {(invitation.date_resepsi || invitation.time_resepsi) && (
              <div className="p-8 rounded-xl" style={{ backgroundColor: colors.primary + '12', border: `1px solid ${colors.primary}44` }}>
                <p className="text-2xl mb-3" style={{ fontFamily: '"Pinyon Script", cursive', color: colors.primary }}>Resepsi</p>
                <div className="w-10 h-px mx-auto my-3" style={{ backgroundColor: colors.primary + '66' }} />
                {invitation.date_resepsi && <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_resepsi)}</p>}
                {invitation.time_resepsi && <p className="text-sm opacity-70 mb-3">{invitation.time_resepsi} WIB</p>}
                {invitation.location && <p className="text-xs opacity-60 leading-relaxed mb-4">{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.primary, minHeight: '40px' }}>
                    📍 Lihat Lokasi
                  </a>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* === SECTION 5: GALLERY (carousel + grid) === */}
      {photos.length > 0 && (
        <section id="section-gallery" className="py-20 px-6" style={{ backgroundColor: colors.primary + '14' }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: colors.primary }}>Wedding Gallery</p>
            <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '66' }} />

            {/* Carousel */}
            {photos.length > 0 && (
              <div className="relative max-w-sm mx-auto mb-8">
                <div className="aspect-video rounded-xl overflow-hidden" style={{ border: `2px solid ${colors.primary}44` }}>
                  <img src={photos[carouselIdx]} alt={`Foto utama ${carouselIdx + 1}`} className="w-full h-full object-cover transition-opacity duration-300" />
                </div>
                <div className="flex justify-center gap-2 mt-3">
                  {photos.slice(0, 5).map((_, i) => (
                    <button key={i} type="button" onClick={() => setCarouselIdx(i)}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{ backgroundColor: i === carouselIdx ? colors.primary : colors.primary + '44' }}
                      aria-label={`Tampilkan foto ${i + 1}`} />
                  ))}
                </div>
                {photos.length > 1 && (
                  <>
                    <button type="button" onClick={() => setCarouselIdx((carouselIdx - 1 + photos.length) % photos.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: colors.accent + 'cc' }} aria-label="Sebelumnya">‹</button>
                    <button type="button" onClick={() => setCarouselIdx((carouselIdx + 1) % photos.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: colors.accent + 'cc' }} aria-label="Berikutnya">›</button>
                  </>
                )}
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {photos.map((url, i) => (
                <button key={i} type="button" onClick={() => setLightboxImg(url)}
                  className="aspect-square rounded-xl overflow-hidden cursor-zoom-in block"
                  style={{ border: `1px solid ${colors.primary}33` }}
                  aria-label={`Lihat foto ${i + 1}`}>
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* === SECTION 6: LOVE STORY TIMELINE === */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: colors.primary }}>Our Love Story</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '66' }} />

          <div className="max-w-md mx-auto mt-6">
            {storyItems.map((item, idx) => (
              <div key={item.label} className="flex gap-4 mb-8 last:mb-0">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: colors.primary }}>
                    {idx + 1}
                  </div>
                  {idx < storyItems.length - 1 && (
                    <div className="flex-1 w-px mt-2" style={{ backgroundColor: colors.primary + '44', minHeight: '32px' }} />
                  )}
                </div>
                <div className="pt-2 pb-4">
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.primary }}>{item.label}</p>
                  <p className="text-xs opacity-50 mb-2">{item.year}</p>
                  <p className="text-sm italic opacity-75 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* === SECTION 7: WEDDING GIFT === */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.primary + '14' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: colors.primary }}>Wedding Gift</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '66' }} />
          <p className="text-sm opacity-75 max-w-xs mx-auto leading-relaxed mb-8">
            Doa restu Anda adalah hadiah terbesar. Namun jika ingin memberi, dapat melalui:
          </p>
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="p-5 rounded-xl text-left" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}44`, boxShadow: `0 4px 16px ${colors.primary}15` }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.primary }}>{item.bank}</p>
                <p className="text-xl font-bold mb-1" style={{ color: colors.accent }}>{item.no}</p>
                <p className="text-xs mb-4 opacity-60">a.n. {item.name}</p>
                <button type="button" onClick={() => handleCopy(item.no, item.key)}
                  className="w-full rounded-lg text-sm font-semibold transition-all active:scale-95"
                  style={{ minHeight: '44px', ...(copied === item.key ? { backgroundColor: colors.primary, color: '#fff' } : { border: `1.5px solid ${colors.primary}`, color: colors.primary, backgroundColor: 'transparent' }) }}>
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
          <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: colors.primary }}>Wishes &amp; RSVP</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary + '66' }} />
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={colors.primary} accentColor={colors.accent} bgColor={colors.secondary} />
        </ScrollReveal>
      </section>

      {/* === FOOTER === */}
      <footer className="py-16 px-6 text-center" style={{ background: `linear-gradient(160deg, ${colors.accent}f5 0%, ${colors.primary}dd 100%)` }}>
        <ScrollReveal>
          <p className="text-white/60 text-xs uppercase tracking-widest mb-4">Terima Kasih</p>
          <p className="text-white/75 text-sm max-w-xs mx-auto leading-relaxed mb-6">Terima kasih atas doa dan restunya</p>
          <p className="text-5xl text-white" style={{ fontFamily: '"Pinyon Script", cursive' }}>
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
              className="flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all hover:scale-110 active:scale-95"
              aria-label={item.label}>
              <span className="text-2xl">{item.icon}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Music Button */}
      {invitation.music_url && opened && (
        <button type="button" onClick={toggleMusic}
          className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
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
          <img src={lightboxImg} alt="Foto" className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()} />
          <button type="button" className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white text-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} onClick={() => setLightboxImg(null)} aria-label="Tutup">×</button>
        </div>
      )}

      {copied && (
        <div className="fixed bottom-40 left-1/2 z-[60] px-5 py-3 rounded-full text-sm text-white shadow-xl pointer-events-none"
          style={{ backgroundColor: colors.accent, transform: 'translateX(-50%)' }}>
          ✓ Nomor rekening disalin!
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
