'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import { TemplateProps } from './types';

function OrnamentDivider({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div style={{ height: '1px', width: '60px', background: `linear-gradient(to right, transparent, ${color})` }} />
      <span style={{ color, fontSize: '1.1rem' }}>✦</span>
      <div style={{ height: '1px', width: '60px', background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

export default function IslamiElegant({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#c9a84c', secondary: '#0a1628', accent: '#e8d5a3' };
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

  const gold = colors.primary || '#c9a84c';
  const navy = colors.secondary || '#0a1628';
  const cream = colors.accent || '#e8d5a3';

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
    <div style={{ fontFamily: 'Georgia, serif', backgroundColor: navy, color: cream, paddingBottom: '80px' }}>

      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* COVER OVERLAY */}
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden transition-all duration-700 ${opened ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}
        style={{ background: `linear-gradient(180deg, #060e1a 0%, ${navy} 50%, #0d1f3c 100%)` }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${gold}22 0%, transparent 70%)` }} />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-2xl mb-2 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]" style={{ color: gold, direction: 'rtl' }}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <OrnamentDivider color={gold} />
          <p className="text-xs uppercase tracking-[0.4em] mb-8 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.15s_forwards]" style={{ color: cream + '99' }}>The Sacred Union</p>

          <h1 className="text-5xl md:text-6xl mb-2 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]" style={{ color: cream, fontFamily: 'Georgia, serif' }}>{invitation.partner_name}</h1>
          <p className="text-3xl my-3 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]" style={{ color: gold }}>✦</p>
          <h2 className="text-5xl md:text-6xl mb-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ color: cream, fontFamily: 'Georgia, serif' }}>{invitation.partner_name2}</h2>

          {targetDate && <p className="text-sm tracking-widest mb-12 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]" style={{ color: cream + 'bb' }}>{new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}

          <button type="button" onClick={handleOpen}
            className="px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-2xl opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]"
            style={{ backgroundColor: gold, color: navy, minHeight: '48px' }}>
            ✉ Buka Undangan
          </button>
        </div>
      </div>

      <section id="section-cover" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
        style={{ background: `linear-gradient(180deg, #060e1a, ${navy})` }}>
        <p className="text-2xl mb-4" style={{ color: gold, direction: 'rtl' }}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <h1 className="text-5xl md:text-6xl mb-2" style={{ color: cream }}>{invitation.partner_name}</h1>
        <p className="text-3xl my-2" style={{ color: gold }}>✦</p>
        <h1 className="text-5xl md:text-6xl" style={{ color: cream }}>{invitation.partner_name2}</h1>
      </section>

      <section id="section-bismillah" className="py-20 px-6 text-center" style={{ background: `linear-gradient(180deg, ${navy}, #0d1f3c)` }}>
        <ScrollReveal>
          <p className="text-xl mb-3 leading-loose" style={{ color: cream, direction: 'rtl', fontFamily: 'serif' }}>وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا</p>
          <OrnamentDivider color={gold} />
          <p className="italic max-w-sm mx-auto leading-relaxed text-sm mb-3" style={{ color: cream + 'cc' }}>
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.&rdquo;
          </p>
          <p className="text-xs tracking-widest mb-8" style={{ color: gold }}>— QS. Ar-Rum: 21</p>
          {targetDate && <Countdown targetDate={targetDate} primaryColor={gold} accentColor={cream} />}
        </ScrollReveal>
      </section>

      <section id="section-couple" className="py-20 px-6 text-center" style={{ background: `linear-gradient(180deg, #0d1f3c, ${navy})` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: gold + '99' }}>Mempelai</p>
          <OrnamentDivider color={gold} />
          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
            <div className="p-6 rounded-2xl text-center" style={{ border: `1px solid ${gold}55`, background: `${gold}0a` }}>
              {photos[0] && <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4" style={{ borderColor: gold }}><img src={photos[0]} alt="" className="w-full h-full object-cover" /></div>}
              <p className="text-xs tracking-widest mb-2" style={{ color: gold + 'aa' }}>MEMPELAI PRIA</p>
              <p className="text-2xl mb-2" style={{ color: cream }}>{invitation.partner_name}</p>
              {invitation.parent_name && <><p className="text-xs" style={{ color: cream + '99' }}>Putra dari</p><p className="text-sm mt-1" style={{ color: cream + 'cc' }}>{invitation.parent_name}</p></>}
            </div>
            <div className="p-6 rounded-2xl text-center" style={{ border: `1px solid ${gold}55`, background: `${gold}0a` }}>
              {photos[1] && <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4" style={{ borderColor: gold }}><img src={photos[1]} alt="" className="w-full h-full object-cover" /></div>}
              <p className="text-xs tracking-widest mb-2" style={{ color: gold + 'aa' }}>MEMPELAI WANITA</p>
              <p className="text-2xl mb-2" style={{ color: cream }}>{invitation.partner_name2}</p>
              {invitation.parent_name2 && <><p className="text-xs" style={{ color: cream + '99' }}>Putri dari</p><p className="text-sm mt-1" style={{ color: cream + 'cc' }}>{invitation.parent_name2}</p></>}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="section-event" className="py-20 px-6 text-center" style={{ background: `linear-gradient(180deg, ${navy}, #0d1f3c)` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: gold + '99' }}>Save The Date</p>
          <OrnamentDivider color={gold} />
          <div className="grid grid-cols-1 max-sm:grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
            {(invitation.date_akad || invitation.time_akad) && (
              <div className="p-8 rounded-2xl" style={{ border: `1px solid ${gold}55`, background: `${gold}0d` }}>
                <div className="text-3xl mb-3" style={{ color: gold }}>🕌</div>
                <p className="text-lg font-semibold mb-2" style={{ color: cream }}>Akad Nikah</p>
                {invitation.date_akad && <p className="text-sm mb-1" style={{ color: cream }}>{formatDate(invitation.date_akad)}</p>}
                {invitation.time_akad && <p className="text-sm mb-3" style={{ color: cream + 'cc' }}>{invitation.time_akad} WIB</p>}
                {invitation.location && <p className="text-xs mb-4" style={{ color: cream + '99' }}>{invitation.location}</p>}
                {invitation.maps_url && <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 rounded-full text-xs font-semibold" style={{ backgroundColor: gold, color: navy, minHeight: '40px' }}>📍 Lihat Lokasi</a>}
              </div>
            )}
            {(invitation.date_resepsi || invitation.time_resepsi) && (
              <div className="p-8 rounded-2xl" style={{ border: `1px solid ${gold}55`, background: `${gold}0d` }}>
                <div className="text-3xl mb-3" style={{ color: gold }}>🌙</div>
                <p className="text-lg font-semibold mb-2" style={{ color: cream }}>Resepsi</p>
                {invitation.date_resepsi && <p className="text-sm mb-1" style={{ color: cream }}>{formatDate(invitation.date_resepsi)}</p>}
                {invitation.time_resepsi && <p className="text-sm mb-3" style={{ color: cream + 'cc' }}>{invitation.time_resepsi} WIB</p>}
                {invitation.location && <p className="text-xs mb-4" style={{ color: cream + '99' }}>{invitation.location}</p>}
                {invitation.maps_url && <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 rounded-full text-xs font-semibold" style={{ backgroundColor: gold, color: navy, minHeight: '40px' }}>📍 Lihat Lokasi</a>}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {photos.length > 0 && (
        <section id="section-gallery" className="py-20 px-6" style={{ background: `linear-gradient(180deg, #0d1f3c, ${navy})` }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] text-center mb-2" style={{ color: gold + '99' }}>Wedding Gallery</p>
            <OrnamentDivider color={gold} />
            <div className="grid grid-cols-2 max-sm:grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {photos.map((url, i) => (
                <button key={i} type="button" onClick={() => setLightboxImg(url)} className="aspect-square rounded-xl overflow-hidden cursor-zoom-in block" style={{ border: `1px solid ${gold}44` }} aria-label={`Foto ${i + 1}`}>
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {(storyTimeline || invitation.story) && (
        <section className="py-20 px-6 text-center" style={{ background: `linear-gradient(180deg, ${navy}, #091525)` }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: gold + '99' }}>Our Love Story</p>
            <OrnamentDivider color={gold} />
            {storyTimeline ? (
              <div className="max-w-md mx-auto">
                {storyTimeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4 mb-8 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: gold, color: navy }}>
                        {idx + 1}
                      </div>
                      {idx < storyTimeline.length - 1 && (
                        <div className="flex-1 w-px mt-2" style={{ backgroundColor: gold + '44', minHeight: '32px' }} />
                      )}
                    </div>
                    <div className="pt-1 pb-4 text-left flex-1">
                      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: gold }}>{item.title}</p>
                      {item.date && <p className="text-xs opacity-50 mb-2" style={{ color: cream + '88' }}>{item.date}</p>}
                      <p className="text-sm italic leading-relaxed" style={{ color: cream + 'cc' }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-8">
                {['The Beginning', 'Becoming One', 'The Sacred Promise'].map((label, idx) => (
                  <div key={label}>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: gold }}>{label}</p>
                    <p className="text-sm italic leading-relaxed" style={{ color: cream + 'cc' }}>
                      {idx === 0 && invitation.story}
                      {idx === 1 && 'Perjalanan kami berlanjut dalam ridho Allah SWT.'}
                      {idx === 2 && 'Kini kami siap mengikat janji suci.'}
                    </p>
                    {idx < 2 && <p className="text-xl mt-6" style={{ color: gold }}>✦</p>}
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </section>
      )}

      <section className="py-20 px-6 text-center" style={{ background: `linear-gradient(180deg, #091525, ${navy})` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: gold + '99' }}>Wedding Gift</p>
          <OrnamentDivider color={gold} />
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="p-5 rounded-2xl text-left" style={{ border: `1px solid ${gold}44`, background: `${gold}0a` }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: gold }}>{item.bank}</p>
                <p className="text-xl font-bold mb-1" style={{ color: cream }}>{item.no}</p>
                <p className="text-xs mb-4" style={{ color: cream + '99' }}>a.n. {item.name}</p>
                <button type="button" onClick={() => handleCopy(item.no, item.key)}
                  className="w-full rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{ minHeight: '44px', ...(copied === item.key ? { backgroundColor: gold, color: navy } : { border: `1.5px solid ${gold}88`, color: gold }) }}>
                  {copied === item.key ? '✓ Tersalin!' : 'Copy Rekening'}
                </button>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section id="section-wishes" className="py-20 px-6" style={{ background: `linear-gradient(180deg, ${navy}, #091525)` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] text-center mb-2" style={{ color: gold + '99' }}>Wishes &amp; RSVP</p>
          <OrnamentDivider color={gold} />
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={gold} accentColor={cream} bgColor={navy + 'cc'} />
        </ScrollReveal>
      </section>

      <footer className="py-16 px-6 text-center" style={{ background: `linear-gradient(180deg, #091525, #040c18)` }}>
        <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: gold + '88' }}>Jazakumullahu Khairan</p>
        <OrnamentDivider color={gold} />
        <p className="text-sm mb-6" style={{ color: cream + 'aa' }}>Terima kasih atas doa dan restunya</p>
        <p className="text-4xl mt-4" style={{ color: cream }}>{invitation.partner_name} ✦ {invitation.partner_name2}</p>
        <p className="text-xs mt-8" style={{ color: cream + '55' }}>© Made with Love</p>
      </footer>

      {opened && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-3 backdrop-blur-md"
          style={{ backgroundColor: navy + 'ee', borderTop: `1px solid ${gold}44` }}>
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
          style={{ backgroundColor: gold, color: navy }} aria-label="Toggle music">
          <span className={musicPlaying ? 'animate-spin-slow' : ''}>{musicPlaying ? '⏸' : '🎵'}</span>
        </button>
      )}

      {lightboxImg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.94)' }} onClick={() => setLightboxImg(null)} role="dialog" aria-modal="true">
          <img src={lightboxImg} alt="Foto" className="max-w-full max-h-full object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
          <button type="button" className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white text-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} onClick={() => setLightboxImg(null)} aria-label="Tutup">×</button>
        </div>
      )}

      {copied && (
        <div className="fixed bottom-40 left-1/2 z-[60] px-5 py-3 rounded-full text-sm shadow-xl pointer-events-none"
          style={{ backgroundColor: gold, color: navy, transform: 'translateX(-50%)' }}>
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
