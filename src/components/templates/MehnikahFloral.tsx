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

  const storyTimeline = (() => {
    try {
      const parsed = JSON.parse(invitation.story || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as { title: string; date: string; description: string }[];
    } catch {}
    return null;
  })();

  const PRIMARY = colors.primary;
  const SECONDARY = colors.secondary;
  const ACCENT = colors.accent;
  const TEXT = '#4a3f35';

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

  const FlowerDivider = () => (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to right, transparent, ${PRIMARY}88)` }} />
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse key={i} cx="14" cy="14" rx="3.5" ry="6.5"
            transform={`rotate(${angle} 14 14)`} fill={PRIMARY} opacity="0.65" />
        ))}
        <circle cx="14" cy="14" r="3.5" fill={PRIMARY} />
      </svg>
      <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to left, transparent, ${PRIMARY}88)` }} />
    </div>
  );

  const FloralCorner = ({ flip = false }: { flip?: boolean }) => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <path d="M5 75 Q5 5 75 5" stroke={PRIMARY} strokeWidth="1.5" strokeOpacity="0.45" fill="none" />
      <path d="M12 12 Q20 5 30 5" stroke={PRIMARY} strokeWidth="1" strokeOpacity="0.4" fill="none" />
      <path d="M12 12 Q5 20 5 30" stroke={PRIMARY} strokeWidth="1" strokeOpacity="0.4" fill="none" />
      <circle cx="12" cy="12" r="5" fill={PRIMARY} fillOpacity="0.25" />
      <circle cx="28" cy="7" r="3" fill={PRIMARY} fillOpacity="0.4" />
      <circle cx="7" cy="28" r="3" fill={PRIMARY} fillOpacity="0.4" />
      <ellipse cx="16" cy="7" rx="2.5" ry="5.5" transform="rotate(-35 16 7)" fill={PRIMARY} fillOpacity="0.3" />
      <ellipse cx="7" cy="16" rx="2.5" ry="5.5" transform="rotate(55 7 16)" fill={PRIMARY} fillOpacity="0.3" />
    </svg>
  );

  const FloralOrnament = () => (
    <div className="flex justify-center mb-4">
      <svg width="64" height="32" viewBox="0 0 64 32" fill="none">
        {[-18, -9, 0, 9, 18].map((x, i) => (
          <ellipse key={i} cx={32 + x} cy="16" rx="5" ry="11"
            transform={`rotate(${x * 2.5} ${32 + x} 16)`}
            fill={PRIMARY} opacity={i === 2 ? '0.85' : '0.4'} />
        ))}
        <circle cx="32" cy="16" r="4.5" fill={PRIMARY} />
      </svg>
    </div>
  );

  const Rosette = ({ num }: { num: number }) => (
    <svg width="44" height="44" viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <ellipse key={i} cx="22" cy="22" rx="4.5" ry="10"
          transform={`rotate(${angle} 22 22)`} fill={PRIMARY} opacity="0.5" />
      ))}
      <circle cx="22" cy="22" r="10" fill={`url(#rg${num})`} />
      <defs>
        <radialGradient id={`rg${num}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#edd9b8" />
          <stop offset="100%" stopColor={PRIMARY} />
        </radialGradient>
      </defs>
      <text x="22" y="27" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff" fontFamily="serif">{num}</text>
    </svg>
  );

  const navItems = [
    { id: 'section-cover', icon: '🏠' },
    { id: 'section-couple', icon: '💑' },
    { id: 'section-event', icon: '📅' },
    { id: 'section-gallery', icon: '📷' },
    { id: 'section-wishes', icon: '💬' },
  ];

  return (
    <div style={{ fontFamily: '"Playfair Display", serif', color: TEXT, backgroundColor: SECONDARY, paddingBottom: '80px' }}>

      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* COVER */}
      <section id="section-cover" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${SECONDARY} 0%, ${PRIMARY}20 50%, ${SECONDARY} 100%)` }}>
        <div className="absolute top-4 left-4 opacity-70"><FloralCorner /></div>
        <div className="absolute top-4 right-4 opacity-70"><FloralCorner flip /></div>
        <div className="absolute bottom-4 left-4 opacity-70" style={{ transform: 'scaleY(-1)' }}><FloralCorner /></div>
        <div className="absolute bottom-4 right-4 opacity-70" style={{ transform: 'scale(-1,-1)' }}><FloralCorner flip /></div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 65% 55% at 50% 50%, ${PRIMARY}15, transparent)` }} />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.4em] mb-2 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]"
            style={{ color: ACCENT + 'bb' }}>The Wedding Of</p>
          <FlowerDivider />
          <h1 className="text-6xl md:text-7xl mb-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.25s_forwards]"
            style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>{invitation.partner_name}</h1>
          <p className="text-4xl my-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.35s_forwards]"
            style={{ fontFamily: '"Great Vibes", cursive', color: ACCENT + 'aa' }}>&amp;</p>
          <h1 className="text-6xl md:text-7xl mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.45s_forwards]"
            style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>{invitation.partner_name2}</h1>
          {targetDate && (
            <p className="text-sm tracking-widest mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.55s_forwards]"
              style={{ color: ACCENT }}>
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
          {guests[0]?.name && (
            <p className="text-sm italic opacity-0 animate-[fadeInUp_0.8s_ease-out_0.65s_forwards]" style={{ color: ACCENT }}>
              Kepada Yth. {guests[0].name}
            </p>
          )}
        </div>
      </section>

      {/* BISMILLAH */}
      <section id="section-bismillah" className="py-20 px-6 text-center" style={{ backgroundColor: PRIMARY + '11' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-4" style={{ color: ACCENT }}>Bismillahirrahmanirrahim</p>
          <FlowerDivider />
          <p className="italic max-w-sm mx-auto leading-relaxed text-sm mb-3" style={{ color: ACCENT }}>
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.&rdquo;
          </p>
          <p className="text-xs tracking-widest mb-8" style={{ color: PRIMARY }}>— QS. Ar-Rum: 21</p>
          <FlowerDivider />
          {targetDate && <Countdown targetDate={targetDate} primaryColor={PRIMARY} accentColor={ACCENT} />}
        </ScrollReveal>
      </section>

      {/* COUPLE */}
      <section id="section-couple" className="py-20 px-6 text-center" style={{ backgroundColor: SECONDARY }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: ACCENT }}>Mempelai</p>
          <FlowerDivider />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-4">
            {[
              { photo: photos[0], role: 'MEMPELAI PRIA', name: invitation.partner_name, parent: invitation.parent_name, label: 'Putra dari' },
              { photo: photos[1], role: 'MEMPELAI WANITA', name: invitation.partner_name2, parent: invitation.parent_name2, label: 'Putri dari' },
            ].map((p, idx) => (
              <div key={idx} className="p-6 rounded-3xl text-center"
                style={{ backgroundColor: '#fff', border: `1.5px solid ${PRIMARY}44`, boxShadow: `0 8px 32px ${PRIMARY}28` }}>
                {p.photo && (
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden"
                    style={{ border: `3px solid ${PRIMARY}`, boxShadow: `0 0 0 5px ${PRIMARY}1e, 0 0 24px ${PRIMARY}44` }}>
                    <img src={p.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="mb-2 opacity-0 animate-[bloom_0.8s_ease-out_0.2s_forwards]"
                  style={{ color: PRIMARY, fontSize: '1.4rem' }}>✿</div>
                <p className="text-xs tracking-widest opacity-60 mb-1">{p.role}</p>
                <p className="text-3xl mb-2" style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>{p.name}</p>
                {p.parent && (
                  <><p className="text-xs opacity-70">{p.label}</p><p className="text-sm mt-1">{p.parent}</p></>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* EVENT */}
      <section id="section-event" className="py-20 px-6 text-center" style={{ backgroundColor: PRIMARY + '11' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: ACCENT }}>Save The Date</p>
          <FlowerDivider />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-4">
            {(invitation.date_akad || invitation.time_akad) && (
              <div className="p-8 rounded-3xl"
                style={{ backgroundColor: '#fff', border: `1.5px solid ${PRIMARY}44`, boxShadow: `0 6px 24px ${PRIMARY}22` }}>
                <FloralOrnament />
                <p className="text-2xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>Akad Nikah</p>
                <div className="h-px w-16 mx-auto my-3"
                  style={{ background: `linear-gradient(to right, transparent, ${PRIMARY}99, transparent)` }} />
                {invitation.date_akad && <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>{formatDate(invitation.date_akad)}</p>}
                {invitation.time_akad && <p className="text-sm mb-3" style={{ color: ACCENT }}>{invitation.time_akad} WIB</p>}
                {invitation.location && <p className="text-xs mb-4" style={{ color: ACCENT }}>{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: PRIMARY, minHeight: '40px' }}>📍 Lihat Lokasi</a>
                )}
              </div>
            )}
            {(invitation.date_resepsi || invitation.time_resepsi) && (
              <div className="p-8 rounded-3xl"
                style={{ backgroundColor: '#fff', border: `1.5px solid ${PRIMARY}44`, boxShadow: `0 6px 24px ${PRIMARY}22` }}>
                <FloralOrnament />
                <p className="text-2xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: PRIMARY }}>Resepsi</p>
                <div className="h-px w-16 mx-auto my-3"
                  style={{ background: `linear-gradient(to right, transparent, ${PRIMARY}99, transparent)` }} />
                {invitation.date_resepsi && <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>{formatDate(invitation.date_resepsi)}</p>}
                {invitation.time_resepsi && <p className="text-sm mb-3" style={{ color: ACCENT }}>{invitation.time_resepsi} WIB</p>}
                {invitation.location && <p className="text-xs mb-4" style={{ color: ACCENT }}>{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: PRIMARY, minHeight: '40px' }}>📍 Lihat Lokasi</a>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* GALLERY */}
      {photos.length > 0 && (
        <section id="section-gallery" className="py-20 px-6" style={{ backgroundColor: SECONDARY }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: ACCENT }}>Wedding Gallery</p>
            <FlowerDivider />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {photos.map((url, i) => (
                <button key={i} type="button" onClick={() => setLightboxImg(url)}
                  className="aspect-square rounded-2xl overflow-hidden cursor-zoom-in block transition-transform hover:scale-105"
                  style={{ border: `2px solid ${PRIMARY}55`, boxShadow: `0 4px 16px ${PRIMARY}22` }}
                  aria-label={`Foto ${i + 1}`}>
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* LOVE STORY */}
      {(storyTimeline || invitation.story) && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: PRIMARY + '11' }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: ACCENT }}>Our Love Story</p>
            <FlowerDivider />
            {storyTimeline ? (
              <div className="max-w-md mx-auto">
                {storyTimeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4 mb-8 last:mb-0">
                    <div className="flex flex-col items-center">
                      <Rosette num={idx + 1} />
                      {idx < storyTimeline.length - 1 && (
                        <div className="flex-1 w-px mt-2"
                          style={{ background: `linear-gradient(to bottom, ${PRIMARY}66, transparent)`, minHeight: '32px' }} />
                      )}
                    </div>
                    <div className="pt-1 pb-4 text-left flex-1">
                      <p className="text-xs uppercase tracking-widest mb-1 font-semibold" style={{ color: PRIMARY }}>{item.title}</p>
                      {item.date && <p className="text-xs opacity-50 mb-2" style={{ color: ACCENT }}>{item.date}</p>}
                      <p className="text-sm italic leading-relaxed" style={{ color: ACCENT }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-8">
                {[
                  { label: 'The Beginning', text: 'Perkenalan yang sederhana menjadi awal dari sebuah perjalanan cinta yang indah.' },
                  { label: 'Becoming One', text: 'Perjalanan kami berlanjut, tumbuh bersama dalam cinta.' },
                  { label: 'The Sacred Promise', text: 'Kini kami siap mengikat janji suci di hadapan Allah.' },
                ].map((s, idx) => (
                  <div key={s.label} className="flex gap-4">
                    <Rosette num={idx + 1} />
                    <div className="text-left flex-1 pt-1">
                      <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: PRIMARY }}>{s.label}</p>
                      <p className="text-sm italic leading-relaxed" style={{ color: ACCENT }}>{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </section>
      )}

      {/* GIFT */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: SECONDARY }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: ACCENT }}>Wedding Gift</p>
          <FlowerDivider />
          <p className="text-sm mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: ACCENT }}>
            Doa restu Anda adalah hadiah terbesar bagi kami.
          </p>
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="p-5 rounded-2xl text-left"
                style={{ background: `linear-gradient(135deg, ${PRIMARY}18 0%, ${PRIMARY}08 100%)`, border: `1.5px solid ${PRIMARY}44`, boxShadow: `0 4px 20px ${PRIMARY}18` }}>
                <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: PRIMARY }}>{item.bank}</p>
                <p className="text-xl font-bold mb-1" style={{ color: PRIMARY }}>{item.no}</p>
                <p className="text-xs mb-4" style={{ color: ACCENT }}>a.n. {item.name}</p>
                <button type="button" onClick={() => handleCopy(item.no, item.key)}
                  className="w-full rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{ minHeight: '44px', ...(copied === item.key
                    ? { background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: '#fff' }
                    : { border: `1.5px solid ${PRIMARY}`, color: PRIMARY, backgroundColor: 'transparent' }) }}>
                  {copied === item.key ? '✓ Tersalin!' : 'Copy Rekening'}
                </button>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* WISHES & RSVP */}
      <section id="section-wishes" className="py-20 px-6" style={{ backgroundColor: PRIMARY + '11' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: ACCENT }}>Wishes &amp; RSVP</p>
          <FlowerDivider />
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={PRIMARY} accentColor={ACCENT} bgColor={SECONDARY} />
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${ACCENT}cc 0%, ${PRIMARY}dd 50%, ${ACCENT}cc 100%)` }}>
        <div className="absolute top-4 left-4 opacity-50"><FloralCorner /></div>
        <div className="absolute top-4 right-4 opacity-50"><FloralCorner flip /></div>
        <FlowerDivider />
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>Terima kasih atas doa dan restunya</p>
        <p className="text-5xl text-white mb-4" style={{ fontFamily: '"Great Vibes", cursive' }}>
          {invitation.partner_name} &amp; {invitation.partner_name2}
        </p>
        <FlowerDivider />
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>© Made with Love</p>
      </footer>

      {/* BOTTOM NAV — rose gold glass */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-2 backdrop-blur-md"
        style={{ background: `linear-gradient(to right, ${PRIMARY}cc, ${ACCENT}bb, ${PRIMARY}cc)`, borderTop: `1px solid ${PRIMARY}55` }}>
        {navItems.map((item) => (
          <button key={item.id} type="button" onClick={() => scrollTo(item.id)}
            className="flex items-center justify-center w-14 h-12 rounded-full transition-all hover:scale-110 active:scale-95">
            <span className="text-xl">{item.icon}</span>
          </button>
        ))}
      </nav>

      {/* MUSIC TOGGLE */}
      {invitation.music_url && (
        <button type="button" onClick={toggleMusic}
          className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: '#fff' }}
          aria-label="Toggle music">
          <span className={musicPlaying ? 'animate-spin-slow' : ''}>{musicPlaying ? '⏸' : '🎵'}</span>
        </button>
      )}

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightboxImg(null)} role="dialog" aria-modal="true">
          <img src={lightboxImg} alt="Foto" className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()} />
          <button type="button"
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white text-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => setLightboxImg(null)} aria-label="Tutup">×</button>
        </div>
      )}

      {/* COPY TOAST */}
      {copied && (
        <div className="fixed bottom-24 left-1/2 z-[60] px-5 py-3 rounded-full text-sm text-white shadow-xl pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, transform: 'translateX(-50%)' }}>
          ✓ Nomor rekening disalin!
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bloom { from { opacity: 0; transform: scale(0.3) rotate(-90deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
