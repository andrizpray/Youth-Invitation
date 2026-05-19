# Youth Invitation

Undangan pernikahan digital dengan fitur lengkap — template custom, RSVP online, dan manajemen tamu.

## Fitur

### Fase 1 ✅
- Auth system (register, login, JWT + cookie)
- 10 template undangan
- CRUD undangan dengan validasi slug
- Dashboard admin (buat, edit, publish, hapus)
- RSVP system dengan ucapan tamu
- Public view undangan (`/[slug]`)

### Fase 2 ✅
- 3 template visual proper:
  - **ClassicGold** — dark navy + gold, elegan klasik
  - **RomanticBlush** — soft pink + floral, romantis
  - **IslamicGreen** — hijau islami + ayat Al-Quran
- Countdown timer real-time
- Opening screen dengan animasi
- Validasi slug + blacklist reserved paths

### Roadmap
- [ ] Fase 3: Manajemen tamu (upload CSV, link personal)
- [ ] Fase 4: Dashboard analytics (grafik RSVP)
- [ ] Fase 5: Notifikasi WhatsApp
- [ ] Fase 6: Upload media (foto, musik)
- [ ] Fase 7: Payment & order management

## Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** SQLite (better-sqlite3)
- **Auth:** JWT + bcrypt
- **Fonts:** Playfair Display, Great Vibes, Amiri, Cormorant Garamond

## Cara Menjalankan

### Development

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Production

```bash
# Build
npm run build

# Jalankan production
npm start
```

### Setup Awal

1. Buka `/api/seed` untuk mengisi template default (10 template)
2. Buka `/api/setup` untuk inisialisasi database
3. Register akun baru di `/register`
4. Login dan mulai buat undangan

## Struktur Folder

```
src/
├── app/
│   ├── [slug]/           # Public view undangan
│   ├── api/              # API routes
│   │   ├── auth/         # Login, register, me
│   │   ├── invitations/  # CRUD undangan
│   │   ├── invites/      # Public API undangan
│   │   ├── rsvp/         # RSVP submission
│   │   ├── templates/    # List template
│   │   └── seed/         # Seed template
│   ├── dashboard/        # Dashboard admin
│   ├── login/            # Halaman login
│   └── register/         # Halaman register
├── components/
│   └── templates/        # Template components
│       ├── ClassicGold.tsx
│       ├── RomanticBlush.tsx
│       ├── IslamicGreen.tsx
│       ├── Countdown.tsx
│       └── RsvpSection.tsx
└── lib/
    ├── auth.ts           # Auth helper
    ├── db.ts             # Database connection
    ├── seed.ts           # Template data
    └── types.ts          # TypeScript types
```

## Default Login

Setelah register, user pertama bisa jadi admin manual di database.

## License

MIT
