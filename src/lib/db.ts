import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'youth-invitation.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      thumbnail TEXT DEFAULT '',
      category TEXT DEFAULT 'umum',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS template_configs (
      id TEXT PRIMARY KEY,
      template_id TEXT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      UNIQUE(template_id, key)
    );

    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL DEFAULT 'Undangan Pernikahan',
      template_id TEXT NOT NULL REFERENCES templates(id),
      package_type TEXT NOT NULL DEFAULT 'basic' CHECK(package_type IN ('basic', 'premium')),
      partner_name TEXT NOT NULL DEFAULT '',
      partner_name2 TEXT NOT NULL DEFAULT '',
      parent_name TEXT DEFAULT '',
      parent_name2 TEXT DEFAULT '',
      date_akad TEXT,
      date_resepsi TEXT,
      time_akad TEXT,
      time_resepsi TEXT,
      location TEXT DEFAULT '',
      address TEXT DEFAULT '',
      maps_url TEXT,
      quote TEXT DEFAULT '',
      story TEXT DEFAULT '',
      gallery_photos TEXT DEFAULT '[]',
      music_url TEXT,
      custom_domain TEXT,
      colors TEXT NOT NULL DEFAULT '{"primary":"#d4af37","secondary":"#ffffff","accent":"#1a1a2e"}',
      font_family TEXT NOT NULL DEFAULT 'serif',
      layout_style TEXT NOT NULL DEFAULT 'classic',
      watermark INTEGER NOT NULL DEFAULT 1,
      published INTEGER NOT NULL DEFAULT 0,
      event_date TEXT,
      language TEXT NOT NULL DEFAULT 'id' CHECK(language IN ('id', 'en')),
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'expired')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS guests (
      id TEXT PRIMARY KEY,
      invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      code TEXT UNIQUE,
      is_attending INTEGER NOT NULL DEFAULT 0,
      guest_count INTEGER NOT NULL DEFAULT 1,
      message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      invitation_id TEXT REFERENCES invitations(id) ON DELETE SET NULL,
      package_type TEXT NOT NULL CHECK(package_type IN ('basic', 'premium')),
      amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'confirmed', 'cancelled')),
      payment_method TEXT NOT NULL DEFAULT 'manual' CHECK(payment_method IN ('manual', 'midtrans')),
      midtrans_order_id TEXT,
      midtrans_transaction_id TEXT,
      admin_notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      paid_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_invitations_user ON invitations(user_id);
    CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);
    CREATE INDEX IF NOT EXISTS idx_guests_invitation ON guests(invitation_id);
    CREATE INDEX IF NOT EXISTS idx_guests_code ON guests(code);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_invitation ON orders(invitation_id);
  `);
}
