'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import { TemplateProps } from './types';

export default function ModernMinimal({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#2d2d2d', secondary: '#f8f8f8', accent: '#888888' };
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

  const nearBlack = colors.primary || '#2d2d2d';
  const offWhite = colors.secondary || '#f8f8f8';
  const gray = colors.accent || '#888888';

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
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif', backgroundColor: offWhite, color: nearBlack, paddingBottom: '80px' }}>

      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* COVER OVERLAY */}
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-8 text-center overflow-hidden transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ backgroundColor: nearBlack }}>
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <rect x="10%" y="10%" width="80%" height="80%" stroke={offWhite} strokeWidth="0.5" fill="none" opacity="0.1" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.5em] mb-12 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]" style={{ color: offWhite + '88' }}>Wedding Invitation</p>

          <h1 className="font-extralight mb-3 leading-none opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]"
            style={{ color: offWhite, fontSize: 'clamp(2.5rem, 10vw, 4rem)', letterSpacing: '-0.02em' }}>{invitation.partner_name}</h1>
          <div className="flex items-center gap-4 my-6 w-full max-w-xs opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]">
            <div style={{ height: '1px', flex: 1, backgroundColor: offWhite + '44' }} />
            <span style={{ color: offWhite }}>◆</span>
            <div style={{ height: '1px', flex: 1, backgroundColor: offWhite + '44' }} />
          </div>
          <h2 className="font-extralight mb-12 leading-none opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]"
            style={{ color: offWhite, fontSize: 'clamp(2.5rem, 10vw, 4rem)', letterSpacing: '-0.02em' }}>{invitation.partner_name2}</h2>

          {targetDate && (
            <p className="text-xs uppercase tracking-[0.3em] mb-12 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]" style={{ color: offWhite + 'bb' }}>
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <button type="button" onClick={handleOpen}
            className="px-8 py-3 text-sm font-semibold tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95 shadow-lg opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{ backgroundColor: offWhite, color: nearBlack, minHeight: '48px', borderRadius: '2px' }}>
            Open Invitation
          </button>
        </div>
      </div>

      <section id="section-cover" className="min-h-screen flex flex-col items-center justify-center px-8 text-center" style={{ backgroundColor: nearBlack }}>
        <h1 className="font-extralight mb-3 leading-none" style={{ color: offWhite, fontSize: 'clamp(2.5rem, 10vw, 4rem)' }}>{invitation.partner_name}</h1>
        <span style={{ color: offWhite }}>◆</span>
        <h2 className="font-extralight mt-3 leading-none" style={{ color: offWhite, fontSize: 'clamp(2.5rem, 10vw, 4rem)' }}>{invitation.partner_name2}</h2>
      </section>

      <section id="section-bismillah" className="py-24 px-8 text-center" style={{ backgroundColor: offWhite }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-6" style={{ color: gray }}>◆ Bismillah ◆</p>
          <p className="italic max-w-sm mx-auto leading-relaxed text-sm opacity-80 mb-3">
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.&rdquo;
          </p>
          <p className="text-xs tracking-widest mb-10" style={{ color: gray }}>— QS. Ar-Rum: 21</p>
          {targetDate && <Countdown targetDate={targetDate} primaryColor={nearBlack} accentColor={gray} />}
        </ScrollReveal>
      </section>

      <section id="section-couple" className="py-24 px-8 text-center" style={{ backgroundColor: nearBlack + '06' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-10" style={{ color: gray }}>◆ The Couple ◆</p>
          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              {photos[0] && <div className="w-32 h-32 mx-auto mb-4 overflow-hidden" style={{ borderRadius: '2px', border: `1px solid ${nearBlack}22` }}><img src={photos[0]} alt="" className="w-full h-full object-cover" /></div>}
              <p className="text-xs tracking-widest opacity-60 mb-2">GROOM</p>
              <h2 className="font-light mb-2" style={{ color: nearBlack, fontSize: 'clamp(1.4rem, 5vw, 1.8rem)' }}>{invitation.partner_name}</h2>
              {invitation.parent_name && <p className="text-sm" style={{ color: gray }}>Putra dari {invitation.parent_name}</p>}
            </div>
            <div className="text-center">
              {photos[1] && <div className="w-32 h-32 mx-auto mb-4 overflow-hidden" style={{ borderRadius: '2px', border: `1px solid ${nearBlack}22` }}><img src={photos[1]} alt="" className="w-full h-full object-cover" /></div>}
              <p className="text-xs tracking-widest opacity-60 mb-2">BRIDE</p>
              <h2 className="font-light mb-2" style={{ color: nearBlack, fontSize: 'clamp(1.4rem, 5vw, 1.8rem)' }}>{invitation.partner_name2}</h2>
              {invitation.parent_name2 && <p className="text-sm" style={{ color: gray }}>Putri dari {invitation.parent_name2}</p>}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="section-event" className="py-24 px-8 text-center" style={{ backgroundColor: offWhite }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-10" style={{ color: gray }}>◆ Save The Date ◆</p>
          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {(invitation.date_akad || invitation.time_akad) && (
              <div className="p-8" style={{ border: `1px solid ${nearBlack}22`, borderRadius: '2px' }}>
                <p className="text-xs tracking-widest opacity-60 mb-3">AKAD NIKAH</p>
                {invitation.date_akad && <p className="text-base font-light mb-1" style={{ color: nearBlack }}>{formatDate(invitation.date_akad)}</p>}
                {invitation.time_akad && <p className="text-sm mb-4" style={{ color: gray }}>{invitation.time_akad} WIB</p>}
                {invitation.location && <p className="text-xs mb-4" style={{ color: gray }}>{invitation.location}</p>}
                {invitation.maps_url && <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 text-xs uppercase tracking-widest" style={{ backgroundColor: nearBlack, color: offWhite, borderRadius: '2px', minHeight: '40px' }}>View Map</a>}
              </div>
            )}
            {(invitation.date_resepsi || invitation.time_resepsi) && (
              <div className="p-8" style={{ border: `1px solid ${nearBlack}22`, borderRadius: '2px' }}>
                <p className="text-xs tracking-widest opacity-60 mb-3">RESEPSI</p>
                {invitation.date_resepsi && <p className="text-base font-light mb-1" style={{ color: nearBlack }}>{formatDate(invitation.date_resepsi)}</p>}
                {invitation.time_resepsi && <p className="text-sm mb-4" style={{ color: gray }}>{invitation.time_resepsi} WIB</p>}
                {invitation.location && <p className="text-xs mb-4" style={{ color: gray }}>{invitation.location}</p>}
                {invitation.maps_url && <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 text-xs uppercase tracking-widest" style={{ backgroundColor: nearBlack, color: offWhite, borderRadius: '2px', minHeight: '40px' }}>View Map</a>}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {photos.length > 0 && (
        <section id="section-gallery" className="py-24 px-8" style={{ backgroundColor: nearBlack + '06' }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] text-center mb-10" style={{ color: gray }}>◆ Gallery ◆</p>
            <div className="grid grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 gap-2 max-w-2xl mx-auto">
              {photos.map((url, i) => (
                <button key={i} type="button" onClick={() => setLightboxImg(url)} className="aspect-square overflow-hidden cursor-zoom-in block" style={{ borderRadius: '2px', border: `1px solid ${nearBlack}11` }} aria-label={`Foto ${i + 1}`}>
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {invitation.story && (
        <section className="py-24 px-8 text-center" style={{ backgroundColor: offWhite }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-10" style={{ color: gray }}>◆ Our Story ◆</p>
            <div className="max-w-md mx-auto space-y-10">
              {['The Beginning', 'Becoming One', 'The Sacred Promise'].map((label, idx) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: nearBlack }}>{label}</p>
                  <p className="text-sm italic leading-loose" style={{ color: nearBlack, opacity: 0.7 }}>
                    {idx === 0 && invitation.story}
                    {idx === 1 && 'Our journey continued, growing together in love and understanding.'}
                    {idx === 2 && 'Now, we are ready to make a sacred promise before God and our loved ones.'}
                  </p>
                  {idx < 2 && <p className="mt-6" style={{ color: gray }}>◆</p>}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      <section className="py-24 px-8 text-center" style={{ backgroundColor: nearBlack + '06' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-10" style={{ color: gray }}>◆ Wedding Gift ◆</p>
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="p-5 text-left" style={{ border: `1px solid ${nearBlack}22`, borderRadius: '2px', backgroundColor: offWhite }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: gray }}>{item.bank}</p>
                <p className="text-xl font-bold mb-1" style={{ color: nearBlack }}>{item.no}</p>
                <p className="text-xs mb-4" style={{ color: gray }}>a.n. {item.name}</p>
                <button type="button" onClick={() => handleCopy(item.no, item.key)}
                  className="w-full text-sm uppercase tracking-widest transition-all active:scale-95"
                  style={{ minHeight: '44px', borderRadius: '2px', ...(copied === item.key ? { backgroundColor: nearBlack, color: offWhite } : { border: `1px solid ${nearBlack}44`, color: nearBlack }) }}>
                  {copied === item.key ? '✓ Copied' : 'Copy Account'}
                </button>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section id="section-wishes" className="py-24 px-8" style={{ backgroundColor: offWhite }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] text-center mb-10" style={{ color: gray }}>◆ Wishes &amp; RSVP ◆</p>
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={nearBlack} accentColor={nearBlack} bgColor={offWhite} />
        </ScrollReveal>
      </section>

      <footer className="py-20 px-8 text-center" style={{ backgroundColor: nearBlack }}>
        <p className="text-xs uppercase tracking-[0.5em] mb-8" style={{ color: offWhite + '44' }}>With Love</p>
        <p className="text-sm mb-8" style={{ color: offWhite + 'aa' }}>Terima kasih atas doa dan restunya</p>
        <h2 className="font-extralight leading-none mb-3" style={{ color: offWhite, fontSize: 'clamp(2rem, 8vw, 3rem)' }}>{invitation.partner_name}</h2>
        <span style={{ color: offWhite }}>◆</span>
        <h2 className="font-extralight leading-none mt-3" style={{ color: offWhite, fontSize: 'clamp(2rem, 8vw, 3rem)' }}>{invitation.partner_name2}</h2>
        <p className="text-xs mt-10" style={{ color: offWhite + '44' }}>© Made with Love</p>
      </footer>

      {opened && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-3 backdrop-blur-md"
          style={{ backgroundColor: offWhite + 'ee', borderTop: `1px solid ${nearBlack}22` }}>
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
          style={{ backgroundColor: nearBlack, color: offWhite }} aria-label="Toggle music">
          <span className={musicPlaying ? 'animate-spin-slow' : ''}>{musicPlaying ? '⏸' : '🎵'}</span>
        </button>
      )}

      {lightboxImg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.92)' }} onClick={() => setLightboxImg(null)} role="dialog" aria-modal="true">
          <img src={lightboxImg} alt="Foto" className="max-w-full max-h-full object-contain" style={{ borderRadius: '2px' }} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white text-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} onClick={() => setLightboxImg(null)} aria-label="Tutup">×</button>
        </div>
      )}

      {copied && (
        <div className="fixed bottom-40 left-1/2 z-[60] px-5 py-3 text-sm shadow-xl pointer-events-none"
          style={{ backgroundColor: nearBlack, color: offWhite, transform: 'translateX(-50%)', borderRadius: '2px' }}>
          ✓ Account copied!
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
