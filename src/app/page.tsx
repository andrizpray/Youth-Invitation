'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className={`text-2xl font-cursive transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
            Youth Invitation
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className={`px-4 py-2 rounded-lg font-medium transition-all ${scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/80 hover:text-white'}`}>
              Masuk
            </Link>
            <Link href="/register" className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-amber-500/25">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-cursive text-white mb-6">
            Undangan Digital
          </h1>
          <p className="text-2xl md:text-3xl font-serif text-amber-300 mb-4 italic">
            Untuk Momen Spesialmu
          </p>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Buat undangan pernikahan digital yang elegan dengan 10 template premium.
            Fitur RSVP online, notifikasi WhatsApp & Email, dan galeri foto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-lg transition-all shadow-xl shadow-amber-500/30">
              Buat Undangan Sekarang
            </Link>
            <Link href="#features" className="px-8 py-4 border border-white/30 hover:border-white/50 text-white rounded-xl font-semibold text-lg transition-all">
              Lihat Fitur
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-gray-900 mb-4">Kenapa Youth Invitation?</h2>
          <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
            Platform undangan digital terlengkap untuk hari spesialmu
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎨', title: 'Full Custom', desc: 'Atur warna, font, layout sesuai selera. Setiap undangan bisa tampil beda.' },
              { icon: '📱', title: 'Mobile Friendly', desc: 'Tampilan optimal di HP. Tamu bisa buka undangan dari mana saja.' },
              { icon: '📊', title: 'RSVP Online', desc: 'Pantau konfirmasi tamu secara real-time dengan statistik lengkap.' },
              { icon: '🔔', title: 'Notifikasi Otomatis', desc: 'Dapatkan notifikasi WhatsApp & Email setiap ada tamu yang RSVP.' },
              { icon: '🎵', title: 'Musik Latar', desc: 'Tambahkan lagu favorit untuk menemani tamu melihat undangan.' },
              { icon: '🌐', title: 'Custom Domain', desc: 'Gunakan domain sendiri untuk tampilan yang lebih profesional.' },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-gray-900 mb-4">Pilih Paket</h2>
          <p className="text-gray-500 text-center mb-16">Satu kali bayar, undangan aktif sampai H+3</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="p-8 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold mb-2">Basic</h3>
              <p className="text-4xl font-bold text-amber-500 mb-6">Rp150<span className="text-lg text-gray-400 font-normal">.000</span></p>
              <ul className="space-y-3 text-gray-600">
                <li>✅ 10 template premium</li>
                <li>✅ Subdomain youthinvitation.com</li>
                <li>✅ Full custom warna & font</li>
                <li>✅ RSVP online + statistik</li>
                <li>✅ Notifikasi WA & Email</li>
                <li>✅ Musik latar</li>
                <li className="text-gray-400">⚠️ Watermark Youth Invitation</li>
              </ul>
              <Link href="/register" className="mt-8 block w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-center transition-all">
                Pilih Basic
              </Link>
            </div>

            <div className="p-8 rounded-2xl border-2 border-amber-300 bg-white shadow-xl shadow-amber-100 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                TERBAIK
              </div>
              <h3 className="text-xl font-semibold mb-2 mt-2">Premium</h3>
              <p className="text-4xl font-bold text-amber-500 mb-6">Rp450<span className="text-lg text-gray-400 font-normal">.000</span></p>
              <ul className="space-y-3 text-gray-600">
                <li>✅ Semua fitur Basic</li>
                <li>✅ Tanpa watermark</li>
                <li>✅ Pakai domain sendiri</li>
                <li>✅ Full custom layout</li>
                <li>✅ Ekspor data RSVP (Excel/PDF)</li>
                <li>✅ Prioritas support</li>
              </ul>
              <Link href="/register" className="mt-8 block w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-center transition-all">
                Pilih Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-cursive text-white mb-4">Siap Buat Undangan?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Mulai sekarang dan bagikan momen bahagiamu dengan orang-orang terkasih.
          </p>
          <Link href="/register" className="inline-block px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-lg transition-all shadow-xl shadow-amber-500/30">
            Mulai Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-950 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Youth Invitation. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
