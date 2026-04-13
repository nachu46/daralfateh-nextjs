"use client";

import { useToastStore } from '@/store/useToastStore';
import { useEffect, useState } from 'react';

export default function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            px-8 py-3 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.08)]
            border border-[#EAEAEA] bg-white transform transition-all duration-700
            animate-in slide-in-from-top-12 fade-in
            flex items-center gap-3
          `}
        >
          <span className="text-[#C8A97E] text-xs font-black">✧</span>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2C2C2C]" style={{ fontFamily: 'var(--font-outfit)' }}>
            {toast.message.replace('✧', '').trim()}
          </p>
        </div>
      ))}
    </div>
  );
}
