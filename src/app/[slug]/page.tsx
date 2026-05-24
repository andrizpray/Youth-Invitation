'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { InvitationData, GuestData, RsvpForm } from '@/components/templates/types';
import RsvpSection from '@/components/templates/RsvpSection';

type RsvpStatus = 'idle' | 'submitting' | 'success' | 'error';

// ─── PlaceholderTemplate ────────────────────────────────────────────────────

interface PlaceholderTemplateProps {
  invitation: InvitationData;
  guests: GuestData[];
  onRsvpSubmit: (form: RsvpForm) => Promise<void>;
  rsvpStatus: RsvpStatus;
  rsvpError: string;
}

function PlaceholderTemplate({
  invitation,
  guests,
  onRsvpSubmit,
  rsvpStatus,
  rsvpError,
}: PlaceholderTemplateProps) {
  const colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };

  let photos: string[] = [];
  try { photos = JSON.parse(invitation.gallery_photos) as string[]; } catch { /* empty */ }

  // Story: may be plain text or JSON array of { year, title, description }
  type StoryItem = { year?: string; title?: string; description?: string };
  let storyItems: StoryItem[] = [];
  let storyText = '';
  try {
    const parsed = JSON.parse(invitation.story);
    if (Array.isArray(parsed)) storyItems = parsed as StoryItem[];
    else storyText = invitation.story;
  } catch { storyText = invitation.story; }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch { return dateStr; }
  };

  return (
    <div className="font-sans" style={{ backgroundColor: colors.accent + '08' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-serif-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Lato', sans-serif; }
      `}</style>

      {/* ── Hero ── */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${colors.accent} 0%, ${colors.accent}cc 50%, ${colors.primary}33 100%)` }}
      >
        {/* Decorative rings */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, ${colors.primary}22 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, ${colors.secondary}22 0%, transparent 50%)`,
          }}
        />

        <p className="font-body text-white/50 text-xs uppercase tracking-[0.5em] mb-8">
          Undangan Pernikahan
        </p>

        <h1 className="font-script text-6xl md:text-8xl text-white drop-shadow-lg mb-2">
          {invitation.partner_name}
        </h1>
        <p className="font-script text-4xl my-2" style={{ color: colors.primary }}>
          &amp;
        </p>
        <h1 className="font-script text-6xl md:text-8xl text-white drop-shadow-lg mb-10">
          {invitation.partner_name2}
        </h1>

        {(invitation.parent_name || invitation.parent_name2) && (
          <div className="mb-8 text-white/60 font-body text-sm space-y-1">
            {invitation.parent_name && <p>Putra/i dari {invitation.parent_name}</p>}
            {invitation.parent_name2 && <p>Putra/i dari {invitation.parent_name2}</p>}
          </div>
        )}

        {invitation.date_resepsi && (
          <div
            className="px-6 py-3 rounded-full font-body text-sm font-light tracking-widest"
            style={{ backgroundColor: colors.primary + '22', color: '#fff', border: `1px solid ${colors.primary}44` }}
          >
            {formatDate(invitation.date_resepsi)}
          </div>
        )}

        <div className="absolute bottom-8 animate-bounce text-white/40">
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Quote ── */}
      {invitation.quote && (
        <section className="py-20 px-8 text-center max-w-2xl mx-auto">
          <div className="font-script text-6xl mb-4" style={{ color: colors.primary, opacity: 0.4 }}>"</div>
          <p
            className="font-serif-display italic text-xl md:text-2xl leading-relaxed"
            style={{ color: colors.accent }}
          >
            {invitation.quote}
          </p>
          <div className="w-16 h-px mx-auto mt-8" style={{ backgroundColor: colors.primary + '66' }} />
        </section>
      )}

      {/* ── Event Details ── */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.primary + '08' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body text-xs uppercase tracking-[0.4em] mb-2" style={{ color: colors.primary }}>
            Hari Bahagia
          </p>
          <h2
            className="font-serif-display text-3xl md:text-4xl mb-12"
            style={{ color: colors.accent }}
          >
            Detail Acara
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Akad */}
            {(invitation.date_akad || invitation.time_akad) && (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ backgroundColor: colors.accent + '08', border: `1px solid ${colors.primary}22` }}
              >
                <div className="font-body text-xs uppercase tracking-[0.4em] mb-3" style={{ color: colors.primary }}>
                  Akad Nikah
                </div>
                {invitation.date_akad && (
                  <p className="font-serif-display text-lg mb-2" style={{ color: colors.accent }}>
                    {formatDate(invitation.date_akad)}
                  </p>
                )}
                {invitation.time_akad && (
                  <p className="font-body text-2xl font-bold mb-4" style={{ color: colors.primary }}>
                    {invitation.time_akad}
                  </p>
                )}
              </div>
            )}

            {/* Resepsi */}
            {(invitation.date_resepsi || invitation.time_resepsi) && (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ backgroundColor: colors.accent + '08', border: `1px solid ${colors.primary}22` }}
              >
                <div className="font-body text-xs uppercase tracking-[0.4em] mb-3" style={{ color: colors.primary }}>
                  Resepsi
                </div>
                {invitation.date_resepsi && (
                  <p className="font-serif-display text-lg mb-2" style={{ color: colors.accent }}>
                    {formatDate(invitation.date_resepsi)}
                  </p>
                )}
                {invitation.time_resepsi && (
                  <p className="font-body text-2xl font-bold mb-4" style={{ color: colors.primary }}>
                    {invitation.time_resepsi}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          {(invitation.location || invitation.address) && (
            <div className="mt-8">
              <div className="font-body text-xs uppercase tracking-[0.4em] mb-3" style={{ color: colors.primary }}>
                Lokasi
              </div>
              {invitation.location && (
                <p className="font-serif-display text-xl mb-1" style={{ color: colors.accent }}>
                  {invitation.location}
                </p>
              )}
              {invitation.address && (
                <p className="font-body text-sm text-gray-500 mb-4 max-w-md mx-auto leading-relaxed">
                  {invitation.address}
                </p>
              )}
              {invitation.maps_url && (
                <a
                  href={invitation.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-sm font-medium transition-all hover:opacity-80"
                  style={{ backgroundColor: colors.primary, color: '#fff' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Lihat di Maps
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Story ── */}
      {(storyItems.length > 0 || storyText) && (
        <section className="py-20 px-6 max-w-2xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.4em] mb-2 text-center" style={{ color: colors.primary }}>
            Kisah Cinta
          </p>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-12 text-center" style={{ color: colors.accent }}>
            Perjalanan Kami
          </h2>

          {storyItems.length > 0 ? (
            <div className="space-y-8 relative">
              {/* Timeline line */}
              <div
                className="absolute left-6 top-0 bottom-0 w-px"
                style={{ backgroundColor: colors.primary + '33' }}
              />
              {storyItems.map((item, i) => (
                <div key={i} className="flex gap-6 pl-16 relative">
                  <div
                    className="absolute left-4 top-1 w-4 h-4 rounded-full border-2 flex-shrink-0"
                    style={{ backgroundColor: colors.accent + 'f0', borderColor: colors.primary }}
                  />
                  <div>
                    {item.year && (
                      <span
                        className="font-body text-xs font-bold uppercase tracking-widest mb-1 block"
                        style={{ color: colors.primary }}
                      >
                        {item.year}
                      </span>
                    )}
                    {item.title && (
                      <h3 className="font-serif-display text-lg mb-1" style={{ color: colors.accent }}>
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="font-body text-sm text-gray-500 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-gray-600 leading-relaxed text-center italic">{storyText}</p>
          )}
        </section>
      )}

      {/* ── Gallery ── */}
      {photos.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: colors.primary + '06' }}>
          <div className="max-w-4xl mx-auto">
            <p className="font-body text-xs uppercase tracking-[0.4em] mb-2 text-center" style={{ color: colors.primary }}>
              Momen Indah
            </p>
            <h2 className="font-serif-display text-3xl md:text-4xl mb-12 text-center" style={{ color: colors.accent }}>
              Galeri Foto
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map((url, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 md:col-span-2 row-span-2' : ''}`}
                  style={{ aspectRatio: i === 0 ? '4/3' : '1/1' }}
                >
                  <img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RSVP ── */}
      <section className="py-20 px-6">
        <div className="max-w-sm mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.4em] mb-2 text-center" style={{ color: colors.primary }}>
            Konfirmasi Kehadiran
          </p>
          <h2 className="font-serif-display text-3xl mb-4 text-center" style={{ color: colors.accent }}>
            RSVP
          </h2>
          <p className="font-body text-sm text-gray-500 text-center mb-10 leading-relaxed">
            Mohon konfirmasi kehadiran Anda sebelum hari H agar kami dapat mempersiapkan segalanya dengan baik.
          </p>
          <RsvpSection
            guests={guests}
            onSubmit={onRsvpSubmit}
            rsvpStatus={rsvpStatus}
            rsvpError={rsvpError}
            primaryColor={colors.primary}
            accentColor={colors.accent}
            bgColor="#ffffff"
          />
        </div>
      </section>

      {/* ── Guest Attendance Count ── */}
      {guests.length > 0 && (
        <section className="py-12 px-6" style={{ backgroundColor: colors.primary + '08' }}>
          <div className="max-w-sm mx-auto text-center">
            <p className="font-body text-xs uppercase tracking-[0.4em] mb-6" style={{ color: colors.primary }}>
              Tamu yang Hadir
            </p>
            <div className="flex justify-center gap-8">
              <div>
                <p className="font-serif-display text-4xl font-bold" style={{ color: colors.primary }}>
                  {guests.filter(g => g.is_attending).length}
                </p>
                <p className="font-body text-xs text-gray-500 mt-1">Hadir</p>
              </div>
              <div className="w-px" style={{ backgroundColor: colors.primary + '33' }} />
              <div>
                <p className="font-serif-display text-4xl font-bold" style={{ color: colors.accent }}>
                  {guests.filter(g => g.is_attending).reduce((s, g) => s + (g.guest_count || 1), 0)}
                </p>
                <p className="font-body text-xs text-gray-500 mt-1">Total Tamu</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer
        className="py-16 text-center px-6"
        style={{ background: `linear-gradient(160deg, ${colors.accent} 0%, ${colors.primary}33 100%)` }}
      >
        <p className="font-body text-white/40 text-xs uppercase tracking-[0.4em] mb-4">
          Dengan Penuh Cinta
        </p>
        <h2 className="font-script text-5xl text-white mb-2">{invitation.partner_name}</h2>
        <p className="font-script text-3xl my-1" style={{ color: colors.primary }}>&amp;</p>
        <h2 className="font-script text-5xl text-white">{invitation.partner_name2}</h2>
        <div className="w-16 h-px mx-auto mt-8 mb-6" style={{ backgroundColor: colors.primary + '66' }} />
        <p className="font-body text-white/30 text-xs">
          {invitation.title}
        </p>
      </footer>
    </div>
  );
}

// ─── TemplateRenderer ────────────────────────────────────────────────────────

function TemplateRenderer({
  invitation,
  guests,
  onRsvpSubmit,
  rsvpStatus,
  rsvpError,
}: {
  invitation: InvitationData;
  guests: GuestData[];
  onRsvpSubmit: (form: RsvpForm) => Promise<void>;
  rsvpStatus: RsvpStatus;
  rsvpError: string;
}) {
  const props = { invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError };
  return <PlaceholderTemplate {...props} />;
}

// ─── OpeningScreen ───────────────────────────────────────────────────────────

function OpeningScreen({
  invitation,
  guestName,
  onOpen,
}: {
  invitation: InvitationData;
  guestName: string | null;
  onOpen: () => void;
}) {
  const colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  const [pressed, setPressed] = useState(false);

  const handleOpen = () => {
    setPressed(true);
    setTimeout(onOpen, 600);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 text-center transition-opacity duration-500 ${pressed ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accent}dd 60%, ${colors.primary}44 100%)` }}
    >
      {/* Envelope icon */}
      <div className="text-7xl mb-8 animate-bounce">💌</div>

      <p className="text-white/50 text-xs uppercase tracking-[0.4em] mb-6">Undangan Pernikahan</p>

      <h1
        className="text-5xl md:text-6xl text-white mb-3"
        style={{ fontFamily: '"Great Vibes", cursive' }}
      >
        {invitation.partner_name}
      </h1>
      <p
        className="text-3xl my-2"
        style={{ color: colors.primary, fontFamily: '"Great Vibes", cursive' }}
      >
        &amp;
      </p>
      <h1
        className="text-5xl md:text-6xl text-white mb-10"
        style={{ fontFamily: '"Great Vibes", cursive' }}
      >
        {invitation.partner_name2}
      </h1>

      {/* Guest name */}
      {guestName && (
        <div className="mb-6">
          <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-2">Kepada Yth.</p>
          <p className="text-2xl text-white font-medium" style={{ fontFamily: '"Great Vibes", cursive' }}>
            {guestName}
          </p>
        </div>
      )}

      <p className="text-white/50 text-sm mb-10 max-w-xs leading-relaxed">
        Kami mengundang kehadiran Bapak/Ibu/Saudara/i
      </p>

      <button
        onClick={handleOpen}
        className="px-8 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-all active:scale-95"
        style={{ backgroundColor: colors.primary, color: colors.accent }}
      >
        Buka Undangan
      </button>

      <p className="text-white/30 text-xs mt-6">Ketuk untuk membuka</p>
    </div>
  );
}

// ─── InvitationPage (main export) ────────────────────────────────────────────

export default function InvitationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [templateSlug, setTemplateSlug] = useState('classic-gold');
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>('idle');
  const [rsvpError, setRsvpError] = useState('');

  useEffect(() => {
    const slug = params.slug as string;
    fetch(`/api/invites/${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setInvitation(data.invitation);
        setTemplateSlug(data.template?.slug || 'classic-gold');
      })
      .catch(() => setInvitation(null))
      .finally(() => setLoading(false));
  }, [params.slug]);

  // Load guest name from query param
  useEffect(() => {
    const tamuCode = searchParams.get('tamu');
    if (!tamuCode) return;

    const slug = params.slug as string;
    fetch(`/api/guests/by-code/${slug}/${tamuCode}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setGuestName(data.guest?.name || null);
        }
      })
      .catch(() => setGuestName(null));
  }, [searchParams, params.slug]);

  const loadGuests = async () => {
    if (!invitation) return;
    const res = await fetch(`/api/rsvp/${invitation.id}`);
    const data = await res.json();
    setGuests(data.guests || []);
  };

  useEffect(() => {
    if (invitation && opened) loadGuests();
  }, [invitation, opened]);

  const handleRsvpSubmit = async (form: RsvpForm) => {
    if (!invitation) return;
    setRsvpStatus('submitting');
    setRsvpError('');
    try {
      const res = await fetch(`/api/rsvp/${invitation.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setRsvpStatus('success');
        await loadGuests();
      } else {
        const data = await res.json();
        setRsvpError(data.error || 'Terjadi kesalahan');
        setRsvpStatus('error');
      }
    } catch {
      setRsvpError('Gagal mengirim, coba lagi.');
      setRsvpStatus('error');
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="text-2xl font-semibold mb-2">Undangan Tidak Ditemukan</h1>
          <p className="text-gray-400 text-sm">Link undangan mungkin sudah kadaluarsa atau tidak tersedia.</p>
        </div>
      </div>
    );
  }

  // Opening screen
  if (!opened) {
    return (
      <>
        {invitation.music_url && (
          <audio src={invitation.music_url} autoPlay loop className="hidden" />
        )}
        <OpeningScreen invitation={invitation} guestName={guestName} onOpen={() => setOpened(true)} />
      </>
    );
  }

  // Main invitation
  return (
    <>
      {invitation.music_url && (
        <audio src={invitation.music_url} autoPlay loop className="hidden" />
      )}
      <TemplateRenderer
        invitation={invitation}
        guests={guests}
        onRsvpSubmit={handleRsvpSubmit}
        rsvpStatus={rsvpStatus}
        rsvpError={rsvpError}
      />
    </>
  );
}
