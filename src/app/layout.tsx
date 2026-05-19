import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Youth Invitation - Undangan Digital Pernikahan",
  description: "Buat undangan pernikahan digital dengan mudah dan elegan. Full custom template, RSVP online, dan notifikasi otomatis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-white text-gray-900 font-['Inter']">
        {children}
      </body>
    </html>
  );
}
