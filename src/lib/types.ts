export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Invitation {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  template_id: string;
  package_type: 'basic' | 'premium';
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
  custom_domain: string | null;
  colors: string; // JSON {primary, secondary, accent}
  font_family: string;
  layout_style: string;
  watermark: number; // 0 or 1
  published: number;
  status: 'draft' | 'active' | 'expired';
  created_at: string;
  updated_at: string;
  event_date: string;
  language: 'id' | 'en';
}

export interface Guest {
  id: string;
  invitation_id: string;
  name: string;
  phone: string | null;
  is_attending: number;
  guest_count: number;
  message: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  invitation_id: string | null;
  package_type: 'basic' | 'premium';
  amount: number;
  status: 'pending' | 'paid' | 'confirmed' | 'cancelled';
  payment_method: 'manual' | 'midtrans';
  midtrans_order_id: string | null;
  midtrans_transaction_id: string | null;
  admin_notes: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  is_active: number;
  created_at: string;
}

export interface TemplateConfig {
  id: string;
  template_id: string;
  key: string;
  value: string;
}
