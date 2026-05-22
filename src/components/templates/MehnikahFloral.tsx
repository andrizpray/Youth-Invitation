'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import { TemplateProps } from './types';

export default function MehnikahFloral({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#c9a97a', secondary: '#fdf8f3', accent: '#8b6f5a' };
  }
  let photos: string[];
  try {
    photos = JSON.parse(invitation.gallery_photos || '[]') as string[];
  } catch {
    photos = [];
  }

  const PRIMARY = colors.primary;
  const SECONDARY = colors.secondary;
  const ACCENT = colors.accent;
  const TEXT = '#4a3f35';

  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
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
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const Divider = () => (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
      <span style={{ color: PRIMARY }}>✿</span>
      <div className="h-px w-16" style={{ backgroundColor: PRIMARY + '66' }} />
    </div>
  );

  const navItems = [
    { id: 'section-cover', icon: '🏠' }, { id: 'section-couple', icon: '💑' },
    { id: 'section-event', icon: '📅' }, { id: 'section-gallery', icon: '📷' }, { id: 'section-wishes', icon: '💬' },
  ];

  return (
    <div style={{ fontFamily: '"Playfair Display", serif', color: TEXT, backgroundColor: SECONDARY, paddingBottom: '80px' }}>

      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* COVER OVERLAY */}
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ backgroundColor: SECONDARY }}>
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-30 -translate-x-1/3 -translate-y-1/3" style={{ background: `radial-gradient(circle, ${PRIMARY}, transparent)` }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-30 translate-x-1/3 translate-y-1/3" style={{ background: `radial-gradient(circle, ${PRIMARY}, transparent)` }} />
        <div className="absolute top-12 right-12 text-5xl opacity-40" style={{ color: PRIMARY }}>✿</div>
        <div className="absolute bottom-32 left-12 text-5xl opacity-40" style={{ color: PRIMARY }}>❀</div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 text-2xl opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]" style={{ color: PRIMARY }}>
            <span>✿</span><span>❀</span><span>✿</span>
          </div>
          <Divider />
          <p className="text-xs uppercase tracking-[0.35em] mb-6 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.15s_forwards]" style={{ color: ACCENT + 'aa' }}>The Wedding Of</p>

          <h1 className="text-6xl md:text-7xl mb-2 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>{invitation.partner_name}</h1>
          <p className="text-3xl my-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]" style={{ fontFamily: '"Great Vibes", cursive', color: ACCENT + 'aa' }}>&amp;</p>
          <h1 className="text-6xl md:text-7xl mb-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>{invitation.partner_name2}</h1>

          {targetDate && <p className="text-sm tracking-widest mb-10 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]" style={{ color: ACCENT }}>{new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}

          <button type="button" onClick={handleOpen}
            className="px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase text-white transition-all hover:scale-105 active:scale-95 shadow-xl opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{ backgroundColor: PRIMARY, minHeight: '48px' }}>
            ✉ Buka Undangan
          </button>
        </div>
      </div>

      <section id="section-cover" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center" style={{ backgroundColor: SECONDARY }}>
        <h1 className="text-5xl md:text-6xl mb-2" style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>{invitation.partner_name}</h1>
        <p className="text-3xl my-2" style={{ fontFamily: '"Great Vibes", cursive', color: ACCENT }}>&amp;</p>
        <h1 className="text-5xl md:text-6xl" style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>{invitation.partner_name2}</h1>
      </section>

      <section id="section-bismillah" className="py-20 px-6 text-center" style={{ backgroundColor: PRIMARY + '11' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-4" style={{ color: ACCENT }}>Bismillahirrahmanirrahim</p>
          <Divider />
          <p className="italic max-w-sm mx-auto leading-relaxed text-sm mb-3" style={{ color: ACCENT }}>
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.&rdquo;
          </p>
          <p className="text-xs tracking-widest" style={{ color: PRIMARY }}>— QS. Ar-Rum: 21</p>
          <Divider />
          {targetDate && <Countdown targetDate={targetDate} primaryColor={PRIMARY} accentColor={ACCENT} />}
        </ScrollReveal>
      </section>

      <section id="section-couple" className="py-20 px-6 text-center" style={{ backgroundColor: SECONDARY }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: ACCENT }}>Mempelai</p>
          <Divider />
          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-4">
            <div className="p-6 rounded-3xl text-center" style={{ backgroundColor: '#fff', border: `1px solid ${PRIMARY}33`, boxShadow: '0 8px 32px rgba(201,169,122,0.18)' }}>
              {photos[0] && <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4" style={{ borderColor: PRIMARY }}><img src={photos[0]} alt="" className="w-full h-full object-cover" /></div>}
              <div className="text-2xl mb-2" style={{ color: PRIMARY }}>✿</div>
              <p className="text-xs tracking-widest opacity-60 mb-1">MEMPELAI PRIA</p>
              <p className="text-3xl mb-2" style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>{invitation.partner_name}</p>
              {invitation.parent_name && <><p className="text-xs opacity-70">Putra dari</p><p className="text-sm mt-1">{invitation.parent_name}</p></>}
            </div>
            <div className="p-6 rounded-3xl text-center" style={{ backgroundColor: '#fff', border: `1px solid ${PRIMARY}33`, boxShadow: '0 8px 32px rgba(201,169,122,0.18)' }}>
              {photos[1] && <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4" style={{ borderColor: PRIMARY }}><img src={photos[1]} alt="" className="w-full h-full object-cover" /></div>}
              <div className="text-2xl mb-2" style={{ color: PRIMARY }}>❀</div>
              <p className="text-xs tracking-widest opacity-60 mb-1">MEMPELAI WANITA</p>
              <p className="text-3xl mb-2" style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>{invitation.partner_name2}</p>
              {invitation.parent_name2 && <><p className="text-xs opacity-70">Putri dari</p><p className="text-sm mt-1">{invitation.parent_name2}</p></>}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="section-event" className="py-20 px-6 text-center" style={{ backgroundColor: PRIMARY + '11' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: ACCENT }}>Save The Date</p>
          <Divider />
          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-4">
            {(invitation.date_akad || invitation.time_akad) && (
              <div className="p-8 rounded-3xl" style={{ backgroundColor: '#fff', border: `1px solid ${PRIMARY}33` }}>
                <p className="text-2xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>Akad Nikah</p>
                <div className="h-px w-12 mx-auto my-3" style={{ backgroundColor: PRIMARY + '55' }} />
                {invitation.date_akad && <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>{formatDate(invitation.date_akad)}</p>}
                {invitation.time_akad && <p className="text-sm mb-3" style={{ color: ACCENT }}>{invitation.time_akad} WIB</p>}
                {invitation.location && <p className="text-xs mb-4" style={{ color: ACCENT }}>{invitation.location}</p>}
                {invitation.maps_url && <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY, minHeight: '40px' }}>📍 Lihat Lokasi</a>}
              </div>
            )}
            {(invitation.date_resepsi || invitation.time_resepsi) && (
              <div className="p-8 rounded-3xl" style={{ backgroundColor: '#fff', border: `1px solid ${PRIMARY}33` }}>
                <p className="text-2xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>Resepsi</p>
                <div className="h-px w-12 mx-auto my-3" style={{ backgroundColor: PRIMARY + '55' }} />
                {invitation.date_resepsi && <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>{formatDate(invitation.date_resepsi)}</p>}
                {invitation.time_resepsi && <p className="text-sm mb-3" style={{ color: ACCENT }}>{invitation.time_resepsi} WIB</p>}
                {invitation.location && <p className="text-xs mb-4" style={{ color: ACCENT }}>{invitation.location}</p>}
                {invitation.maps_url && <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY, minHeight: '40px' }}>📍 Lihat Lokasi</a>}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {photos.length > 0 && (
        <section id="section-gallery" className="py-20 px-6" style={{ backgroundColor: SECONDARY }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: ACCENT }}>Wedding Gallery</p>
            <Divider />
            <div className="grid grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {photos.map((url, i) => (
                <button key={i} type="button" onClick={() => setLightboxImg(url)} className="aspect-square rounded-2xl overflow-hidden cursor-zoom-in block" style={{ border: `1px solid ${PRIMARY}22` }} aria-label={`Foto ${i + 1}`}>
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {invitation.story && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: PRIMARY + '11' }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: ACCENT }}>Our Love Story</p>
            <Divider />
            <div className="max-w-md mx-auto space-y-8">
              {['The Beginning', 'Becoming One', 'The Sacred Promise'].map((label, idx) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: PRIMARY }}>{label}</p>
                  <p className="text-sm italic leading-relaxed" style={{ color: ACCENT }}>
                    {idx === 0 && invitation.story}
                    {idx === 1 && 'Perjalanan kami berlanjut, tumbuh bersama dalam cinta.'}
                    {idx === 2 && 'Kini kami siap mengikat janji suci di hadapan Allah.'}
                  </p>
                  {idx < 2 && <p className="text-xl mt-6" style={{ color: PRIMARY }}>✿</p>}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      <section className="py-20 px-6 text-center" style={{ backgroundColor: SECONDARY }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: ACCENT }}>Wedding Gift</p>
          <Divider />
          <p className="text-sm mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: ACCENT }}>
            Doa restu Anda adalah hadiah terbesar bagi kami.
          </p>
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="p-5 rounded-2xl text-left" style={{ backgroundColor: '#fff', border: `1px solid ${PRIMARY}33` }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: PRIMARY }}>{item.bank}</p>
                <p className="text-xl font-bold mb-1" style={{ color: PRIMARY }}>{item.no}</p>
                <p className="text-xs mb-4" style={{ color: ACCENT }}>a.n. {item.name}</p>
                <button type="button" onClick={() => handleCopy(item.no, item.key)}
                  className="w-full rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{ minHeight: '44px', ...(copied === item.key ? { backgroundColor: PRIMARY, color: '#fff' } : { border: `1.5px solid ${PRIMARY}`, color: PRIMARY }) }}>
                  {copied === item.key ? '✓ Tersalin!' : 'Copy Rekening'}
                </button>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section id="section-wishes" className="py-20 px-6" style={{ backgroundColor: PRIMARY + '11' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: ACCENT }}>Wishes &amp; RSVP</p>
          <Divider />
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={PRIMARY} accentColor={ACCENT} bgColor={SECONDARY} />
        </ScrollReveal>
      </section>

      <footer className="py-16 px-6 text-center" style={{ background: `linear-gradient(160deg, ${ACCENT}ee, ${ACCENT})` }}>
        <div className="flex items-center justify-center gap-2 text-xl" style={{ color: PRIMARY + 'aa' }}>
          <span>✿</span><span>❀</span><span>✿</span>
        </div>
        <p className="text-white/70 text-sm mt-4 mb-6">Terima kasih atas doa dan restunya</p>
        <p className="text-5xl text-white" style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name} &amp; {invitation.partner_name2}</p>
        <p className="text-white/50 text-xs mt-8">© Made with Love</p>
      </footer>

      {opened && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-3 backdrop-blur-md"
          style={{ backgroundColor: SECONDARY + 'ee', borderTop: `1px solid ${PRIMARY}33` }}>
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
          style={{ backgroundColor: PRIMARY, color: '#fff' }} aria-label="Toggle music">
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
          style={{ backgroundColor: ACCENT, transform: 'translateX(-50%)' }}>
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
