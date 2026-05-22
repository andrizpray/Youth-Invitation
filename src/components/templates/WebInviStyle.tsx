'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { TemplateProps } from './types';
import RsvpSection from './RsvpSection';

// ===== SHARED COMPONENTS =====

function WaveDivider({ color }: { color: string }) {
  return (
    <div className="overflow-hidden -mb-3" style={{ lineHeight: 0 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{ display: 'block', color, fill: 'currentColor' }}>
        <path d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,96C960,96,1056,160,1152,154.7C1248,149,1344,75,1392,37.3L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      </svg>
    </div>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className={className}>
      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
    </svg>
  );
}

function ImgCircle({ src, alt, size = '13rem', borderColor = '#fff' }: { src?: string | null; alt: string; size?: string; borderColor?: string }) {
  if (!src) {
    return (
      <div
        className="mx-auto rounded-full border-4 shadow flex items-center justify-center"
        style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%', borderColor }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="mx-auto rounded-full border-4 shadow"
      style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderColor }}
      loading="lazy"
    />
  );
}

function CountdownPill({ targetDate, textColor = '#fff' }: { targetDate: string; textColor?: string }) {
  const calc = useCallback(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff < 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      s: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }, [targetDate]);
  const [t, setT] = useState(calc);
  useEffect(() => { const i = setInterval(() => setT(calc()), 1000); return () => clearInterval(i); }, [calc]);
  return (
    <div className="inline-flex border rounded-full shadow py-2 px-4 gap-0" style={{ color: textColor }}>
      {[
        { v: t.d, l: 'Hari' }, { v: t.h, l: 'Jam' }, { v: t.m, l: 'Menit' }, { v: t.s, l: 'Detik' },
      ].map((x, i) => (
        <div key={i} className="px-2 text-center" style={{ minWidth: '4rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{x.v}</span>
          <span className="block text-xs" style={{ opacity: 0.7 }}>{x.l}</span>
        </div>
      ))}
    </div>
  );
}

function ScrollRevealSimple({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ===== STYLED COMPONENTS =====

function SectionTitle({ text, color }: { text: string; color: string }) {
  return <h2 className="font-esthetic text-center py-3 m-0" style={{ fontSize: '2rem', color }}>{text}</h2>;
}

// ===== MAIN TEMPLATE =====

export default function WebInviStyle({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try { colors = JSON.parse(invitation.colors); } catch { colors = { primary: '#c9a84c', secondary: '#fffdf5', accent: '#7c6124' }; }
  let photos: string[];
  try { photos = JSON.parse(invitation.gallery_photos || '[]'); } catch { photos = []; }

  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [storyTimeline, setStoryTimeline] = useState<any[] | null>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(invitation.story || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) setStoryTimeline(parsed);
    } catch {}
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, [invitation.story]);

  useEffect(() => {
    // Auto-play music on first interaction
    const play = () => {
      if (invitation.music_url && audioRef.current) {
        audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
      }
      document.removeEventListener('click', play);
    };
    document.addEventListener('click', play, { once: true });
    return () => document.removeEventListener('click', play);
  }, [invitation.music_url]);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(null), 2000);
    });
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else { audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {}); }
  };

  const targetDate = invitation.date_akad || invitation.date_resepsi;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const STYLE_FONT = '"Josefin Sans", sans-serif';
  const STYLE_FONT_ESTHETIC = '"Sacramento", cursive';

  return (
    <div style={{ fontFamily: STYLE_FONT }}>
      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* ===== LOADING PAGE ===== */}
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 1056, backgroundColor: colors.secondary, transition: 'opacity 0.5s', opacity: loading ? 1 : 0, pointerEvents: loading ? 'auto' : 'none' }}
      >
        <div className="text-center">
          <div className="animate-spin mb-3" style={{ width: '3rem', height: '3rem', color: colors.primary }} >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mb-0" style={{ fontFamily: STYLE_FONT_ESTHETIC, fontSize: '1.5rem', color: colors.accent }}>Memuat Undangan...</p>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className={`transition-all duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>

        {/* ===== HOME / COVER ===== */}
        <section id="section-home" className="relative overflow-hidden text-center p-0 m-0" style={{ color: '#fff' }}>
          <img
            src={photos[0] || 'https://picsum.photos/400/800'}
            alt="bg"
            className="absolute top-50 start-50 translate-middle"
            style={{ width: '100%', height: '100%', objectFit: 'cover', maskImage: 'linear-gradient(0.5turn, transparent, black 40%, black 60%, transparent)', opacity: 0.35 }}
          />
          <div className="relative py-5 px-3" style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.8))` }}>
            <p className="mb-3 pt-4" style={{ fontFamily: STYLE_FONT_ESTHETIC, fontSize: '2.25rem', fontWeight: 500 }}>Undangan Pernikahan</p>
            <div className="mx-auto rounded-full border-4 border-white/50 shadow my-4 overflow-hidden" style={{ width: '13rem', height: '13rem', maxWidth: '100%', maxHeight: '100%' }}>
              {photos[1] || photos[0] ? (
                <img src={photos[1] || photos[0]} alt="couple" className="w-full h-full" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ opacity: 0.4 }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              )}
            </div>
            <h1 className="mb-2" style={{ fontFamily: STYLE_FONT_ESTHETIC, fontSize: '2.5rem' }}>
              {invitation.partner_name} &amp; {invitation.partner_name2}
            </h1>
            {targetDate && <p className="mb-3" style={{ fontSize: '1.25rem', opacity: 0.8 }}>{fmtDate(targetDate)}</p>}
            {invitation.maps_url && (
              <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                className="inline-block rounded-full px-3 py-1"
                style={{ border: '1px solid rgba(255,255,255,0.5)', color: '#fff', fontSize: '0.825rem', textDecoration: 'none' }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="mr-2 inline" style={{ verticalAlign: 'middle' }}>
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z"/>
                </svg>
                Save Google Calendar
              </a>
            )}
            {/* Scroll mouse indicator */}
            <div className="flex justify-center mt-4 mb-2">
              <div className="border-2 rounded-3xl px-2 py-1" style={{ opacity: 0.5, borderColor: '#6c757d' }}>
                <div className="rounded-2xl" style={{ width: '0.5rem', height: '1rem', backgroundColor: '#fff', animation: 'scrollAnim 1.5s ease-in-out infinite' }}></div>
              </div>
            </div>
            <p className="pb-4 m-0" style={{ fontSize: '0.825rem', opacity: 0.6, color: '#6c757d' }}>Scroll Down</p>
          </div>
        </section>

        <WaveDivider color={colors.secondary} />

        {/* ===== MAIN CONTENT ===== */}
        <div>

          {/* BRIDE SECTION */}
          <section id="section-bride" className="text-center py-4 px-3" style={{ backgroundColor: colors.secondary, color: colors.accent }}>
            <h2 className="mb-3" style={{ fontFamily: '"Noto Naskh Arabic", serif', fontSize: '2rem' }}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
            <h2 className="mb-3" style={{ fontFamily: STYLE_FONT_ESTHETIC, fontSize: '2rem' }}>Assalamualaikum Warahmatullahi Wabarakatuh</h2>
            <p className="mb-4 px-2" style={{ fontSize: '0.95rem', opacity: 0.8 }}>
              Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami:
            </p>

            {/* Bride - Pria */}
            <ScrollRevealSimple>
              <div className="relative">
                <div className="absolute" style={{ top: '0%', right: '5%', opacity: 0.4 }}>
                  <HeartIcon />
                </div>
                <ImgCircle src={photos[1] || photos[0]} alt={invitation.partner_name} borderColor={colors.primary} />
                <h2 className="mt-3 mb-1" style={{ fontFamily: STYLE_FONT_ESTHETIC, fontSize: '2.125rem' }}>{invitation.partner_name}</h2>
                <p className="mb-0" style={{ fontSize: '0.95rem', opacity: 0.8 }}>{invitation.parent_name ? `Putra dari ${invitation.parent_name}` : ''}</p>
              </div>
            </ScrollRevealSimple>

            <h2 className="my-4" style={{ fontFamily: STYLE_FONT_ESTHETIC, fontSize: '4.5rem', color: colors.primary }}>&amp;</h2>

            {/* Bride - Wanita */}
            <ScrollRevealSimple delay={200}>
              <div className="relative">
                <div className="absolute" style={{ top: '0%', left: '5%', opacity: 0.4 }}>
                  <HeartIcon />
                </div>
                <ImgCircle src={photos[2] || photos[0]} alt={invitation.partner_name2} borderColor={colors.primary} />
                <h2 className="mt-3 mb-1" style={{ fontFamily: STYLE_FONT_ESTHETIC, fontSize: '2.125rem' }}>{invitation.partner_name2}</h2>
                <p className="mb-0" style={{ fontSize: '0.95rem', opacity: 0.8 }}>{invitation.parent_name2 ? `Putri dari ${invitation.parent_name2}` : ''}</p>
              </div>
            </ScrollRevealSimple>
          </section>

          <WaveDivider color={colors.secondary} />

          {/* QURAN VERSES */}
          <section className="py-3 px-3 text-center" style={{ backgroundColor: colors.secondary, color: colors.accent }}>
            <SectionTitle text="Allah SWT Berfirman" color={colors.primary} />
            <div className="w-full" style={{ maxWidth: '500px' }}>
              <div className="p-3 mb-3 rounded-2xl shadow-sm" style={{ backgroundColor: '#fff' }}>
                <p className="mb-2" style={{ fontSize: '0.95rem' }}>
                  "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)."
                </p>
                <p className="mb-0" style={{ fontSize: '0.95rem', color: colors.primary }}>QS. Adh-Dhariyat: 49</p>
              </div>
              <div className="p-3 rounded-2xl shadow-sm" style={{ backgroundColor: '#fff' }}>
                <p className="mb-2" style={{ fontSize: '0.95rem' }}>
                  "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri..."
                </p>
                <p className="mb-0" style={{ fontSize: '0.95rem', color: colors.primary }}>QS. Ar-Rum: 21</p>
              </div>
            </div>
          </section>

          {/* LOVE STORY */}
          {invitation.story && (
            <>
              <WaveDivider color={colors.secondary} />
              <section className="py-3 px-3" style={{ backgroundColor: colors.secondary, color: colors.accent }}>
                <div className="w-full" style={{ maxWidth: '500px' }}>
                  <div className="p-3 rounded-3xl shadow-sm" style={{ backgroundColor: '#fff' }}>
                    <SectionTitle text="Kisah Cinta" color={colors.primary} />
                    <div className="overflow-y-auto p-2" style={{ height: '15rem' }}>
                      {storyTimeline ? storyTimeline.map((item, idx) => (
                        <div key={idx} className="flex mb-3">
                          <div className="w-auto relative">
                            <p className="flex items-center justify-center rounded-full m-0 p-0 z-10 border-2 relative"
                              style={{ width: '2rem', height: '2rem', backgroundColor: '#fff', borderColor: colors.primary, color: colors.primary }}>
                              {idx + 1}
                            </p>
                            {idx < (storyTimeline?.length || 0) - 1 && (
                              <hr className="absolute top-0 start-50 translate-middle-x border h-full z-0 m-0" style={{ borderColor: colors.primary, opacity: 0.3 }} />
                            )}
                          </div>
                          <div className="mt-1 mb-2" style={{ paddingLeft: 0 }}>
                            <p className="font-bold mb-1" style={{ fontSize: '0.95rem' }}>
                              {item.emoji || '💍'} {item.title || ''}
                            </p>
                            {item.date && <p className="mb-1" style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.date}</p>}
                            <p className="small mb-0" style={{ opacity: 0.8 }}>{item.description || ''}</p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-center small" style={{ opacity: 0.7 }}>{'Kisah cinta kami yang penuh berkah...'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* WEDDING DATE / COUNTDOWN */}
          {targetDate && (
            <>
              <WaveDivider color={colors.secondary} />
              <section id="section-event" className="py-3 px-3 text-center" style={{ backgroundColor: colors.secondary, color: colors.accent }}>
                <SectionTitle text="Moment Bahagia" color={colors.primary} />
                <div className="py-2">
                  <CountdownPill targetDate={targetDate} textColor={colors.accent} />
                </div>
                <p className="py-2 m-0" style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                  InsyaAllah kami akan menyelenggarakan acara:
                </p>

                {/* Akad */}
                {invitation.date_akad && (
                  <ScrollRevealSimple>
                    <div className="py-2">
                      <h3 className="mb-1" style={{ fontFamily: STYLE_FONT_ESTHETIC, fontSize: '1.75rem', color: colors.primary }}>Akad Nikah</h3>
                      <p className="my-1" style={{ fontSize: '1rem' }}>{fmtDate(invitation.date_akad)}</p>
                      {invitation.time_akad && <p className="my-1" style={{ fontSize: '0.9rem', opacity: 0.8 }}>Pukul {invitation.time_akad} WIB</p>}
                      {invitation.location && <p className="my-1" style={{ fontSize: '0.9rem', opacity: 0.8 }}>{invitation.location}</p>}
                      {invitation.maps_url && (
                        <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                          className="inline-block rounded-full px-4"
                          style={{ border: `1px solid ${colors.accent}`, color: colors.accent, fontSize: '0.85rem' }}
                        >
                          <i className="fa-regular fa-map me-2"></i>Buka Maps
                        </a>
                      )}
                    </div>
                  </ScrollRevealSimple>
                )}

                {/* Resepsi */}
                {invitation.date_resepsi && (
                  <ScrollRevealSimple delay={200}>
                    <div className="py-2 mt-3">
                      <h3 className="mb-1" style={{ fontFamily: STYLE_FONT_ESTHETIC, fontSize: '1.75rem', color: colors.primary }}>Resepsi</h3>
                      <p className="my-1" style={{ fontSize: '1rem' }}>{fmtDate(invitation.date_resepsi)}</p>
                      {invitation.time_resepsi && <p className="my-1" style={{ fontSize: '0.9rem', opacity: 0.8 }}>Pukul {invitation.time_resepsi} WIB</p>}
                      {invitation.location && <p className="my-1" style={{ fontSize: '0.9rem', opacity: 0.8 }}>{invitation.location}</p>}
                      {invitation.maps_url && (
                        <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                          className="inline-block rounded-full px-4"
                          style={{ border: `1px solid ${colors.accent}`, color: colors.accent, fontSize: '0.85rem' }}
                        >
                          <i className="fa-regular fa-map me-2"></i>Buka Maps
                        </a>
                      )}
                    </div>
                  </ScrollRevealSimple>
                )}
              </section>
            </>
          )}

          {/* GALLERY */}
          {photos.length > 0 && (
            <>
              <WaveDivider color={colors.secondary} />
              <section id="section-gallery" className="py-3 px-3 text-center" style={{ backgroundColor: colors.secondary, color: colors.accent }}>
                <SectionTitle text="Gallery" color={colors.primary} />
                <div className="flex flex-wrap justify-center gap-2" style={{ maxWidth: '500px', margin: '0 auto' }}>
                  {photos.map((photo, idx) => (
                    <div key={idx} className="overflow-hidden cursor-pointer" style={{ width: 'calc(33.333% - 0.5rem)', aspectRatio: '3/4' }} onClick={() => setLightboxImg(photo)}>
                      <img src={photo} alt={`Gallery ${idx + 1}`} className="w-full h-full" style={{ objectFit: 'cover', transition: 'transform 0.3s' }} loading="lazy" />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* WEDDING GIFT */}
          <>
            <WaveDivider color={colors.secondary} />
            <section id="section-gift" className="py-3 px-3 text-center" style={{ backgroundColor: colors.secondary, color: colors.accent }}>
              <SectionTitle text="Wedding Gift" color={colors.primary} />
              <p className="mb-4" style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                Doa restu Anda adalah hadiah terindah. Jika ingin memberi tanda kasih:
              </p>
              <div className="flex flex-wrap justify-center gap-3" style={{ maxWidth: '500px', margin: '0 auto' }}>
                {[{ name: 'BCA', acc: '123 456 7890' }, { name: 'Mandiri', acc: '987 654 3210' }].map((b) => (
                  <div key={b.name} className="flex-1 p-3 rounded-2xl text-left shadow-sm" style={{ backgroundColor: '#fff', minWidth: '200px' }}>
                    <p className="font-bold mb-1" style={{ fontSize: '0.95rem', color: colors.accent }}>{b.name}</p>
                    <p className="mb-1" style={{ fontSize: '0.75rem', opacity: 0.6 }}>a.n. {invitation.partner_name} &amp; {invitation.partner_name2}</p>
                    <p className="mb-2" style={{ fontSize: '1.1rem', letterSpacing: '0.1em', color: colors.primary }}>{b.acc}</p>
                    <button
                      onClick={() => handleCopy(b.acc.replace(/\s/g, ''), b.name.toLowerCase())}
                      className="inline-block rounded-full px-4"
                      style={{ backgroundColor: colors.accent, color: '#fff', border: 'none', fontSize: '0.8rem' }}
                    >
                      {copied === b.name.toLowerCase() ? '✓ Tersalin' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>

          {/* WISHES / RSVP */}
          <WaveDivider color={colors.secondary} />
          <section id="section-wishes" className="py-3 px-3 text-center" style={{ backgroundColor: colors.secondary, color: colors.accent }}>
            <SectionTitle text="R.S.V.P" color={colors.primary} />
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <RsvpSection
                guests={guests}
                onSubmit={onRsvpSubmit}
                rsvpStatus={rsvpStatus}
                rsvpError={rsvpError}
                primaryColor={colors.primary}
                accentColor={colors.accent}
                bgColor="#fff"
              />
            </div>
          </section>

          {/* FOOTER */}
          <footer className="text-center py-4 px-3" style={{ backgroundColor: colors.accent, color: '#fff' }}>
            <p className="mb-1" style={{ fontFamily: STYLE_FONT_ESTHETIC, fontSize: '1.5rem' }}>Terima Kasih</p>
            <p className="mb-2 small px-3" style={{ opacity: 0.8 }}>
              Merupakan suatu kebahagiaan dan kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.
            </p>
            <p className="mb-0" style={{ fontFamily: STYLE_FONT_ESTHETIC, fontSize: '2rem', color: colors.primary }}>
              {invitation.partner_name} &amp; {invitation.partner_name2}
            </p>
            <p className="mt-3 mb-0 small" style={{ opacity: 0.5 }}>&copy; 2025 Undangan Digital</p>
          </footer>

          {/* Music Button */}
          {invitation.music_url && (
            <button onClick={toggleMusic}
              className="fixed shadow flex items-center justify-center rounded-full"
              style={{ bottom: '5rem', right: '1rem', zIndex: 40, width: '3rem', height: '3rem', backgroundColor: colors.primary, color: '#fff', border: 'none' }}
            >
              {musicPlaying ? '🔊' : '🔇'}
            </button>
          )}

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 w-full flex justify-center py-1" style={{ backgroundColor: colors.accent }}>
            <ul className="flex items-center gap-3 p-0 m-0 list-none">
              {[
                { id: 'section-home', icon: 'fa-house', label: 'Home' },
                { id: 'section-bride', icon: 'fa-heart', label: 'Couple' },
                { id: 'section-event', icon: 'fa-calendar', label: 'Event' },
                { id: 'section-gallery', icon: 'fa-image', label: 'Gallery' },
                { id: 'section-wishes', icon: 'fa-comment', label: 'Wishes' },
              ].map((item) => (
                <li key={item.id} className="list-none">
                  <a className="flex flex-col items-center px-2" href={`#${item.id}`} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', textDecoration: 'none' }}
                    onClick={(e) => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }); }}>
                    <i className={`fa-solid ${item.icon}`} style={{ fontSize: '1.1rem' }}></i>
                    <span className="mt-0">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Lightbox */}
          {lightboxImg && (
            <div className="fixed inset-0 flex items-center justify-center cursor-pointer" style={{ zIndex: 1055, backgroundColor: 'rgba(0,0,0,0.9)' }} onClick={() => setLightboxImg(null)}>
              <img src={lightboxImg} alt="Gallery" className="max-w-full max-h-full p-3" style={{ objectFit: 'contain' }} />
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        @keyframes scrollAnim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .font-esthetic { font-family: 'Sacramento', cursive !important; }
        .fa-solid, .fa-regular { font-family: 'Font Awesome 6 Free' !important; }
      `}</style>
    </div>
  );
}
