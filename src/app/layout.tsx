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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Amiri:ital,wght@0,400;0,700;1,400&family=Josefin+Sans:wght@300;400;500;600;700&family=Sacramento&family=Parisienne&family=Lora:ital,wght@0,400;0,600;1,400&family=Philosopher:wght@400;700&family=Playfair+Display+SC:wght@400;700&family=Cinzel+Decorative:wght@400;700&family=Poppins:wght@300;400;500;600&family=Pinyon+Script&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-+s2gWczdWXHMCDl+2tLxJzB3SVBrhJ+I07sI+pY9aFjsBd1xlC1R2Kj7KjBEdS/L1MGrxqXq+p06a2Gk+Go4UQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className="antialiased bg-white text-gray-900 font-['Inter']">
        {children}
      </body>
    </html>
  );
}
