'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import { TemplateProps } from './types';

export default function IslamicGreen({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#2e7d4f', secondary: '#f5f9f6', accent: '#1a4a2e' };
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

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => scrollTo('section-bismillah'), 400);
    if (invitation.music_url && audioRef.current) audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else { audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {}); }
  };

  const targetDate = invitation.date_akad || invitation.date_resepsi;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const navItems = [
    { id: 'section-cover', icon: '🏠' }, { id: 'section-couple', icon: '💑' },
    { id: 'section-event', icon: '📅' }, { id: 'section-gallery', icon: '📷' }, { id: 'section-wishes', icon: '💬' },
  ];

  return (
    <div style={{ fontFamily: '"Amiri", "Playfair Display", serif', color: colors.accent, backgroundColor: colors.secondary, paddingBottom: '80px' }}>

      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* COVER OVERLAY */}
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ background: `linear-gradient(180deg, ${colors.accent} 0%, ${colors.primary}dd 100%)` }}>
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-40 h-40 border-2 rotate-45 opacity-20" style={{ borderColor: colors.secondary }} />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-40 border-2 rotate-45 opacity-20" style={{ borderColor: colors.secondary }} />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-white text-2xl mb-2 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]" style={{ direction: 'rtl' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
          <p className="text-white/70 text-xs uppercase tracking-[0.35em] mb-8 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.15s_forwards]">Walimatul 'Urs</p>

          <h1 className="text-6xl md:text-7xl text-white mb-2 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name}</h1>
          <p className="text-3xl my-2 text-white/80 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]" style={{ fontFamily: '"Great Vibes", cursive' }}>&amp;</p>
          <h1 className="text-6xl md:text-7xl text-white mb-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name2}</h1>

          {targetDate && <p className="text-white/80 text-sm tracking-widest mb-12 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]">{new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}

          <button type="button" onClick={handleOpen}
            className="px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-xl opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{ backgroundColor: colors.secondary, color: colors.accent, minHeight: '48px' }}>
            ✉ Buka Undangan
          </button>
        </div>
      </div>

      <section id="section-cover" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
        style={{ background: `linear-gradient(180deg, ${colors.accent} 0%, ${colors.primary}cc 100%)` }}>
        <p className="text-white text-2xl mb-6" style={{ direction: 'rtl' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
        <h1 className="text-5xl md:text-6xl text-white mb-2" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name}</h1>
        <p className="text-3xl my-2 text-white" style={{ fontFamily: '"Great Vibes", cursive' }}>&amp;</p>
        <h1 className="text-5xl md:text-6xl text-white" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name2}</h1>
      </section>

      <section id="section-bismillah" className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-2xl mb-4 leading-loose" style={{ color: colors.primary, direction: 'rtl', fontFamily: 'serif' }}>وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا</p>
          <div className="w-16 h-px mx-auto my-4" style={{ backgroundColor: colors.primary }} />
          <p className="italic max-w-sm mx-auto leading-relaxed text-sm opacity-80 mb-3">
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.&rdquo;
          </p>
          <p className="text-xs tracking-widest mb-8" style={{ color: colors.primary }}>— QS. Ar-Rum: 21</p>
          {targetDate && <Countdown targetDate={targetDate} primaryColor={colors.primary} accentColor={colors.accent} />}
        </ScrollReveal>
      </section>

      <section id="section-couple" className="py-20 px-6 text-center" style={{ backgroundColor: colors.primary + '15' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: colors.primary }}>Mempelai</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary }} />
          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}55` }}>
              {photos[0] && <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4" style={{ borderColor: colors.primary }}><img src={photos[0]} alt="" className="w-full h-full object-cover" /></div>}
              <p className="text-xs tracking-widest opacity-60 mb-2">MEMPELAI PRIA</p>
              <p className="text-2xl mb-2 font-semibold" style={{ color: colors.primary }}>{invitation.partner_name}</p>
              {invitation.parent_name && <><p className="text-xs opacity-70">Putra dari</p><p className="text-sm mt-1">{invitation.parent_name}</p></>}
            </div>
            <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}55` }}>
              {photos[1] && <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4" style={{ borderColor: colors.primary }}><img src={photos[1]} alt="" className="w-full h-full object-cover" /></div>}
              <p className="text-xs tracking-widest opacity-60 mb-2">MEMPELAI WANITA</p>
              <p className="text-2xl mb-2 font-semibold" style={{ color: colors.primary }}>{invitation.partner_name2}</p>
              {invitation.parent_name2 && <><p className="text-xs opacity-70">Putri dari</p><p className="text-sm mt-1">{invitation.parent_name2}</p></>}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="section-event" className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: colors.primary }}>Save The Date</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary }} />
          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {(invitation.date_akad || invitation.time_akad) && (
              <div className="p-8 rounded-2xl" style={{ backgroundColor: colors.primary + '15', border: `1px solid ${colors.primary}44` }}>
                <div className="text-3xl mb-3">🕌</div>
                <p className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Akad Nikah</p>
                {invitation.date_akad && <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_akad)}</p>}
                {invitation.time_akad && <p className="text-sm opacity-80 mb-3">{invitation.time_akad} WIB</p>}
                {invitation.location && <p className="text-xs opacity-80 mb-4">{invitation.location}</p>}
                {invitation.maps_url && <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: colors.primary, minHeight: '40px' }}>📍 Lihat Lokasi</a>}
              </div>
            )}
            {(invitation.date_resepsi || invitation.time_resepsi) && (
              <div className="p-8 rounded-2xl" style={{ backgroundColor: colors.primary + '15', border: `1px solid ${colors.primary}44` }}>
                <div className="text-3xl mb-3">🌙</div>
                <p className="text-lg font-bold mb-2" style={{ color: colors.primary }}>Resepsi</p>
                {invitation.date_resepsi && <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_resepsi)}</p>}
                {invitation.time_resepsi && <p className="text-sm opacity-80 mb-3">{invitation.time_resepsi} WIB</p>}
                {invitation.location && <p className="text-xs opacity-80 mb-4">{invitation.location}</p>}
                {invitation.maps_url && <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: colors.primary, minHeight: '40px' }}>📍 Lihat Lokasi</a>}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {photos.length > 0 && (
        <section id="section-gallery" className="py-20 px-6" style={{ backgroundColor: colors.primary + '15' }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: colors.primary }}>Wedding Gallery</p>
            <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary }} />
            <div className="grid grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {photos.map((url, i) => (
                <button key={i} type="button" onClick={() => setLightboxImg(url)} className="aspect-square rounded-xl overflow-hidden cursor-zoom-in block" aria-label={`Foto ${i + 1}`}>
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {invitation.story && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: colors.primary }}>Our Love Story</p>
            <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary }} />
            <div className="max-w-md mx-auto space-y-8">
              {['The Beginning', 'Becoming One', 'The Sacred Promise'].map((label, idx) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.primary }}>{label}</p>
                  <p className="text-sm italic opacity-80 leading-relaxed">
                    {idx === 0 && invitation.story}
                    {idx === 1 && 'Perjalanan kami berlanjut dalam ridho Allah.'}
                    {idx === 2 && 'Kini kami mengikat janji suci di hadapan-Nya.'}
                  </p>
                  {idx < 2 && <p className="text-xl mt-6" style={{ color: colors.primary }}>✦</p>}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.primary + '15' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: colors.primary }}>Wedding Gift</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary }} />
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="p-5 rounded-2xl text-left" style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}44` }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.primary }}>{item.bank}</p>
                <p className="text-xl font-bold mb-1" style={{ color: colors.accent }}>{item.no}</p>
                <p className="text-xs mb-4 opacity-70">a.n. {item.name}</p>
                <button type="button" onClick={() => handleCopy(item.no, item.key)}
                  className="w-full rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{ minHeight: '44px', ...(copied === item.key ? { backgroundColor: colors.primary, color: '#fff' } : { border: `1.5px solid ${colors.primary}`, color: colors.primary }) }}>
                  {copied === item.key ? '✓ Tersalin!' : 'Copy Rekening'}
                </button>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section id="section-wishes" className="py-20 px-6" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: colors.primary }}>Wishes &amp; RSVP</p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: colors.primary }} />
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={colors.primary} accentColor={colors.accent} bgColor={colors.secondary} />
        </ScrollReveal>
      </section>

      <footer className="py-16 px-6 text-center" style={{ background: `linear-gradient(180deg, ${colors.accent}, ${colors.primary}cc)` }}>
        <p className="text-white/80 text-sm mb-4">Wassalamualaikum Warahmatullahi Wabarakatuh</p>
        <p className="text-white/70 text-sm mb-6">Terima kasih atas doa dan restunya</p>
        <p className="text-5xl text-white mt-4" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name} &amp; {invitation.partner_name2}</p>
        <p className="text-white/50 text-xs mt-8">© Made with Love</p>
      </footer>

      {opened && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-3 backdrop-blur-md"
          style={{ backgroundColor: colors.secondary + 'ee', borderTop: `1px solid ${colors.primary}33` }}>
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => scrollTo(item.id)}
              className="flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all hover:scale-110 active:scale-95">
              <span className="text-2xl">{item.icon}</span>
            </button>
          ))}
        </nav>
      )}

      {invitation.music_url && opened && (
        <button type="button" onClick={toggleMusic}
          className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          style={{ backgroundColor: colors.primary, color: '#fff' }}
          aria-label="Toggle music">
          <span className={musicPlaying ? 'animate-spin-slow' : ''}>{musicPlaying ? '⏸' : '🎵'}</span>
        </button>
      )}

      {lightboxImg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.92)' }} onClick={() => setLightboxImg(null)} role="dialog" aria-modal="true">
          <img src={lightboxImg} alt="Foto" className="max-w-full max-h-full object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
          <button type="button" className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white text-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} onClick={() => setLightboxImg(null)} aria-label="Tutup">×</button>
        </div>
      )}

      {copied && (
        <div className="fixed bottom-40 left-1/2 z-[60] px-5 py-3 rounded-full text-sm text-white shadow-xl pointer-events-none"
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
