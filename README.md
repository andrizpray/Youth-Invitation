# Youth Invitation

Undangan pernikahan digital dengan fitur lengkap — template custom, RSVP online, manajemen tamu, dan notifikasi WhatsApp.

## Fitur

### Fase 1 ✅ — Auth & Dashboard
- Auth system (register, login, logout, JWT + cookie)
- 10 template undangan (Classic Gold, Romantic Blush, Islamic Green, dll)
- CRUD undangan dengan validasi slug + blacklist reserved paths
- Dashboard admin (buat, edit, publish, hapus undangan)
- RSVP system dengan ucapan tamu
- Public view undangan (`/[slug]`)

### Fase 2 ✅ — Template Visual
- 3 template visual proper:
  - **ClassicGold** — dark navy + gold, elegan klasik
  - **RomanticBlush** — soft pink + floral, romantis
  - **IslamicGreen** — hijau islami + ayat Al-Quran
- Countdown timer real-time ke hari H
- Opening screen dengan animasi
- Guest-specific view via query param (`?to=Nama`)

### Fase 3 ✅ — Manajemen Tamu
- Tambah tamu manual (nama, email, phone)
- Upload CSV untuk bulk import tamu
- Link personal per tamu dengan unique code
- Guest-specific undangan page (`/[slug]?tamu=CODE`)
- Copy link tamu ke clipboard

### Fase 4 ✅ — Dashboard Analytics
- Statistik kehadiran per undangan (total, hadir, tidak hadir, pending)
- Grafik distribusi RSVP (hadir vs tidak hadir vs pending)
- Timeline RSVP chart (per hari)
- Daftar RSVP terbaru
- Export CSV daftar tamu

### Fase 5 ✅ — Notifikasi WhatsApp
- Generate link WhatsApp personal per tamu
- Tombol kirim per tamu
- Kirim semua ke tamu yang belum dikirimi
- Filter tamu (semua / belum terkirim)
- Tracking status terkirim per tamu

### Fase 6 ✅ — Upload Media
- Upload foto ke galeri undangan (JPEG, PNG, WebP, GIF — max 10MB, max 10 foto)
- Upload musik latar (MP3, WAV, OGG, M4A — max 10MB)
- Preview foto & audio player inline di dashboard
- Tab Media di halaman edit undangan
- Drag & drop upload via komponen MediaUploader
- Validasi tipe file + ukuran

### Fase 7 ✅ — Polish & QA
- Error handling di semua halaman (try-catch, user feedback)
- Loading states & empty states
- Responsive grids mobile
- Inline error messages (bukan alert())
- Theme-aware RSVP section (pakai warna template)

### Roadmap
- [ ] Fase 8: Deploy prep (PM2, Nginx, domain pointing)

## Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** SQLite (better-sqlite3)
- **Auth:** JWT + bcrypt
- **Fonts:** Playfair Display, Great Vibes, Amiri, Cormorant Garamond, Inter

## Cara Menjalankan

### Development

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3001](http://localhost:3001)

### Production

```bash
# Build
npm run build

# Jalankan production
npm start -p 3001
```

### Setup Awal

1. Buka `/api/setup` untuk inisialisasi database
2. Buka `/api/seed` untuk mengisi template default (10 template)
3. Register akun baru di `/register`
4. Login dan mulai buat undangan

## Struktur Folder

```
src/
├── app/
│   ├── [slug]/                     # Public view undangan
│   ├── api/
│   │   ├── analytics/[id]/         # Statistik kehadiran
│   │   ├── auth/                   # Login, register, me
│   │   ├── gallery/[id]/           # Galeri foto CRUD
│   │   ├── guests/[invitationId]/  # Manajemen tamu CRUD + CSV
│   │   ├── guests/by-code/[slug]/[code]/  # Guest lookup by code
│   │   ├── invitations/            # CRUD undangan
│   │   ├── invitations/[id]/       # Single invitation
│   │   ├── invites/[slug]/         # Public API undangan
│   │   ├── rsvp/[invitationId]/    # RSVP submission
│   │   ├── templates/              # List template
│   │   ├── upload/                 # Upload foto & musik
│   │   ├── whatsapp/[invitationId]/  # WhatsApp link generator
│   │   ├── seed/                   # Seed template
│   │   └── setup/                  # Setup database
│   └── dashboard/
│       ├── invitations/
│       │   ├── [id]/               # Edit undangan (konten, design, media, RSVP, publikasi)
│       │   │   ├── analytics/      # Dashboard statistik
│       │   │   ├── guests/         # Manajemen tamu
│       │   │   └── whatsapp/       # Kirim WhatsApp
│       │   └── new/                # Buat undangan baru
│       └── page.tsx                # Dashboard home
├── components/
│   └── templates/
│       ├── ClassicGold.tsx
│       ├── RomanticBlush.tsx
│       ├── IslamicGreen.tsx
│       ├── Countdown.tsx
│       ├── RsvpSection.tsx
│       └── types.ts
└── lib/
    ├── auth.ts           # Auth helper
    ├── db.ts             # Database connection
    ├── seed.ts           # Template data
    └── types.ts          # TypeScript types
```

## API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/auth/register` | POST | Register user baru |
| `/api/auth/login` | POST | Login (return JWT cookie) |
| `/api/auth/me` | GET | Info user saat ini |
| `/api/templates` | GET | List semua template |
| `/api/invitations` | GET/POST | List / buat undangan |
| `/api/invitations/[id]` | GET/PATCH/DELETE | Detail / edit / hapus undangan |
| `/api/invites/[slug]` | GET | Public data undangan |
| `/api/guests/[invitationId]` | GET/POST/DELETE/PATCH | CRUD tamu + bulk CSV |
| `/api/guests/by-code/[slug]/[code]` | GET | Cari tamu by code |
| `/api/rsvp/[invitationId]` | POST | Submit RSVP |
| `/api/analytics/[id]` | GET | Statistik kehadiran |
| `/api/whatsapp/[invitationId]` | GET | Generate WA link per tamu |
| `/api/whatsapp/[invitationId]/[guestId]` | GET | Generate WA link spesifik |
| `/api/upload` | POST | Upload foto/musik |
| `/api/gallery/[id]` | GET/POST/PATCH/DELETE | CRUD galeri foto |
| `/api/setup` | POST | Inisialisasi database |
| `/api/seed` | GET | Seed 10 template default |

## Default Login

Setelah register, user pertama bisa jadi admin manual di database.

## License

MIT
