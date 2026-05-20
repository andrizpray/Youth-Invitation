import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET - Get analytics for an invitation
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();

  // Verify ownership
  const invitation = db.prepare(
    'SELECT id, slug, partner_name, partner_name2, event_date FROM invitations WHERE id = ? AND user_id = ?'
  ).get(id, user.id);

  if (!invitation) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 });
  }

  // Get guest statistics
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total_guests,
      SUM(CASE WHEN is_attending = 1 THEN 1 ELSE 0 END) as attending,
      SUM(CASE WHEN is_attending = 0 THEN 1 ELSE 0 END) as not_attending,
      SUM(CASE WHEN is_attending = 0 AND message IS NULL THEN 1 ELSE 0 END) as pending,
      SUM(guest_count) as total_persons,
      SUM(CASE WHEN is_attending = 1 THEN guest_count ELSE 0 END) as attending_persons
    FROM guests
    WHERE invitation_id = ?
  `).get(id) as {
    total_guests: number;
    attending: number;
    not_attending: number;
    pending: number;
    total_persons: number;
    attending_persons: number;
  };

  // Get recent RSVPs (last 10)
  const recentRsvps = db.prepare(`
    SELECT name, is_attending, guest_count, message, created_at
    FROM guests
    WHERE invitation_id = ? AND message IS NOT NULL
    ORDER BY created_at DESC
    LIMIT 10
  `).all(id);

  // Get RSVP timeline (by date)
  const rsvpTimeline = db.prepare(`
    SELECT 
      date(created_at) as date,
      COUNT(*) as count,
      SUM(CASE WHEN is_attending = 1 THEN 1 ELSE 0 END) as attending
    FROM guests
    WHERE invitation_id = ? AND message IS NOT NULL
    GROUP BY date(created_at)
    ORDER BY date(created_at)
  `).all(id);

  return NextResponse.json({
    invitation,
    stats: {
      totalGuests: stats.total_guests || 0,
      attending: stats.attending || 0,
      notAttending: stats.not_attending || 0,
      pending: stats.pending || 0,
      totalPersons: stats.total_persons || 0,
      attendingPersons: stats.attending_persons || 0,
      attendanceRate: stats.total_guests > 0 
        ? Math.round((stats.attending / stats.total_guests) * 100) 
        : 0,
    },
    recentRsvps,
    rsvpTimeline,
  });
}
