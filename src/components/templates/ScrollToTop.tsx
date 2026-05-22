'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTop({ primaryColor = '#888' }: { primaryColor?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll ke atas"
      className="fixed bottom-6 right-5 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-xl text-white text-lg font-semibold"
      style={{
        backgroundColor: primaryColor,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.85)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      ↑
    </button>
  );
}
