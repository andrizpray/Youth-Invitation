'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Feature icons (Heroicons outline)
const FeatureIcons: Record<string, () => React.ReactElement> = {
  paint: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  device: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  chart: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  bell: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  music: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  globe: () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
};

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const features = [
  { iconKey: 'paint', title: 'Full Custom', desc: 'Atur warna, font, layout sesuai selera. Setiap undangan bisa tampil beda.' },
  { iconKey: 'device', title: 'Mobile Friendly', desc: 'Tampilan optimal di HP. Tamu bisa buka undangan dari mana saja.' },
  { iconKey: 'chart', title: 'RSVP Online', desc: 'Pantau konfirmasi tamu secara real-time dengan statistik lengkap.' },
  { iconKey: 'bell', title: 'Notifikasi Otomatis', desc: 'Dapatkan notifikasi WhatsApp & Email setiap ada tamu yang RSVP.' },
  { iconKey: 'music', title: 'Musik Latar', desc: 'Tambahkan lagu favorit untuk menemani tamu melihat undangan.' },
  { iconKey: 'globe', title: 'Custom Domain', desc: 'Gunakan domain sendiri untuk tampilan yang lebih profesional.' },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}
        aria-label="Navigasi utama"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className={`text-2xl font-serif transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
            Youth Invitation
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 ${scrolled ? 'text-slate-700 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-150 shadow-lg shadow-green-500/25"
            >
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Undangan Digital
          </h1>
          <p className="text-2xl md:text-3xl font-serif text-green-300 mb-4 italic">
            Untuk Momen Spesialmu
          </p>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Buat undangan pernikahan digital yang elegan dengan 10 template premium.
            Fitur RSVP online, notifikasi WhatsApp &amp; Email, dan galeri foto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-lg transition-all duration-150 shadow-xl shadow-green-500/30"
            >
              Buat Undangan Sekarang
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border border-white/30 hover:border-white/60 hover:bg-white/5 text-white rounded-xl font-semibold text-lg transition-all duration-150"
            >
              Lihat Fitur
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-slate-900 mb-4">Kenapa Youth Invitation?</h2>
          <p className="text-slate-500 text-center mb-16 max-w-xl mx-auto">
            Platform undangan digital terlengkap untuk hari spesialmu
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = FeatureIcons[f.iconKey];
              return (
                <div
                  key={f.iconKey}
                  className="p-6 rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="text-green-500 mb-4">
                    <Icon />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-slate-900 mb-4">Pilih Paket</h2>
          <p className="text-slate-500 text-center mb-16">Satu kali bayar, undangan aktif sampai H+3</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Basic */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-all duration-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Basic</h3>
              <p className="text-4xl font-bold text-green-500 mb-6">
                Rp150<span className="text-lg text-slate-400 font-normal">.000</span>
              </p>
              <ul className="space-y-3 text-slate-600">
                {[
                  '10 template premium',
                  'Subdomain youthinvitation.com',
                  'Full custom warna & font',
                  'RSVP online + statistik',
                  'Notifikasi WA & Email',
                  'Musik latar',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-slate-400">
                  <WarningIcon />
                  Watermark Youth Invitation
                </li>
              </ul>
              <Link
                href="/register"
                className="mt-8 block w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-center transition-all duration-150"
              >
                Pilih Basic
              </Link>
            </div>

            {/* Premium */}
            <div className="p-8 rounded-2xl border-2 border-green-300 bg-white shadow-xl shadow-green-100 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                TERBAIK
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2 mt-2">Premium</h3>
              <p className="text-4xl font-bold text-green-500 mb-6">
                Rp450<span className="text-lg text-slate-400 font-normal">.000</span>
              </p>
              <ul className="space-y-3 text-slate-600">
                {[
                  'Semua fitur Basic',
                  'Tanpa watermark',
                  'Pakai domain sendiri',
                  'Full custom layout',
                  'Ekspor data RSVP (Excel/PDF)',
                  'Prioritas support',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-center transition-all duration-150"
              >
                Pilih Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif text-white mb-4">Siap Buat Undangan?</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Mulai sekarang dan bagikan momen bahagiamu dengan orang-orang terkasih.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-lg transition-all duration-150 shadow-xl shadow-green-500/30"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-950 text-center">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Youth Invitation. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
