'use client';

import { useState } from 'react';
import Countdown from './Countdown';
import RsvpSection from './RsvpSection';
import ScrollReveal from './ScrollReveal';
import ScrollToTop from './ScrollToTop';
import { TemplateProps } from './types';

export default function ClassicGold({ invitation, guests, onRsvpSubmit, rsvpStatus, rsvpError }: TemplateProps) {
  let colors: { primary: string; secondary: string; accent: string };
  try {
    colors = JSON.parse(invitation.colors) as { primary: string; secondary: string; accent: string };
  } catch {
    colors = { primary: '#c9a84c', secondary: '#fffdf5', accent: '#7c6124' };
  }
  let photos: string[];
  try {
    photos = JSON.parse(invitation.gallery_photos || '[]') as string[];
  } catch {
    photos = [];
  }

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const targetDate = invitation.date_akad || invitation.date_resepsi;
  const sectionClass = 'min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center';
  const dividerStyle = { backgroundColor: colors.primary };

  return (
    <div style={{ fontFamily: '"Playfair Display", serif', color: colors.accent, backgroundColor: colors.secondary }}>

      {/* Cover */}
      <section
        className={sectionClass}
        style={{ background: `linear-gradient(160deg, ${colors.accent} 0%, ${colors.accent}dd 60%, ${colors.primary}33 100%)` }}
      >
        <p className="text-white/80 text-xs uppercase tracking-[0.3em] mb-6">Bismillahirrahmanirrahim</p>
        <p className="text-white/70 text-sm mb-10 max-w-xs leading-relaxed">
          {invitation.quote || 'Assalamualaikum Warahmatullahi Wabarakatuh'}
        </p>
        <p className="text-white/80 text-sm mb-2">Kami mengundang Bapak/Ibu/Saudara/i</p>
        <p className="text-white/80 text-sm mb-10">pada pernikahan kami</p>

        <h1
          className="text-5xl md:text-6xl text-white mb-3"
          style={{ fontFamily: '"Great Vibes", cursive' }}
        >
          {invitation.partner_name}
        </h1>
        <p className="text-3xl mb-3" style={{ color: colors.primary, fontFamily: '"Great Vibes", cursive' }}>&</p>
        <h1
          className="text-5xl md:text-6xl text-white mb-12"
          style={{ fontFamily: '"Great Vibes", cursive' }}
        >
          {invitation.partner_name2}
        </h1>

        {targetDate && (
          <Countdown targetDate={targetDate} primaryColor={colors.primary} accentColor="#ffffff99" />
        )}

        <div className="mt-16 animate-bounce text-white/60 text-xl" aria-hidden="true">↓</div>
      </section>

      {/* Mempelai */}
      {(invitation.parent_name || invitation.parent_name2) && (
        <section className={sectionClass} style={{ backgroundColor: colors.secondary }}>
          <ScrollReveal className="w-full">
            <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#6b6b80' }}>Putra-Putri dari</p>
            <div className="w-12 h-px mx-auto mb-8" style={dividerStyle} />
            <div className="space-y-6 max-w-sm mx-auto">
              {invitation.parent_name && (
                <div
                  className="p-6 rounded-2xl"
                  style={{ backgroundColor: colors.primary + '12', border: `1px solid ${colors.primary}33`, boxShadow: `0 4px 20px ${colors.primary}18` }}
                >
                  <p className="text-lg font-semibold mb-1" style={{ color: colors.accent }}>{invitation.partner_name}</p>
                  <p className="text-sm opacity-80 mt-1">Putra dari {invitation.parent_name}</p>
                </div>
              )}
              {invitation.parent_name2 && (
                <div
                  className="p-6 rounded-2xl"
                  style={{ backgroundColor: colors.primary + '12', border: `1px solid ${colors.primary}33`, boxShadow: `0 4px 20px ${colors.primary}18` }}
                >
                  <p className="text-lg font-semibold mb-1" style={{ color: colors.accent }}>{invitation.partner_name2}</p>
                  <p className="text-sm opacity-80 mt-1">Putri dari {invitation.parent_name2}</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Akad */}
      {(invitation.date_akad || invitation.time_akad) && (
        <section className={sectionClass} style={{ backgroundColor: colors.accent + '08' }}>
          <ScrollReveal className="w-full">
            <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#6b6b80' }}>Akad Nikah</p>
            <div className="w-12 h-px mx-auto mb-8" style={dividerStyle} />
            <div
              className="max-w-xs mx-auto p-8 rounded-2xl"
              style={{ backgroundColor: colors.secondary, border: `1px solid ${colors.primary}33`, boxShadow: `0 8px 32px ${colors.primary}18` }}
            >
              <p className="text-3xl font-bold mb-3" style={{ color: colors.accent }}>
                {invitation.date_akad
                  ? new Date(invitation.date_akad).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                  : ''}
              </p>
              {invitation.time_akad && (
                <p className="text-lg opacity-80">{invitation.time_akad} WIB</p>
              )}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Resepsi */}
      {(invitation.date_resepsi || invitation.time_resepsi) && (
        <section className={sectionClass} style={{ backgroundColor: colors.secondary }}>
          <ScrollReveal className="w-full">
            <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#6b6b80' }}>Resepsi Pernikahan</p>
            <div className="w-12 h-px mx-auto mb-8" style={dividerStyle} />
            <div
              className="max-w-xs mx-auto p-8 rounded-2xl"
              style={{ backgroundColor: colors.accent + '06', border: `1px solid ${colors.primary}33`, boxShadow: `0 8px 32px ${colors.primary}18` }}
            >
              <p className="text-3xl font-bold mb-3" style={{ color: colors.accent }}>
                {invitation.date_resepsi
                  ? new Date(invitation.date_resepsi).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                  : ''}
              </p>
              {invitation.time_resepsi && (
                <p className="text-lg opacity-80">{invitation.time_resepsi} WIB</p>
              )}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Lokasi */}
      {invitation.location && (
        <section className={sectionClass} style={{ backgroundColor: colors.accent + '08' }}>
          <ScrollReveal className="w-full">
            <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#6b6b80' }}>Lokasi</p>
            <div className="w-12 h-px mx-auto mb-8" style={dividerStyle} />
            <p className="text-2xl font-semibold mb-2">{invitation.location}</p>
            {invitation.address && (
              <p className="text-sm opacity-80 max-w-xs mx-auto leading-relaxed mb-8">{invitation.address}</p>
            )}
            {invitation.maps_url && (
              <a
                href={invitation.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 active:scale-95"
                style={{ backgroundColor: colors.primary, minHeight: '48px' }}
              >
                📍 Buka Google Maps
              </a>
            )}
          </ScrollReveal>
        </section>
      )}

      {/* Story */}
      {invitation.story && (
        <section className={sectionClass} style={{ backgroundColor: colors.secondary }}>
          <ScrollReveal className="w-full">
            <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#6b6b80' }}>Kisah Kami</p>
            <div className="w-12 h-px mx-auto mb-8" style={dividerStyle} />
            <p className="text-sm opacity-70 max-w-sm mx-auto leading-relaxed italic">"{invitation.story}"</p>
          </ScrollReveal>
        </section>
      )}

      {/* Galeri */}
      {photos.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: colors.accent + '08' }}>
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-center mb-4" style={{ color: '#6b6b80' }}>Galeri</p>
            <div className="w-12 h-px mx-auto mb-8" style={dividerStyle} />
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              {photos.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxImg(url)}
                  className="aspect-square rounded-xl overflow-hidden gallery-item cursor-zoom-in block"
                  aria-label={`Lihat foto ${i + 1}`}
                >
                  <img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover gallery-img"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* RSVP */}
      <section className={sectionClass} style={{ backgroundColor: colors.secondary }}>
        <ScrollReveal className="w-full">
          <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#6b6b80' }}>Konfirmasi Kehadiran</p>
          <div className="w-12 h-px mx-auto mb-8" style={dividerStyle} />
          <RsvpSection
            guests={guests}
            onSubmit={onRsvpSubmit}
            rsvpStatus={rsvpStatus}
            rsvpError={rsvpError}
            primaryColor={colors.primary}
            accentColor={colors.accent}
            bgColor={colors.secondary}
          />
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer
        className="py-16 px-6 text-center"
        style={{ background: `linear-gradient(160deg, ${colors.accent}, ${colors.accent}ee)` }}
      >
        <p className="text-white/70 text-xs uppercase tracking-widest mb-6">Dengan penuh cinta</p>
        <p
          className="text-4xl text-white"
          style={{ fontFamily: '"Great Vibes", cursive' }}
        >
          {invitation.partner_name} & {invitation.partner_name2}
        </p>
        <p className="text-white/70 text-xs mt-8">Terima kasih atas doa dan restu Anda</p>
      </footer>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightboxImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Foto galeri"
        >
          <img
            src={lightboxImg}
            alt="Foto"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white text-2xl hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => setLightboxImg(null)}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>
      )}

      <ScrollToTop primaryColor={colors.primary} />
    </div>
  );
}
