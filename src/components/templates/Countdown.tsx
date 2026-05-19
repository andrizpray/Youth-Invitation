'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: string;
  primaryColor: string;
  accentColor: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate, primaryColor, accentColor }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setExpired(true); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (expired) return (
    <p className="text-center text-lg font-semibold" style={{ color: primaryColor }}>
      Hari yang dinantikan telah tiba 🎉
    </p>
  );

  const units = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center w-16 h-16 rounded-xl"
          style={{ backgroundColor: primaryColor + '22', border: `1px solid ${primaryColor}44` }}
        >
          <span className="text-2xl font-bold leading-none" style={{ color: primaryColor }}>
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-xs mt-1" style={{ color: accentColor }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
