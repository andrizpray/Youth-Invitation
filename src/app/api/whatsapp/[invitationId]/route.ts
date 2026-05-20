import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// Generate WhatsApp message for a guest
function generateWaMessage(invitation: any, guest: any, baseUrl: string): string {
  const guestLink = `${baseUrl}/${invitation.slug}?tamu=${guest.code}`;
  const partnerNames = `${invitation.partner_name} & ${invitation.partner_name2}`;
  
  let eventInfo = '';
  if (invitation.date_akad) {
    const akadDate = new Date(invitation.date_akad).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    eventInfo += `Akad: ${akadDate}`;
    if (invitation.time_akad) eventInfo += ` pukul ${invitation.time_akad}`;
  }
  if (invitation.date_resepsi) {
    const resepsiDate = new Date(invitation.date_resepsi).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (eventInfo) eventInfo += '\n';
    eventInfo += `Resepsi: ${resepsiDate}`;
    if (invitation.time_resepsi) eventInfo += ` pukul ${invitation.time_resepsi}`;
  }

  return `Bismillahirrahmanirrahim

Assalamualaikum Wr. Wb.

Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan:

${partnerNames}

${eventInfo}

${invitation.location ? `Lokasi: ${invitation.location}` : ''}

Kami mengundang Bapak/Ibu/Saudara/i *${guest.name}* untuk menghadiri acara pernikahan kami.

📖 Buka Undangan:
${guestLink}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.

Wassalamualaikum Wr. Wb.`;
}

// GET - Generate WA links for all guests with phone numbers
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { invitationId } = await params;
  const db = getDb();

  // Verify ownership
  const invitation = db.prepare(`
    SELECT id, slug, partner_name, partner_name2, date_akad, date_resepsi, 
           time_akad, time_resepsi, location
    FROM invitations WHERE id = ? AND user_id = ?
  `).get(invitationId, user.id) as any;

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  // Get all guests with phone numbers
  const guests = db.prepare(`
    SELECT id, name, phone, code
    FROM guests 
    WHERE invitation_id = ? AND phone IS NOT NULL AND phone != ''
    ORDER BY name
  `).all(invitationId) as any[];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://youthinvitation.com';

  const results = guests.map(guest => {
    const message = generateWaMessage(invitation, guest, baseUrl);
    let phone = guest.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '62' + phone.slice(1);
    if (!phone.startsWith('62')) phone = '62' + phone;

    return {
      id: guest.id,
      name: guest.name,
      phone: guest.phone,
      waLink: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    };
  });

  // Stats
  const totalGuests = db.prepare(
    'SELECT COUNT(*) as count FROM guests WHERE invitation_id = ?'
  ).get(invitationId) as { count: number };

  return NextResponse.json({
    success: true,
    invitation: {
      id: invitation.id,
      slug: invitation.slug,
      partner_name: invitation.partner_name,
      partner_name2: invitation.partner_name2,
    },
    stats: {
      total: totalGuests.count,
      withPhone: results.length,
      withoutPhone: totalGuests.count - results.length,
    },
    guests: results,
  });
}
