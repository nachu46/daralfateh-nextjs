"use client";

import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState, useRef } from 'react';

interface Category {
  id: number;
  name: string;
  image_url: string;
  children: { id: number; name: string; image_url: string }[];
}

export default function Header() {
  const itemCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const openCart = useCartStore((state) => state.openCart);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Close mega menu on outside click
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Fetch live categories from Odoo via Next.js API
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b border-[#F0F0F0] shadow-[0_2px_20px_rgba(0,0,0,0.03)] focus:outline-none">
      {/* Main Navigation */}
      <div className="w-full py-4 px-6 focus:outline-none">
        <div className="container mx-auto max-w-[1500px] flex items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group flex flex-col items-start">
            <span className="text-xl font-black text-[#2C2C2C] leading-none tracking-[-0.03em] uppercase group-hover:text-[#C8A97E] transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
              Dar Al Fateh
            </span>
            <span className="text-[8px] font-bold text-[#C8A97E] tracking-[0.4em] uppercase mt-0.5">International</span>
          </Link>

          {/* Desktop Category Mega Menu */}
          <nav ref={menuRef} className="hidden lg:flex items-center gap-1 flex-1 max-w-3xl">
            {/* All Products link */}
            <Link
              href="/shop"
              className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#2C2C2C] hover:text-[#C8A97E] hover:bg-[#F7F3EF] rounded-full transition-colors whitespace-nowrap"
            >
              All Products
            </Link>

            {/* Dynamic category items from Odoo */}
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => setActiveMenu(cat.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={`/shop?category_id=${cat.id}`}
                  className={`flex items-center gap-1 px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-full transition-colors whitespace-nowrap ${
                    activeMenu === cat.id
                      ? 'text-[#C8A97E] bg-[#F7F3EF]'
                      : 'text-[#2C2C2C] hover:text-[#C8A97E] hover:bg-[#F7F3EF]'
                  }`}
                >
                  {cat.name}
                  {cat.children.length > 0 && (
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-200 ${activeMenu === cat.id ? 'rotate-180' : ''}`}
                    />
                  )}
                </Link>

                {/* Subcategory Dropdown — only if has children */}
                {cat.children.length > 0 && (
                  <div
                    className={`absolute top-full left-0 mt-2 bg-white border border-[#F0F0F0] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] min-w-[200px] transition-all duration-200 origin-top-left overflow-hidden ${
                      activeMenu === cat.id
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    {/* Dropdown header */}
                    <div className="px-5 pt-4 pb-2 border-b border-[#F5F5F5]">
                      <p className="text-[9px] font-black text-[#C8A97E] uppercase tracking-[0.25em]">{cat.name}</p>
                    </div>
                    {/* Subcategory links */}
                    <div className="p-3 flex flex-col gap-0.5">
                      {cat.children.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/shop?category_id=${sub.id}`}
                          className="flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-[#555] hover:text-[#C8A97E] hover:bg-[#F7F3EF] rounded-xl transition-all group/sub"
                          onClick={() => setActiveMenu(null)}
                        >
                          <span className="w-1 h-1 rounded-full bg-[#DDD] group-hover/sub:bg-[#C8A97E] transition-colors flex-shrink-0" />
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                    {/* View all link */}
                    <div className="px-5 py-3 border-t border-[#F5F5F5]">
                      <Link
                        href={`/shop?category_id=${cat.id}`}
                        className="text-[10px] font-black text-[#C8A97E] uppercase tracking-widest hover:underline"
                        onClick={() => setActiveMenu(null)}
                      >
                        View All {cat.name} →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Icons area — only Cart remains */}
          <div className="flex items-center gap-4 flex-shrink-0 focus:outline-none">

            <div className="flex items-center gap-3">
              <button 
                onClick={openCart} 
                className="flex items-center gap-2 px-4 py-2 border border-[#EAEAEA] rounded-full hover:bg-[#F7F3EF] hover:border-[#C8A97E] transition-all group relative"
              >
                <ShoppingBag 
                  size={18} 
                  strokeWidth={1.5} 
                  className="text-[#2C2C2C] group-hover:text-[#C8A97E] transition-colors" 
                />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#2C2C2C] group-hover:text-[#C8A97E]">Cart</span>
                {mounted && itemCount > 0 && (
                  <span 
                    key={itemCount}
                    className="absolute -top-1.5 -right-1.5 bg-[#C8A97E] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in duration-300"
                  >
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile toggle */}
              <button
                className="lg:hidden text-[#2C2C2C] hover:text-[#C8A97E] transition-colors p-1"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Accordion Menu */}
      <div className={`lg:hidden bg-white border-t border-[#F0F0F0] overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[80vh] overflow-y-auto' : 'max-h-0'}`}>
        <div className="px-6 py-4 space-y-1">
          <button 
            onClick={() => { openCart(); setMobileOpen(false); }}
            className="w-full flex items-center justify-between py-3 text-[12px] font-black uppercase tracking-widest text-[#C8A97E] border-b border-[#F5F5F5]"
          >
            <span className="flex items-center gap-2">
              Your Selection 
              {mounted && itemCount > 0 && (
                <span key={itemCount} className="bg-[#C8A97E] text-white text-[9px] px-2 py-0.5 rounded-full animate-in zoom-in duration-300 shadow-sm">
                  {itemCount}
                </span>
              )}
            </span>
            <ShoppingBag size={16} />
          </button>
          <Link href="/shop" className="block py-3 text-[12px] font-black uppercase tracking-widest text-[#2C2C2C] border-b border-[#F5F5F5]" onClick={() => setMobileOpen(false)}>
            All Products
          </Link>
          {categories.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === cat.id ? null : cat.id)}
                className="w-full flex items-center justify-between py-3 text-[12px] font-black uppercase tracking-widest text-[#2C2C2C] border-b border-[#F5F5F5]"
              >
                {cat.name}
                {cat.children.length > 0 && (
                  <ChevronDown size={14} className={`text-[#C8A97E] transition-transform ${mobileExpanded === cat.id ? 'rotate-180' : ''}`} />
                )}
              </button>
              {mobileExpanded === cat.id && cat.children.length > 0 && (
                <div className="py-2 pl-4 flex flex-col gap-1">
                  <Link
                    href={`/shop?category_id=${cat.id}`}
                    className="text-[12px] font-bold text-[#C8A97E] py-1.5"
                    onClick={() => setMobileOpen(false)}
                  >
                    All {cat.name}
                  </Link>
                  {cat.children.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/shop?category_id=${sub.id}`}
                      className="text-[13px] font-semibold text-[#666] hover:text-[#C8A97E] py-1.5 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
