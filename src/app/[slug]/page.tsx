'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { InvitationData, GuestData, RsvpForm } from '@/components/templates/types';
import ClassicGold from '@/components/templates/ClassicGold';
import RomanticBlush from '@/components/templates/RomanticBlush';
import IslamicGreen from '@/components/templates/IslamicGreen';

type RsvpStatus = 'idle' | 'submitting' | 'success' | 'error';

function OpeningScreen({
  invitation,
  onOpen,
}: {
  invitation: InvitationData;
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

function TemplateRenderer({
  templateSlug,
  invitation,
  guests,
  onRsvpSubmit,
  rsvpStatus,
  rsvpError,
}: {
  templateSlug: string;
  invitation: InvitationData;
  guests: GuestData[];
  onRsvpSubmit: (form: RsvpForm) => Promise<void>;
  rsvpStatus: RsvpStatus;
  rsvpError: string;
}) {
  const props = { invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError };

  // Route to template by slug
  if (templateSlug === 'romantic-blush' || templateSlug === 'sakura-pink') {
    return <RomanticBlush {...props} />;
  }
  if (templateSlug === 'islamic-green') {
    return <IslamicGreen {...props} />;
  }
  // Default: classic-gold and everything else
  return <ClassicGold {...props} />;
}

export default function InvitationPage() {
  const params = useParams();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [templateSlug, setTemplateSlug] = useState('classic-gold');
  const [guests, setGuests] = useState<GuestData[]>([]);
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
        <OpeningScreen invitation={invitation} onOpen={() => setOpened(true)} />
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
        templateSlug={templateSlug}
        invitation={invitation}
        guests={guests}
        onRsvpSubmit={handleRsvpSubmit}
        rsvpStatus={rsvpStatus}
        rsvpError={rsvpError}
      />
    </>
  );
}
