'use client';

import { useEffect, useRef, useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import { TemplateProps } from './types';

function HeartDivider({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="flex-1 h-px max-w-[80px]" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <span className="text-xl" style={{ color }}>♥</span>
      <div className="flex-1 h-px max-w-[80px]" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

export default function RomanticBlush({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#e8b4b8', secondary: '#fdf6f6', accent: '#8b4a4f' };
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
    { id: 'section-cover', icon: '🏠', label: 'Home' },
    { id: 'section-couple', icon: '💑', label: 'Couple' },
    { id: 'section-event', icon: '📅', label: 'Event' },
    { id: 'section-gallery', icon: '📷', label: 'Gallery' },
    { id: 'section-wishes', icon: '💬', label: 'Wishes' },
  ];

  const heroPhoto = photos[0] || null;

  return (
    <div style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif', color: colors.accent, backgroundColor: colors.secondary, paddingBottom: '80px' }}>

      {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

      {/* SECTION 1: COVER */}
      <section id="section-cover" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${colors.primary}cc 0%, ${colors.secondary} 60%, ${colors.primary}55 100%)` }}>

        {/* Floating heart decorations */}
        <div className="absolute top-12 left-8 text-4xl opacity-20" style={{ animation: 'floatHeart 4s ease-in-out infinite', color: colors.accent }}>♥</div>
        <div className="absolute top-32 right-6 text-2xl opacity-15" style={{ animation: 'floatHeart 5s ease-in-out 1s infinite', color: colors.primary }}>♥</div>
        <div className="absolute bottom-24 left-12 text-3xl opacity-20" style={{ animation: 'floatHeart 6s ease-in-out 2s infinite', color: colors.accent }}>♥</div>
        <div className="absolute bottom-16 right-10 text-5xl opacity-10" style={{ animation: 'floatHeart 4.5s ease-in-out 0.5s infinite', color: colors.primary }}>♥</div>

        {/* Rounded decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"
          style={{ background: `radial-gradient(circle, ${colors.primary}, transparent)` }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 translate-x-1/3 translate-y-1/3"
          style={{ background: `radial-gradient(circle, ${colors.primary}, transparent)` }} />

        <div className="relative z-10 flex flex-col items-center">
          {heroPhoto && (
            <div className="w-36 h-36 mx-auto mb-8 rounded-full overflow-hidden"
              style={{ border: `4px solid ${colors.primary}`, boxShadow: `0 0 0 8px ${colors.primary}44, 0 8px 32px ${colors.primary}66` }}>
              <img src={heroPhoto} alt={invitation.partner_name} className="w-full h-full object-cover" />
            </div>
          )}

          <p className="text-xs uppercase tracking-[0.4em] mb-4 opacity-0 animate-[fadeInDown_0.8s_ease-out_0.1s_forwards]" style={{ color: colors.accent }}>~ Wedding Invitation ~</p>

          <h1 className="text-6xl md:text-7xl mb-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]"
            style={{ fontFamily: '"Great Vibes", cursive', color: colors.accent }}>
            {invitation.partner_name}
          </h1>
          <p className="text-4xl my-1 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]"
            style={{ fontFamily: '"Great Vibes", cursive', color: colors.primary }}>♥</p>
          <h1 className="text-6xl md:text-7xl mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]"
            style={{ fontFamily: '"Great Vibes", cursive', color: colors.accent }}>
            {invitation.partner_name2}
          </h1>

          {targetDate && (
            <p className="text-sm tracking-widest opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]" style={{ color: colors.accent }}>
              {new Date(targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <div className="mt-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
            <HeartDivider color={colors.primary} />
          </div>

          {guests && guests.length > 0 && (
            <p className="text-sm mt-4 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.7s_forwards]" style={{ color: colors.accent }}>
              Kepada Yth. <span className="font-semibold">{guests[0]?.name}</span>
            </p>
          )}
        </div>
      </section>

      {/* SECTION 2: BISMILLAH */}
      <section id="section-bismillah" className="py-20 px-6 text-center">
        <ScrollReveal>
          <div className="max-w-md mx-auto p-10 rounded-[2rem] relative"
            style={{ backgroundColor: colors.primary + '22', border: `1.5px solid ${colors.primary}55`, boxShadow: `0 8px 40px ${colors.primary}33` }}>
            {/* Heart corner decorations */}
            <span className="absolute top-4 left-5 text-xl opacity-30" style={{ color: colors.primary }}>♥</span>
            <span className="absolute top-4 right-5 text-xl opacity-30" style={{ color: colors.primary }}>♥</span>

            <p className="text-xs uppercase tracking-[0.35em] mb-4" style={{ color: colors.accent }}>Assalamualaikum Wr. Wb.</p>
            <HeartDivider color={colors.primary} />
            <p className="italic max-w-sm mx-auto leading-relaxed text-sm opacity-80 mb-3">
              &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.&rdquo;
            </p>
            <p className="text-xs tracking-widest mt-4" style={{ color: colors.primary }}>— QS. Ar-Rum: 21</p>
            <HeartDivider color={colors.primary} />
            {targetDate && <Countdown targetDate={targetDate} primaryColor={colors.primary} accentColor={colors.accent} />}

            <span className="absolute bottom-4 left-5 text-xl opacity-30" style={{ color: colors.primary }}>♥</span>
            <span className="absolute bottom-4 right-5 text-xl opacity-30" style={{ color: colors.primary }}>♥</span>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 3: COUPLE */}
      <section id="section-couple" className="py-20 px-6 text-center" style={{ backgroundColor: colors.primary + '18' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: colors.accent }}>The Bride &amp; Groom</p>
          <HeartDivider color={colors.primary} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-4">
            {[
              { photo: photos[0], name: invitation.partner_name, role: 'MEMPELAI PRIA', parent: invitation.parent_name, parentLabel: 'Putra dari' },
              { photo: photos[1], name: invitation.partner_name2, role: 'MEMPELAI WANITA', parent: invitation.parent_name2, parentLabel: 'Putri dari' },
            ].map((p, i) => (
              <div key={i} className="p-8 rounded-[2rem] text-center relative"
                style={{ backgroundColor: colors.secondary, border: `1.5px solid ${colors.primary}44`, boxShadow: `0 8px 32px ${colors.primary}33` }}>
                <span className="absolute top-4 right-5 text-lg opacity-25" style={{ color: colors.primary }}>♥</span>
                {p.photo && (
                  <div className="w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden"
                    style={{ border: `4px solid ${colors.primary}`, boxShadow: `0 0 0 6px ${colors.primary}33` }}>
                    <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-xs tracking-widest opacity-50 mb-2">{p.role}</p>
                <p className="text-3xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.accent }}>{p.name}</p>
                {p.parent && (
                  <>
                    <p className="text-xs opacity-60">{p.parentLabel}</p>
                    <p className="text-sm mt-1 opacity-80">{p.parent}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 4: EVENT */}
      <section id="section-event" className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: colors.accent }}>Save The Date</p>
          <HeartDivider color={colors.primary} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-4">
            {(invitation.date_akad || invitation.time_akad) && (
              <div className="p-8 rounded-[2rem] relative overflow-hidden"
                style={{ backgroundColor: colors.primary + '22', border: `1.5px solid ${colors.primary}44` }}>
                {/* Heart ornament top */}
                <div className="flex justify-center mb-3">
                  <span className="text-3xl" style={{ color: colors.primary, animation: 'sparkle 2s ease-in-out infinite' }}>♥</span>
                </div>
                <p className="text-2xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.accent }}>Akad Nikah</p>
                <div className="w-12 h-px mx-auto my-3" style={{ backgroundColor: colors.primary }} />
                {invitation.date_akad && <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_akad)}</p>}
                {invitation.time_akad && <p className="text-sm opacity-70 mb-3">{invitation.time_akad} WIB</p>}
                {invitation.location && <p className="text-xs opacity-70 leading-relaxed mb-4">{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: colors.primary, color: colors.accent, minHeight: '40px' }}>
                    📍 Lihat Lokasi
                  </a>
                )}
              </div>
            )}

            {(invitation.date_resepsi || invitation.time_resepsi) && (
              <div className="p-8 rounded-[2rem] relative"
                style={{ backgroundColor: colors.primary + '22', border: `1.5px solid ${colors.primary}44` }}>
                <div className="flex justify-center mb-3">
                  <span className="text-3xl" style={{ color: colors.primary, animation: 'sparkle 2s ease-in-out 0.5s infinite' }}>♥</span>
                </div>
                <p className="text-2xl mb-3" style={{ fontFamily: '"Great Vibes", cursive', color: colors.accent }}>Resepsi</p>
                <div className="w-12 h-px mx-auto my-3" style={{ backgroundColor: colors.primary }} />
                {invitation.date_resepsi && <p className="text-sm font-semibold mb-1">{formatDate(invitation.date_resepsi)}</p>}
                {invitation.time_resepsi && <p className="text-sm opacity-70 mb-3">{invitation.time_resepsi} WIB</p>}
                {invitation.location && <p className="text-xs opacity-70 leading-relaxed mb-4">{invitation.location}</p>}
                {invitation.maps_url && (
                  <a href={invitation.maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: colors.primary, color: colors.accent, minHeight: '40px' }}>
                    📍 Lihat Lokasi
                  </a>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 5: GALLERY */}
      {photos.length > 0 && (
        <section id="section-gallery" className="py-20 px-6" style={{ backgroundColor: colors.primary + '18' }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: colors.accent }}>Wedding Gallery</p>
            <HeartDivider color={colors.primary} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-4">
              {photos.map((url, i) => (
                <button key={i} type="button" onClick={() => setLightboxImg(url)}
                  className="aspect-square rounded-2xl overflow-hidden cursor-zoom-in block"
                  style={{ border: `2px solid ${colors.primary}55`, boxShadow: `0 4px 16px ${colors.primary}33` }}
                  aria-label={`Lihat foto ${i + 1}`}>
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* SECTION 6: LOVE STORY */}
      {storyTimeline && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.secondary }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: colors.accent }}>Our Love Story</p>
            <HeartDivider color={colors.primary} />
            <div className="max-w-md mx-auto mt-6">
              {storyTimeline.map((item, idx) => (
                <div key={idx} className="flex gap-4 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    {/* Pink heart as numbered indicator */}
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 relative"
                      style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 4px ${colors.primary}33` }}>
                      <span className="text-sm">♥</span>
                      <span className="absolute text-[9px] font-bold" style={{ color: colors.accent }}>{idx + 1}</span>
                    </div>
                    {idx < storyTimeline.length - 1 && (
                      <div className="flex-1 w-px mt-2" style={{ borderLeft: `2px dotted ${colors.primary}66`, minHeight: '32px' }} />
                    )}
                  </div>
                  <div className="pt-1 pb-4 text-left flex-1">
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.primary }}>{item.title}</p>
                    {item.date && <p className="text-xs opacity-50 mb-2">{item.date}</p>}
                    <p className="text-sm italic opacity-80 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* SECTION 7: GIFT */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.primary + '18' }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: colors.accent }}>Wedding Gift</p>
          <HeartDivider color={colors.primary} />
          <p className="text-sm opacity-70 max-w-xs mx-auto leading-relaxed mb-8">
            Doa restu Anda adalah hadiah terbesar bagi kami.
          </p>
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {[
              { bank: 'Bank BCA', no: '1234567890', name: invitation.partner_name, key: 'bca' },
              { bank: 'Bank Mandiri', no: '0987654321', name: invitation.partner_name2, key: 'mandiri' },
            ].map((item) => (
              <div key={item.key} className="p-6 rounded-[1.5rem] text-left backdrop-blur-sm"
                style={{ backgroundColor: colors.secondary + 'dd', border: `1.5px solid ${colors.primary}55`, boxShadow: `0 8px 32px ${colors.primary}22` }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: colors.primary }}>{item.bank}</p>
                <p className="text-xl font-bold mb-1" style={{ color: colors.accent }}>{item.no}</p>
                <p className="text-xs mb-4 opacity-60">a.n. {item.name}</p>
                <button type="button" onClick={() => handleCopy(item.no, item.key)}
                  className="w-full rounded-2xl text-sm font-semibold transition-all active:scale-95"
                  style={{ minHeight: '44px', ...(copied === item.key ? { backgroundColor: colors.primary, color: '#fff' } : { border: `1.5px solid ${colors.primary}`, color: colors.accent }) }}>
                  {copied === item.key ? '♥ Tersalin!' : 'Copy Rekening'}
                </button>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 8: WISHES */}
      <section id="section-wishes" className="py-20 px-6" style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.35em] text-center mb-2" style={{ color: colors.accent }}>Wishes &amp; RSVP</p>
          <HeartDivider color={colors.primary} />
          <RsvpSection guests={guests} onSubmit={onRsvpSubmit} rsvpStatus={rsvpStatus} rsvpError={rsvpError}
            primaryColor={colors.primary} accentColor={colors.accent} bgColor={colors.secondary} />
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${colors.primary}cc 0%, ${colors.accent}cc 100%)` }}>
        {/* Floating hearts */}
        <span className="absolute top-6 left-8 text-3xl opacity-20 text-white" style={{ animation: 'floatHeart 4s ease-in-out infinite' }}>♥</span>
        <span className="absolute top-10 right-10 text-5xl opacity-15 text-white" style={{ animation: 'floatHeart 5s ease-in-out 1s infinite' }}>♥</span>
        <span className="absolute bottom-8 left-16 text-2xl opacity-20 text-white" style={{ animation: 'floatHeart 6s ease-in-out 2s infinite' }}>♥</span>
        <span className="absolute bottom-6 right-8 text-4xl opacity-15 text-white" style={{ animation: 'floatHeart 4.5s ease-in-out 0.5s infinite' }}>♥</span>

        <ScrollReveal>
          <p className="text-white/70 text-xs uppercase tracking-widest mb-4">~ With Love ~</p>
          <p className="text-5xl text-white mb-2" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {invitation.partner_name}
          </p>
          <p className="text-3xl text-white/80 mb-2" style={{ fontFamily: '"Great Vibes", cursive' }}>♥</p>
          <p className="text-5xl text-white mb-6" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {invitation.partner_name2}
          </p>
          <p className="text-white/70 text-sm max-w-xs mx-auto leading-relaxed mb-4">
            Terima kasih atas doa dan restu Anda
          </p>
          <p className="text-white/40 text-xs mt-6">© Made with Love ♥</p>
        </ScrollReveal>
      </footer>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-3 backdrop-blur-md"
        style={{ backgroundColor: colors.primary + 'cc', borderTop: `1px solid ${colors.primary}66`, boxShadow: `0 -4px 20px ${colors.primary}44` }}>
        {navItems.map((item) => (
          <button key={item.id} type="button" onClick={() => scrollTo(item.id)}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all hover:scale-110 active:scale-95"
            aria-label={item.label}>
            <span className="text-xl">{item.icon}</span>
          </button>
        ))}
      </nav>

      {/* MUSIC BUTTON */}
      {invitation.music_url && (
        <button type="button" onClick={toggleMusic}
          className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: colors.primary, color: '#fff', boxShadow: `0 4px 16px ${colors.primary}88` }}
          aria-label={musicPlaying ? 'Pause music' : 'Play music'}>
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
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} onClick={() => setLightboxImg(null)} aria-label="Tutup">×</button>
        </div>
      )}

      {/* TOAST */}
      {copied && (
        <div className="fixed bottom-40 left-1/2 z-[60] px-5 py-3 rounded-full text-sm text-white shadow-xl pointer-events-none"
          style={{ backgroundColor: colors.accent, transform: 'translateX(-50%)' }}>
          ♥ Nomor rekening disalin!
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatHeart { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes sparkle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.2); } }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
