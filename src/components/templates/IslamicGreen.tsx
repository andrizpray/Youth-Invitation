'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import { TemplateProps } from './types';

const GeometricDivider = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-3 my-8">
    <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}66)` }} />
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="14" y="14" width="12" height="12" transform="rotate(45 20 20)" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="17" y="17" width="6" height="6" transform="rotate(45 20 20)" fill={color} opacity="0.5" />
      <circle cx="20" cy="4" r="2" fill={color} opacity="0.4" />
      <circle cx="20" cy="36" r="2" fill={color} opacity="0.4" />
      <circle cx="4" cy="20" r="2" fill={color} opacity="0.4" />
      <circle cx="36" cy="20" r="2" fill={color} opacity="0.4" />
    </svg>
    <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${color}66)` }} />
  </div>
);

const GeometricCorner = ({ color, size = 28 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path d="M0 0 L14 0 L14 2 L2 2 L2 14 L0 14 Z" fill={color} opacity="0.5" />
    <path d="M5 5 L12 5 L12 7 L7 7 L7 12 L5 12 Z" fill={color} opacity="0.3" />
    <rect x="9" y="9" width="4" height="4" transform="rotate(45 11 11)" fill={color} opacity="0.4" />
  </svg>
);

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

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

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

  const gold = '#c9a84c';

  return (
    <div style={{ fontFamily: '"Amiri", "Playfair Display", serif', color: colors.accent, backgroundColor: colors.secondary, paddingBottom: '80px' }}>

      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* SECTION COVER */}
      <section id="section-cover" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${colors.accent} 0%, ${colors.primary} 60%, #1b5e35 100%)` }}>
        {/* Geometric grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${gold} 0, ${gold} 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, ${gold} 0, ${gold} 1px, transparent 1px, transparent 48px)`,
        }} />
        {/* Corner ornaments */}
        <div className="absolute top-6 left-6 opacity-70"><GeometricCorner color={gold} size={48} /></div>
        <div className="absolute top-6 right-6 opacity-70" style={{ transform: 'scaleX(-1)' }}><GeometricCorner color={gold} size={48} /></div>
        <div className="absolute bottom-6 left-6 opacity-70" style={{ transform: 'scaleY(-1)' }}><GeometricCorner color={gold} size={48} /></div>
        <div className="absolute bottom-6 right-6 opacity-70" style={{ transform: 'scale(-1)' }}><GeometricCorner color={gold} size={48} /></div>
        {/* Central diamond ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg width="320" height="320" viewBox="0 0 320 320" className="opacity-5">
            <polygon points="160,20 300,160 160,300 20,160" stroke={gold} strokeWidth="1" fill="none" />
            <polygon points="160,50 270,160 160,270 50,160" stroke={gold} strokeWidth="1" fill="none" />
            <polygon points="160,80 240,160 160,240 80,160" stroke={gold} strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-lg mb-1 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]"
            style={{ color: gold, direction: 'rtl', letterSpacing: '0.05em' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
          <p className="text-white/60 text-xs uppercase tracking-[0.4em] mb-10 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.2s_forwards]">Walimatul &lsquo;Urs</p>

          <div className="flex items-center gap-3 mb-2 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]">
            <div className="w-12 h-px" style={{ backgroundColor: gold }} />
            <svg width="16" height="16" viewBox="0 0 16 16"><rect x="4" y="4" width="8" height="8" transform="rotate(45 8 8)" fill={gold} /></svg>
            <div className="w-12 h-px" style={{ backgroundColor: gold }} />
          </div>

          <h1 className="text-6xl md:text-7xl text-white mb-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.35s_forwards]"
            style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name}</h1>
          <p className="text-2xl my-2 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]" style={{ color: gold, fontFamily: '"Great Vibes", cursive' }}>&amp;</p>
          <h1 className="text-6xl md:text-7xl text-white mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.45s_forwards]"
            style={{ fontFamily: '"Great Vibes", cursive' }}>{invitation.partner_name2}</h1>

          {targetDate && (
            <p className="text-white/70 text-sm tracking-[0.2em] mb-10 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]">
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </section>

      {/* SECTION BISMILLAH */}
      <section id="section-bismillah" className="py-20 px-6 text-center relative" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-lg mx-auto">
          {/* Ornamental arch frame */}
          <div className="relative inline-block px-8 py-10 mb-6 w-full"
            style={{ border: `1.5px solid ${colors.primary}55`, background: `linear-gradient(180deg, ${colors.primary}08, transparent)` }}>
            <div className="absolute top-0 left-0"><GeometricCorner color={colors.primary} /></div>
            <div className="absolute top-0 right-0" style={{ transform: 'scaleX(-1)' }}><GeometricCorner color={colors.primary} /></div>
            <div className="absolute bottom-0 left-0" style={{ transform: 'scaleY(-1)' }}><GeometricCorner color={colors.primary} /></div>
            <div className="absolute bottom-0 right-0" style={{ transform: 'scale(-1)' }}><GeometricCorner color={colors.primary} /></div>
            <ScrollReveal>
              <p className="text-3xl mb-4 leading-loose" style={{ color: colors.primary, direction: 'rtl', fontFamily: 'serif' }}>
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
              </p>
              <p className="italic leading-relaxed text-sm opacity-75 mb-3">
                &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.&rdquo;
              </p>
              <p className="text-xs tracking-widest" style={{ color: colors.primary }}>— QS. Ar-Rum: 21</p>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            {targetDate && <Countdown targetDate={targetDate} primaryColor={colors.primary} accentColor={colors.accent} />}
          </ScrollReveal>
        </div>
      </section>

      <GeometricDivider color={colors.primary} />

      {/* SECTION COUPLE */}
      <section id="section-couple" className="py-16 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-1" style={{ color: colors.primary }}>Mempelai</p>
          <GeometricDivider color={colors.primary} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto mt-4">
            {[
              { photo: photos[0], label: 'MEMPELAI PRIA', name: invitation.partner_name, parent: invitation.parent_name },
              { photo: photos[1], label: 'MEMPELAI WANITA', name: invitation.partner_name2, parent: invitation.parent_name2 },
            ].map((p, i) => (
              <div key={i} className="flex flex-col items-center p-6 relative"
                style={{ border: `1.5px solid ${colors.primary}44`, background: `linear-gradient(160deg, ${colors.primary}08, transparent)` }}>
                <div className="absolute top-0 left-0"><GeometricCorner color={gold} /></div>
                <div className="absolute top-0 right-0" style={{ transform: 'scaleX(-1)' }}><GeometricCorner color={gold} /></div>
                <div className="absolute bottom-0 left-0" style={{ transform: 'scaleY(-1)' }}><GeometricCorner color={gold} /></div>
                <div className="absolute bottom-0 right-0" style={{ transform: 'scale(-1)' }}><GeometricCorner color={gold} /></div>
                {p.photo && (
                  <div className="mb-5 relative" style={{ width: 128, height: 128 }}>
                    {/* Octagonal clip via CSS clip-path */}
                    <div className="w-32 h-32 overflow-hidden" style={{
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                      border: `3px solid ${gold}`,
                    }}>
                      <img src={p.photo} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 pointer-events-none" style={{
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                      border: `2px solid ${gold}`,
                      outline: `2px solid ${colors.primary}44`,
                    }} />
                  </div>
                )}
                <p className="text-xs tracking-widest mb-2 opacity-60">{p.label}</p>
                <p className="text-2xl font-semibold mb-2" style={{ color: colors.primary }}>{p.name}</p>
                {p.parent && <><p className="text-xs opacity-60">Putra/i dari</p><p className="text-sm mt-1 opacity-80">{p.parent}</p></>}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <GeometricDivider color={colors.primary} />

      {/* SECTION EVENT */}
      <section id="section-event" className="py-16 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-1" style={{ color: colors.primary }}>Save The Date</p>
          <GeometricDivider color={colors.primary} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-2">
            {[
              { show: !!(invitation.date_akad || invitation.time_akad), icon: '🕌', label: 'Akad Nikah', date: invitation.date_akad, time: invitation.time_akad },
              { show: !!(invitation.date_resepsi || invitation.time_resepsi), icon: '🌙', label: 'Resepsi', date: invitation.date_resepsi, time: invitation.time_resepsi },
            ].filter(e => e.show).map((ev, i) => (
              <div key={i} className="relative overflow-hidden"
                style={{ border: `1.5px solid ${colors.primary}44`, background: `linear-gradient(160deg, ${colors.primary}10, ${colors.secondary})` }}>
                {/* Geometric top border pattern */}
                <div className="h-2 w-full" style={{
                  background: `repeating-linear-gradient(90deg, ${colors.primary} 0, ${colors.primary} 8px, ${gold} 8px, ${gold} 10px, transparent 10px, transparent 18px)`,
                }} />
                <div className="p-8">
                  <div className="text-3xl mb-3">{ev.icon}</div>
                  <p className="text-lg font-bold mb-2" style={{ color: colors.primary }}>{ev.label}</p>
                  {ev.date && <p className="text-sm font-semibold mb-1">{formatDate(ev.date)}</p>}
                  {ev.time && <p className="text-sm opacity-80 mb-3">{ev.time} WIB</p>}
                  {invitation.location && <p className="text-xs opacity-75 mb-4">{invitation.location}</p>}
                  {invitation.maps_url && (
                    <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: colors.primary, minHeight: '40px' }}>
                      📍 Lihat Lokasi
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <GeometricDivider color={colors.primary} />

      {/* SECTION GALLERY */}
      {photos.length > 0 && (
        <section id="section-gallery" className="py-16 px-6" style={{ backgroundColor: colors.secondary }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] text-center mb-1" style={{ color: colors.primary }}>Wedding Gallery</p>
            <GeometricDivider color={colors.primary} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-2">
              {photos.map((url, i) => (
                <button key={i} type="button" onClick={() => setLightboxImg(url)}
                  className="aspect-square cursor-zoom-in relative group" aria-label={`Foto ${i + 1}`}>
                  <div className="absolute inset-0 overflow-hidden">
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  </div>
                  {/* Corner ornaments on hover */}
                  <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity"><GeometricCorner color={gold} size={20} /></div>
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: 'scaleX(-1)' }}><GeometricCorner color={gold} size={20} /></div>
                  <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: 'scaleY(-1)' }}><GeometricCorner color={gold} size={20} /></div>
                  <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: 'scale(-1)' }}><GeometricCorner color={gold} size={20} /></div>
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      <GeometricDivider color={colors.primary} />

      {/* SECTION LOVE STORY */}
      {(storyTimeline || invitation.story) && (
        <section className="py-16 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] mb-1" style={{ color: colors.primary }}>Our Love Story</p>
            <GeometricDivider color={colors.primary} />
            {storyTimeline ? (
              <div className="max-w-md mx-auto mt-4">
                {storyTimeline.map((item, idx) => (
                  <div key={idx} className="flex gap-6 mb-8 last:mb-0">
                    <div className="flex flex-col items-center flex-shrink-0">
                      {/* Diamond step indicator */}
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 rotate-45" style={{ backgroundColor: colors.primary }} />
                        <span className="relative z-10 text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                      {idx < storyTimeline.length - 1 && (
                        <div className="flex-1 w-0.5 mt-2" style={{
                          background: `repeating-linear-gradient(180deg, ${colors.primary} 0, ${colors.primary} 6px, transparent 6px, transparent 10px)`,
                          minHeight: '36px',
                        }} />
                      )}
                    </div>
                    <div className="pt-1 pb-4 text-left flex-1">
                      <p className="text-xs uppercase tracking-widest mb-1 font-semibold" style={{ color: gold }}>{item.title}</p>
                      {item.date && <p className="text-xs opacity-50 mb-2">{item.date}</p>}
                      <p className="text-sm italic opacity-80 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-10 mt-4">
                {[
                  { label: 'The Beginning', text: 'Perkenalan yang sederhana menjadi awal dari sebuah perjalanan cinta yang indah.' },
                  { label: 'Becoming One', text: 'Perjalanan kami berlanjut dalam ridho Allah.' },
                  { label: 'The Sacred Promise', text: 'Kini kami mengikat janji suci di hadapan-Nya.' },
                ].map((s, idx, arr) => (
                  <div key={s.label} className="flex flex-col items-center">
                    <div className="relative w-10 h-10 flex items-center justify-center mb-3">
                      <div className="absolute inset-0 rotate-45" style={{ backgroundColor: colors.primary }} />
                      <span className="relative z-10 text-white text-xs font-bold">{idx + 1}</span>
                    </div>
                    <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: gold }}>{s.label}</p>
                    <p className="text-sm italic opacity-75 leading-relaxed">{s.text}</p>
                    {idx < arr.length - 1 && (
                      <div className="mt-4 flex flex-col items-center gap-1">
                        <div className="w-px h-6" style={{ backgroundColor: `${colors.primary}44` }} />
                        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: `${colors.primary}66` }} />
                        <div className="w-px h-6" style={{ backgroundColor: `${colors.primary}44` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </section>
      )}

      <GeometricDivider color={colors.primary} />

      {/* SECTION GIFT */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-1" style={{ color: colors.primary }}>Wedding Gift</p>
          <GeometricDivider color={colors.primary} />
          <div className="flex flex-col gap-5 max-w-sm mx-auto mt-2">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="relative overflow-hidden text-left"
                style={{ border: `1.5px solid ${colors.primary}44`, background: `linear-gradient(160deg, ${colors.primary}08, ${colors.secondary})` }}>
                {/* Geometric left border accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{
                  background: `repeating-linear-gradient(180deg, ${colors.primary} 0, ${colors.primary} 8px, ${gold} 8px, ${gold} 10px, transparent 10px, transparent 18px)`,
                }} />
                <div className="pl-6 pr-5 py-5">
                  <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: gold }}>{item.bank}</p>
                  <p className="text-xl font-bold mb-1" style={{ color: colors.accent }}>{item.no}</p>
                  <p className="text-xs mb-4 opacity-60">a.n. {item.name}</p>
                  <button type="button" onClick={() => handleCopy(item.no, item.key)}
                    className="w-full text-sm font-semibold transition-all active:scale-95"
                    style={{ minHeight: '44px', ...(copied === item.key ? { backgroundColor: colors.primary, color: '#fff', border: 'none' } : { border: `1.5px solid ${colors.primary}`, color: colors.primary, backgroundColor: 'transparent' }) }}>
                    {copied === item.key ? '✓ Tersalin!' : 'Copy Rekening'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <GeometricDivider color={colors.primary} />

      {/* SECTION WISHES / RSVP */}
      <section id="section-wishes" className="py-16 px-6" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] text-center mb-1" style={{ color: colors.primary }}>Wishes &amp; RSVP</p>
          <GeometricDivider color={colors.primary} />
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={colors.primary} accentColor={colors.accent} bgColor={colors.secondary} />
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="relative py-16 px-6 text-center overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${colors.accent} 0%, ${colors.primary} 60%, #1b5e35 100%)` }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${gold} 0, ${gold} 1px, transparent 1px, transparent 32px)`,
        }} />
        <div className="absolute top-4 left-4 opacity-50"><GeometricCorner color={gold} size={36} /></div>
        <div className="absolute top-4 right-4 opacity-50" style={{ transform: 'scaleX(-1)' }}><GeometricCorner color={gold} size={36} /></div>
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-3">Wassalamualaikum Warahmatullahi Wabarakatuh</p>
          <p style={{ color: gold, fontSize: '0.7rem', letterSpacing: '0.3em', marginBottom: '1rem' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
          <p className="text-5xl text-white mt-2" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {invitation.partner_name} &amp; {invitation.partner_name2}
          </p>
          <div className="flex items-center justify-center gap-3 my-5">
            <div className="w-10 h-px" style={{ backgroundColor: gold }} />
            <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill={gold} /></svg>
            <div className="w-10 h-px" style={{ backgroundColor: gold }} />
          </div>
          <p className="text-white/60 text-xs mb-2">Terima kasih atas doa dan restunya</p>
          <p className="text-white/40 text-xs mt-6">© Made with Love</p>
        </div>
      </footer>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-2 backdrop-blur-md"
        style={{ backgroundColor: `${colors.accent}f0`, borderTop: `2px solid ${gold}44` }}>
        {navItems.map((item) => (
          <button key={item.id} type="button" onClick={() => scrollTo(item.id)}
            className="flex flex-col items-center justify-center w-14 h-12 transition-all hover:scale-110 active:scale-95">
            <span className="text-xl">{item.icon}</span>
          </button>
        ))}
      </nav>

      {/* MUSIC BUTTON */}
      {invitation.music_url && (
        <button type="button" onClick={toggleMusic}
          className="fixed bottom-20 right-4 z-40 w-12 h-12 flex items-center justify-center shadow-lg transition-all hover:scale-110"
          style={{ backgroundColor: colors.primary, color: '#fff', border: `2px solid ${gold}` }}
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
          <button type="button" className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white text-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => setLightboxImg(null)} aria-label="Tutup">×</button>
        </div>
      )}

      {/* COPY TOAST */}
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
