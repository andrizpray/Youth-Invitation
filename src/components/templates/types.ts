export interface InvitationData {
  id: string;
  slug: string;
  title: string;
  partner_name: string;
  partner_name2: string;
  parent_name: string;
  parent_name2: string;
  date_akad: string | null;
  date_resepsi: string | null;
  time_akad: string | null;
  time_resepsi: string | null;
  location: string;
  address: string;
  maps_url: string | null;
  quote: string;
  story: string;
  gallery_photos: string; // JSON array
  music_url: string | null;
  colors: string; // JSON {primary, secondary, accent}
  font_family: string;
  language: string;
}

export interface GuestData {
  id: string;
  name: string;
  is_attending: number;
  guest_count: number;
  message: string | null;
  created_at: string;
}

export interface TemplateProps {
  invitation: InvitationData;
  guests: GuestData[];
  onRsvpSubmit: (form: RsvpForm) => Promise<void>;
  rsvpStatus: 'idle' | 'submitting' | 'success' | 'error';
  rsvpError: string;
}

export interface RsvpForm {
  name: string;
  is_attending: boolean;
  guest_count: number;
  message: string;
}
