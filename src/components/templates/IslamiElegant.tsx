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
      <span style={{ color, fontSize: '1.1rem', textShadow: `0 0 8px ${color}88` }}>✦</span>
      <div style={{ height: '1px', width: '60px', background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

function StarDivider({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div style={{ height: '1px', flex: 1, maxWidth: '80px', background: `linear-gradient(to right, transparent, ${color}88)` }} />
      <span style={{ color, fontSize: '0.6rem', opacity: 0.6 }}>✦</span>
      <div style={{ height: '1px', width: '12px', background: `${color}55` }} />
      <span style={{ color, fontSize: '1rem', textShadow: `0 0 12px ${color}, 0 0 24px ${color}88` }}>✦</span>
      <div style={{ height: '1px', width: '12px', background: `${color}55` }} />
      <span style={{ color, fontSize: '0.6rem', opacity: 0.6 }}>✦</span>
      <div style={{ height: '1px', flex: 1, maxWidth: '80px', background: `linear-gradient(to left, transparent, ${color}88)` }} />
    </div>
  );
}

function Starfield({ count = 60, gold }: { count?: number; gold: string }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    top: `${(i * 37 + 13) % 100}%`,
    left: `${(i * 61 + 7) % 100}%`,
    size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
    delay: `${(i * 0.31) % 3}s`,
    duration: `${2.5 + (i % 4) * 0.5}s`,
    opacity: 0.15 + (i % 6) * 0.08,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            backgroundColor: i % 7 === 0 ? gold : '#ffffff',
            opacity: s.opacity,
            animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
            boxShadow: i % 7 === 0 ? `0 0 4px ${gold}88` : undefined,
          }} />
      ))}
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

      {/* COVER */}
      <section id="section-cover" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden"
        style={{ background: `linear-gradient(180deg, #040c18 0%, #060e1a 40%, ${navy} 100%)` }}>
        <Starfield count={80} gold={gold} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 55% at 50% 45%, ${gold}18 0%, transparent 70%)` }} />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-2xl mb-2 opacity-0 animate-[fadeInDown_0.9s_ease-out_0.1s_forwards]"
            style={{ color: gold, direction: 'rtl', textShadow: `0 0 20px ${gold}66` }}>
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <OrnamentDivider color={gold} />
          <p className="text-xs uppercase tracking-[0.4em] mb-8 opacity-0 animate-[fadeInDown_0.9s_ease-out_0.2s_forwards]"
            style={{ color: cream + '88' }}>The Sacred Union</p>

          <h1 className="text-5xl md:text-6xl mb-2 opacity-0 animate-[fadeInUp_0.9s_ease-out_0.3s_forwards]"
            style={{ color: cream, textShadow: `0 2px 20px ${navy}` }}>
            {invitation.partner_name}
          </h1>
          <p className="text-3xl my-3 opacity-0 animate-[fadeInUp_0.9s_ease-out_0.4s_forwards]"
            style={{ color: gold, textShadow: `0 0 16px ${gold}` }}>✦</p>
          <h2 className="text-5xl md:text-6xl mb-8 opacity-0 animate-[fadeInUp_0.9s_ease-out_0.5s_forwards]"
            style={{ color: cream, textShadow: `0 2px 20px ${navy}` }}>
            {invitation.partner_name2}
          </h2>

          {targetDate && (
            <p className="text-sm tracking-widest mb-10 opacity-0 animate-[fadeInUp_0.9s_ease-out_0.6s_forwards]"
              style={{ color: cream + 'bb' }}>
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <div className="flex gap-3 opacity-0 animate-[fadeInUp_0.9s_ease-out_0.7s_forwards]">
            <button type="button" onClick={() => scrollTo('section-bismillah')}
              className="px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: gold, color: navy, minHeight: '48px', boxShadow: `0 0 20px ${gold}66` }}>
              ✉ Buka Undangan
            </button>
          </div>
        </div>
      </section>

      {/* BISMILLAH / VERSE */}
      <section id="section-bismillah" className="relative py-20 px-6 text-center overflow-hidden"
        style={{ background: `linear-gradient(180deg, #060e1a, #0d1f3c)` }}>
        <Starfield count={30} gold={gold} />
        <div className="relative z-10">
          <ScrollReveal>
            {/* Ornamental arch */}
            <div className="relative inline-block mb-6 px-8 py-6 mx-auto"
              style={{
                background: `linear-gradient(135deg, ${navy}cc, #0d1f3c)`,
                border: `1px solid ${gold}44`,
                borderRadius: '12px 12px 50% 50% / 12px 12px 30px 30px',
                boxShadow: `0 0 30px ${gold}18`,
              }}>
              {/* Star corners */}
              {['-top-2 -left-2', '-top-2 -right-2', '-bottom-1 -left-2', '-bottom-1 -right-2'].map((pos, i) => (
                <span key={i} className={`absolute text-xs ${pos}`} style={{ color: gold, textShadow: `0 0 8px ${gold}` }}>✦</span>
              ))}
              <p className="text-2xl leading-loose" style={{ color: gold, direction: 'rtl', textShadow: `0 0 12px ${gold}44` }}>
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
              </p>
            </div>
            <StarDivider color={gold} />
            <p className="italic max-w-sm mx-auto leading-relaxed text-sm mb-3" style={{ color: cream + 'cc' }}>
              &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.&rdquo;
            </p>
            <p className="text-xs tracking-widest mb-8" style={{ color: gold }}>— QS. Ar-Rum: 21</p>
            {targetDate && <Countdown targetDate={targetDate} primaryColor={gold} accentColor={cream} />}
          </ScrollReveal>
        </div>
      </section>

      {/* COUPLE */}
      <section id="section-couple" className="py-20 px-6 text-center"
        style={{ background: `linear-gradient(180deg, #0d1f3c, ${navy})` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: gold + '99' }}>Mempelai</p>
          <OrnamentDivider color={gold} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
            {[
              { label: 'MEMPELAI PRIA', name: invitation.partner_name, parent: invitation.parent_name, photo: photos[0] },
              { label: 'MEMPELAI WANITA', name: invitation.partner_name2, parent: invitation.parent_name2, photo: photos[1] },
            ].map((p, i) => (
              <div key={i} className="p-6 rounded-2xl text-center relative overflow-hidden"
                style={{
                  border: `1px solid ${gold}55`,
                  background: `linear-gradient(145deg, ${gold}0d, ${navy}cc)`,
                  boxShadow: `inset 0 0 40px ${gold}08`,
                }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 30%, ${gold}12 0%, transparent 65%)` }} />
                {p.photo && (
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${gold}44 0%, transparent 70%)`, transform: 'scale(1.15)' }} />
                    <div className="w-full h-full rounded-full overflow-hidden border-4 relative z-10" style={{ borderColor: gold, boxShadow: `0 0 20px ${gold}55` }}>
                      <img src={p.photo} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
                <p className="text-xs tracking-widest mb-2" style={{ color: gold + 'aa' }}>{p.label}</p>
                <p className="text-2xl mb-2" style={{ color: cream }}>{p.name}</p>
                {p.parent && (
                  <>
                    <p className="text-xs" style={{ color: cream + '88' }}>Putra/i dari</p>
                    <p className="text-sm mt-1" style={{ color: cream + 'cc' }}>{p.parent}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* EVENT */}
      <section id="section-event" className="py-20 px-6 text-center"
        style={{ background: `linear-gradient(180deg, ${navy}, #0d1f3c)` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: gold + '99' }}>Save The Date</p>
          <StarDivider color={gold} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
            {(invitation.date_akad || invitation.time_akad) && (
              <div className="p-8 rounded-2xl relative overflow-hidden"
                style={{
                  border: `1px solid ${gold}66`,
                  background: `linear-gradient(145deg, #0d1f3cee, ${navy})`,
                  boxShadow: `0 0 25px ${gold}14`,
                }}>
                <div className="absolute top-3 right-3 text-sm" style={{ color: gold, opacity: 0.5 }}>✦</div>
                <div className="text-3xl mb-3" style={{ color: gold, textShadow: `0 0 12px ${gold}88` }}>🕌</div>
                <p className="text-lg font-semibold mb-2" style={{ color: cream }}>Akad Nikah</p>
                {invitation.date_akad && <p className="text-sm mb-1" style={{ color: cream }}>{formatDate(invitation.date_akad)}</p>}
                {invitation.time_akad && <p className="text-sm mb-3" style={{ color: cream + 'cc' }}>{invitation.time_akad} WIB</p>}
                {invitation.location && <p className="text-xs mb-4" style={{ color: cream + '88' }}>{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex px-4 py-2 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: gold, color: navy, minHeight: '40px', boxShadow: `0 0 12px ${gold}66` }}>
                    📍 Lihat Lokasi
                  </a>
                )}
              </div>
            )}
            {(invitation.date_resepsi || invitation.time_resepsi) && (
              <div className="p-8 rounded-2xl relative overflow-hidden"
                style={{
                  border: `1px solid ${gold}66`,
                  background: `linear-gradient(145deg, #0d1f3cee, ${navy})`,
                  boxShadow: `0 0 25px ${gold}14`,
                }}>
                <div className="absolute top-3 right-3 text-sm" style={{ color: gold, opacity: 0.5 }}>✦</div>
                <div className="text-3xl mb-3" style={{ color: gold, textShadow: `0 0 12px ${gold}88` }}>🌙</div>
                <p className="text-lg font-semibold mb-2" style={{ color: cream }}>Resepsi</p>
                {invitation.date_resepsi && <p className="text-sm mb-1" style={{ color: cream }}>{formatDate(invitation.date_resepsi)}</p>}
                {invitation.time_resepsi && <p className="text-sm mb-3" style={{ color: cream + 'cc' }}>{invitation.time_resepsi} WIB</p>}
                {invitation.location && <p className="text-xs mb-4" style={{ color: cream + '88' }}>{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex px-4 py-2 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: gold, color: navy, minHeight: '40px', boxShadow: `0 0 12px ${gold}66` }}>
                    📍 Lihat Lokasi
                  </a>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* GALLERY */}
      {photos.length > 0 && (
        <section id="section-gallery" className="py-20 px-6"
          style={{ background: `linear-gradient(180deg, #0d1f3c, ${navy})` }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] text-center mb-2" style={{ color: gold + '99' }}>Wedding Gallery</p>
            <OrnamentDivider color={gold} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {photos.map((url, i) => (
                <button key={i} type="button" onClick={() => setLightboxImg(url)}
                  className="aspect-square rounded-xl overflow-hidden cursor-zoom-in relative group block"
                  style={{ border: `1px solid ${gold}33` }}
                  aria-label={`Foto ${i + 1}`}>
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  {/* Gold corner brackets on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {[['top-1 left-1', 'border-t-2 border-l-2'], ['top-1 right-1', 'border-t-2 border-r-2'], ['bottom-1 left-1', 'border-b-2 border-l-2'], ['bottom-1 right-1', 'border-b-2 border-r-2']].map(([pos, border], j) => (
                      <div key={j} className={`absolute w-4 h-4 ${pos} ${border}`} style={{ borderColor: gold }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* LOVE STORY */}
      {(storyTimeline || invitation.story) && (
        <section className="py-20 px-6 text-center"
          style={{ background: `linear-gradient(180deg, ${navy}, #091525)` }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: gold + '99' }}>Our Love Story</p>
            <StarDivider color={gold} />
            {storyTimeline ? (
              <div className="max-w-md mx-auto">
                {storyTimeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4 mb-8 last:mb-0">
                    <div className="flex flex-col items-center">
                      {/* Diamond-shaped number indicator */}
                      <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-xs font-bold relative"
                        style={{
                          background: `linear-gradient(135deg, ${gold}, ${gold}cc)`,
                          color: navy,
                          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                          boxShadow: `0 0 14px ${gold}88`,
                        }}>
                        {idx + 1}
                      </div>
                      {idx < storyTimeline.length - 1 && (
                        <div className="flex-1 w-px mt-2" style={{ background: `linear-gradient(to bottom, ${gold}55, transparent)`, minHeight: '32px' }} />
                      )}
                    </div>
                    <div className="pt-1 pb-4 text-left flex-1">
                      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: gold, textShadow: `0 0 8px ${gold}66` }}>{item.title}</p>
                      {item.date && <p className="text-xs mb-2" style={{ color: cream + '66' }}>{item.date}</p>}
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
                      {idx === 0 && 'Perkenalan yang sederhana menjadi awal dari sebuah perjalanan cinta yang indah.'}
                      {idx === 1 && 'Perjalanan kami berlanjut dalam ridho Allah SWT.'}
                      {idx === 2 && 'Kini kami siap mengikat janji suci di hadapan-Nya.'}
                    </p>
                    {idx < 2 && <p className="text-xl mt-6" style={{ color: gold, textShadow: `0 0 12px ${gold}` }}>✦</p>}
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </section>
      )}

      {/* GIFT */}
      <section className="py-20 px-6 text-center"
        style={{ background: `linear-gradient(180deg, #091525, ${navy})` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: gold + '99' }}>Wedding Gift</p>
          <OrnamentDivider color={gold} />
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="p-5 rounded-xl text-left relative overflow-hidden"
                style={{
                  borderTop: `1px solid ${gold}33`,
                  borderRight: `1px solid ${gold}22`,
                  borderBottom: `1px solid ${gold}22`,
                  borderLeft: `3px solid ${gold}`,
                  background: `linear-gradient(135deg, ${gold}0a, ${navy}cc)`,
                }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: gold }}>{item.bank}</p>
                <p className="text-xl font-bold mb-1" style={{ color: cream }}>{item.no}</p>
                <p className="text-xs mb-4" style={{ color: cream + '88' }}>a.n. {item.name}</p>
                <button type="button" onClick={() => handleCopy(item.no, item.key)}
                  className="w-full rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{
                    minHeight: '44px',
                    ...(copied === item.key
                      ? { backgroundColor: gold, color: navy, boxShadow: `0 0 12px ${gold}88` }
                      : { border: `1.5px solid ${gold}66`, color: gold })
                  }}>
                  {copied === item.key ? '✓ Tersalin!' : 'Copy Rekening'}
                </button>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* WISHES / RSVP */}
      <section id="section-wishes" className="py-20 px-6"
        style={{ background: `linear-gradient(180deg, ${navy}, #091525)` }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.4em] text-center mb-2" style={{ color: gold + '99' }}>Wishes &amp; RSVP</p>
          <OrnamentDivider color={gold} />
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={gold} accentColor={cream} bgColor={navy + 'cc'} />
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="relative py-16 px-6 text-center overflow-hidden"
        style={{ background: `linear-gradient(180deg, #091525, #020810)` }}>
        <Starfield count={50} gold={gold} />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: gold + '88' }}>Jazakumullahu Khairan</p>
          <StarDivider color={gold} />
          <p className="text-sm mb-6" style={{ color: cream + 'aa' }}>Terima kasih atas doa dan restunya</p>
          <p className="text-3xl md:text-4xl mt-4" style={{ color: cream, textShadow: `0 0 20px ${gold}44` }}>
            {invitation.partner_name}
            <span style={{ color: gold, margin: '0 12px', textShadow: `0 0 16px ${gold}` }}>✦</span>
            {invitation.partner_name2}
          </p>
          <div className="flex justify-center gap-4 mt-8 text-lg" style={{ color: gold + '44' }}>
            {'✦  ✦  ✦'.split('  ').map((s, i) => (
              <span key={i} style={{ animation: `twinkle ${2 + i * 0.4}s ease-in-out ${i * 0.6}s infinite`, display: 'inline-block' }}>{s}</span>
            ))}
          </div>
          <p className="text-xs mt-6" style={{ color: cream + '33' }}>© Made with Love</p>
        </div>
      </footer>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-3 backdrop-blur-md"
        style={{ backgroundColor: `#040c18ee`, borderTop: `1px solid ${gold}55` }}>
        {navItems.map((item) => (
          <button key={item.id} type="button" onClick={() => scrollTo(item.id)}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all hover:scale-110 active:scale-95">
            <span className="text-2xl">{item.icon}</span>
          </button>
        ))}
      </nav>

      {/* MUSIC BUTTON */}
      {invitation.music_url && (
        <button type="button" onClick={toggleMusic}
          className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          style={{ backgroundColor: gold, color: navy, boxShadow: `0 0 16px ${gold}88` }} aria-label="Toggle music">
          <span className={musicPlaying ? 'animate-spin-slow' : ''}>{musicPlaying ? '⏸' : '🎵'}</span>
        </button>
      )}

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.94)' }}
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
        <div className="fixed bottom-40 left-1/2 z-[60] px-5 py-3 rounded-full text-sm shadow-xl pointer-events-none"
          style={{ backgroundColor: gold, color: navy, transform: 'translateX(-50%)', boxShadow: `0 0 20px ${gold}88` }}>
          ✓ Nomor rekening disalin!
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes twinkle { 0%, 100% { opacity: var(--tw-opacity, 0.3); transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
