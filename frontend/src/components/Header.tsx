"use client";

import Link from 'next/link';
import { Search, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const itemCount = useCartStore((state) => state.itemCount);
  
  // Handle hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#ffffff] shadow-sm border-b border-slate-100">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <div className="flex-[0.25] flex items-center gap-2">
          <Link href="/" className="text-2xl font-extrabold text-[var(--color-brand-green)] tracking-tight">
            Dar Al Fateh
          </Link>
        </div>

        {/* Search Desktop */}
        <div className="flex-1 max-w-2xl px-8 hidden md:block">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder="Search for fresh groceries, pantry staples..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green-light)] transition-all group-hover:bg-white"
            />
            <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400 group-focus-within:text-[var(--color-brand-green)] transition-colors" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex-[0.25] flex justify-end items-center gap-6">
          <Link href="/login" className="flex flex-col items-center text-slate-500 hover:text-[var(--color-brand-green)] transition-colors">
            <User className="h-5 w-5 mb-0.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Sign In</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center text-slate-500 hover:text-[var(--color-brand-green)] relative transition-colors">
            <div className="relative">
              <ShoppingBag className="h-5 w-5 mb-0.5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[var(--color-brand-green)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Cart</span>
          </Link>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 border-t border-slate-100 bg-white">
        <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green-light)]"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
