"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function EmptyCart({ isDrawer = false }: { isDrawer?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${isDrawer ? "h-[60vh] px-4" : "py-20 bg-white border border-[#EAEAEA]"}`}>
      <div className={`relative mb-8 transition-opacity duration-1000 animate-in fade-in fill-mode-both ${isDrawer ? "w-32 h-32" : "w-48 h-48 md:w-64 md:h-64"}`}>
        <Image 
          src="/images/empty-cart.png" 
          alt="Boutique Empty Pantry" 
          fill
          className="object-contain grayscale-[0.2] contrast-[0.9] brightness-[1.02]"
          priority
        />
      </div>

      <div className="space-y-4 max-w-[400px]">
        <h2 className={`${isDrawer ? "text-lg" : "text-2xl md:text-3xl"} font-bold text-[#2C2C2C] uppercase tracking-tighter`} style={{ fontFamily: 'var(--font-outfit)' }}>
          Your Cart is Empty
        </h2>
        <p className={`${isDrawer ? "text-[10px]" : "text-sm"} text-[#666] leading-relaxed uppercase tracking-widest font-medium`} style={{ fontFamily: 'var(--font-inter)' }}>
          Looks like you haven’t added anything to your selection yet.
        </p>
      </div>

      <div className="mt-10 w-full max-w-[280px]">
        <Link 
          href="/" 
          className={`bg-[#C8A97E] text-white py-5 rounded-none font-black ${isDrawer ? "text-[9px]" : "text-[11px]"} uppercase tracking-[0.4em] hover:bg-[#111] transition-all flex items-center justify-center gap-4 shadow-xl group`}
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Continue Shopping
          <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
