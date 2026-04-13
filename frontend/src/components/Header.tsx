"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ChevronDown, User, LogOut, Award, Info, Phone } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import LoginModal from '@/components/LoginModal';

interface Category {
  id: number;
  name: string;
  image_url: string;
  children: { id: number; name: string; image_url: string }[];
}

interface SearchSuggestion {
  products: { id: number; name: string; price: number }[];
  categories: { id: number; name: string }[];
}

export default function Header() {
  const itemCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const openCart = useCartStore((state) => state.openCart);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion>({ products: [], categories: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Record<number, any[]>>({});
  const [loadingProducts, setLoadingProducts] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, []);

  // Debounced search suggestions
  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions({ products: [], categories: [] }); return; }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch {
      setSuggestions({ products: [], categories: [] });
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setMobileOpen(false);
    }
  };

  const handleSuggestionClick = (href: string) => {
    router.push(href);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const infoLinks = [
    { href: '/about', label: 'About Us', icon: Info, tooltip: 'Learn about Dar Al Fateh' },
    { href: '/certificates', label: 'Certificates', icon: Award, tooltip: 'Our quality certifications' },
    { href: '/contact', label: 'Contact Us', icon: Phone, tooltip: 'Get in touch with us' },
  ];

  const handleCategoryHover = (catId: number | null) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    if (catId) {
      setHoveredCategory(catId);
      if (!categoryProducts[catId]) {
        setLoadingProducts(catId);
        fetch(`/api/products?category_id=${catId}&limit=4`)
          .then(r => r.json())
          .then(products => {
            setCategoryProducts(prev => ({ ...prev, [catId]: Array.isArray(products) ? products : [] }));
            setLoadingProducts(null);
          })
          .catch(() => setLoadingProducts(null));
      }
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredCategory(null);
      }, 300);
    }
  };

  return (
    <>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <header className="w-full sticky top-0 z-50 bg-white border-b border-[#F0F0F0] shadow-[0_2px_20px_rgba(0,0,0,0.04)]">

        {/* Top utility bar */}
        <div className="w-full bg-[#2C2C2C] text-white px-6 py-1.5 hidden lg:block">
          <div className="container mx-auto max-w-[1500px] flex items-center justify-between">
            <p className="text-[10px] tracking-[0.2em] text-[#C8A97E] font-medium uppercase">
              ✧ Premium Fresh Produce — Direct from Farm to Table
            </p>
            <div className="flex items-center gap-6">
              {infoLinks.map(link => (
                <div key={link.href} className="relative group/info">
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#AAA] hover:text-[#C8A97E] transition-colors"
                  >
                    <link.icon size={11} />
                    {link.label}
                  </Link>
                  {/* Tooltip */}
                  <div className="absolute top-full right-0 mt-2 bg-[#2C2C2C] border border-[#444] text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-200 pointer-events-none z-50">
                    {link.tooltip}
                    <div className="absolute -top-1 right-3 w-2 h-2 bg-[#2C2C2C] border-l border-t border-[#444] rotate-45" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Navigation Row */}
        <div className="w-full py-4 px-6">
          <div className="container mx-auto max-w-[1500px] flex items-center gap-6">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center h-10 lg:h-12">
              <img src="/api/logo" alt="Dar Al Fateh Group" className="h-full w-auto object-contain" />
            </Link>

            {/* Shop link (desktop) */}
            <Link
              href="/shop"
              className="hidden lg:block flex-shrink-0 text-[11px] font-black uppercase tracking-[0.4em] text-[#2C2C2C] hover:text-[#C8A97E] transition-colors whitespace-nowrap"
            >
              Shop
            </Link>

            {/* Central Search Bar */}
            <div className="hidden lg:flex flex-1 relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="w-full relative group">
                <input
                  type="text"
                  placeholder="Search produce, dates, spices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  className="w-full bg-[#F7F3EF] border border-transparent focus:border-[#C8A97E] focus:bg-white rounded-full py-3 pl-6 pr-14 text-[13px] font-medium text-[#2C2C2C] placeholder:text-[#AAA] focus:outline-none transition-all duration-300 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#C8A97E] text-white hover:bg-[#2C2C2C] transition-all"
                >
                  <Search size={16} strokeWidth={2.5} />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && (suggestions.products.length > 0 || suggestions.categories.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[16px] shadow-[0_10px_50px_rgba(0,0,0,0.12)] border border-[#F0F0F0] z-[60] overflow-hidden">
                  {suggestions.categories.length > 0 && (
                    <div className="px-4 pt-4 pb-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C8A97E] mb-2">Categories</p>
                      {suggestions.categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => handleSuggestionClick(`/shop?category_id=${cat.id}`)}
                          className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F7F3EF] transition-colors group/s"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
                          <span className="text-[13px] font-semibold text-[#2C2C2C] group-hover/s:text-[#C8A97E] transition-colors">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {suggestions.products.length > 0 && (
                    <div className="px-4 pt-2 pb-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#C8A97E] mb-2">Products</p>
                      {suggestions.products.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleSuggestionClick(`/product/${p.id}`)}
                          className="w-full text-left flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-[#F7F3EF] transition-colors group/s"
                        >
                          <span className="text-[13px] font-semibold text-[#2C2C2C] group-hover/s:text-[#C8A97E] transition-colors line-clamp-1">{p.name}</span>
                          <span className="text-[11px] font-bold text-[#999] flex-shrink-0">AED {p.price.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-[#F0F0F0] px-4 py-2.5">
                    <button
                      onClick={() => { router.push(`/shop?search=${encodeURIComponent(searchQuery)}`); setShowSuggestions(false); }}
                      className="text-[11px] font-black uppercase tracking-widest text-[#C8A97E] hover:text-[#2C2C2C] transition-colors"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo; →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-auto lg:ml-0">

              {/* User / Login (desktop) */}
              {mounted && (
                <div className="hidden lg:block relative" ref={userMenuRef}>
                  {user ? (
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-4 py-2 border border-[#EAEAEA] rounded-full hover:bg-[#F7F3EF] hover:border-[#C8A97E] transition-all group"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#C8A97E] flex items-center justify-center text-white text-[10px] font-black">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#2C2C2C] group-hover:text-[#C8A97E]">
                        Hello, {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown size={12} className={`text-[#C8A97E] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-[#EAEAEA] rounded-full hover:bg-[#F7F3EF] hover:border-[#C8A97E] transition-all group"
                    >
                      <User size={16} strokeWidth={1.5} className="text-[#2C2C2C] group-hover:text-[#C8A97E] transition-colors" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#2C2C2C] group-hover:text-[#C8A97E]">Sign In</span>
                    </button>
                  )}

                  {/* User dropdown */}
                  {user && showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-[14px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-[#F0F0F0] w-52 overflow-hidden z-[60]">
                      <div className="px-5 py-4 border-b border-[#F0F0F0] bg-[#F7F3EF]">
                        <p className="text-[10px] text-[#AAA] uppercase tracking-widest font-bold">Signed in as</p>
                        <p className="text-[13px] font-black text-[#2C2C2C] mt-0.5">{user.name}</p>
                        <p className="text-[11px] text-[#999]">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#666] hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className="flex items-center gap-2 px-4 py-2 border border-[#EAEAEA] rounded-full hover:bg-[#F7F3EF] hover:border-[#C8A97E] transition-all group relative"
              >
                <ShoppingBag size={18} strokeWidth={1.5} className="text-[#2C2C2C] group-hover:text-[#C8A97E] transition-colors" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#2C2C2C] group-hover:text-[#C8A97E]">Cart</span>
                {mounted && itemCount > 0 && (
                  <span
                    key={itemCount}
                    className="absolute -top-1.5 -right-1.5 bg-[#C8A97E] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
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

        {/* Category Navigation Bar (Desktop) */}
        <div className="hidden lg:block border-t border-[#F0F0F0] bg-white relative">
          <div className="container mx-auto max-w-[1500px] px-6">
            <div className="flex items-center justify-center gap-10">
              <Link
                href="/shop"
                className="py-4 text-[11px] font-black uppercase tracking-[0.3em] text-[#2C2C2C] hover:text-[#C8A97E] transition-colors border-b-2 border-transparent hover:border-[#C8A97E]"
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="relative py-4"
                  onMouseEnter={() => handleCategoryHover(cat.id)}
                  onMouseLeave={() => handleCategoryHover(null)}
                >
                  <Link
                    href={`/shop?category_id=${cat.id}`}
                    className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors flex items-center gap-1.5 ${
                      hoveredCategory === cat.id ? 'text-[#C8A97E]' : 'text-[#2C2C2C] hover:text-[#C8A97E]'
                    }`}
                  >
                    {cat.name}
                    {cat.children.length > 0 && <ChevronDown size={10} className={`transition-transform duration-300 ${hoveredCategory === cat.id ? 'rotate-180' : ''}`} />}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Mega Menu Dropdown */}
          <div
            className={`absolute top-full left-0 w-full bg-white border-b border-[#F0F0F0] shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 z-40 overflow-hidden ${
              hoveredCategory ? 'max-h-[600px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
            }`}
            onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); }}
            onMouseLeave={() => handleCategoryHover(null)}
          >
            <div className="container mx-auto max-w-[1500px] px-12 py-10">
              {hoveredCategory && (
                <div className="grid grid-cols-12 gap-12">
                  {/* Left: Sub-categories */}
                  <div className="col-span-3 border-r border-[#F0F0F0] pr-8">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#C8A97E] mb-6">Explore {categories.find(c => c.id === hoveredCategory)?.name}</h3>
                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/shop?category_id=${hoveredCategory}`}
                        className="text-[13px] font-bold text-[#2C2C2C] hover:text-[#C8A97E] transition-colors"
                      >
                        Shop All {categories.find(c => c.id === hoveredCategory)?.name}
                      </Link>
                      {categories.find(c => c.id === hoveredCategory)?.children.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/shop?category_id=${sub.id}`}
                          className="text-[13px] font-semibold text-[#666] hover:text-[#C8A97E] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Middle: Featured Products */}
                  <div className="col-span-9">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#C8A97E]">Featured Products</h3>
                      <Link href={`/shop?category_id=${hoveredCategory}`} className="text-[10px] font-black uppercase tracking-widest text-[#AAA] hover:text-[#C8A97E]">View all →</Link>
                    </div>
                    
                    {loadingProducts === hoveredCategory ? (
                      <div className="h-48 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-6">
                        {categoryProducts[hoveredCategory]?.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            className="group/p"
                            onClick={() => setHoveredCategory(null)}
                          >
                            <div className="aspect-square rounded-xl bg-[#F7F3EF] mb-3 overflow-hidden p-4">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-contain transition-transform duration-500 group-hover/p:scale-110"
                              />
                            </div>
                            <h4 className="text-[11px] font-extrabold text-[#2C2C2C] uppercase tracking-wider line-clamp-1 group-hover/p:text-[#C8A97E] transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-[10px] font-bold text-[#AAA] mt-1">AED {product.price.toFixed(2)}</p>
                          </Link>
                        ))}
                        {(!categoryProducts[hoveredCategory] || categoryProducts[hoveredCategory].length === 0) && !loadingProducts && (
                          <div className="col-span-4 py-12 text-center">
                            <p className="text-[12px] font-bold text-[#AAA] uppercase tracking-widest">No products found in this category</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:hidden px-6 pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F3EF] rounded-full py-3 pl-5 pr-12 text-[12px] font-medium text-[#2C2C2C] focus:outline-none"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#C8A97E]">
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Mobile Accordion Menu */}
        <div className={`lg:hidden bg-white border-t border-[#F0F0F0] overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[80vh] overflow-y-auto' : 'max-h-0'}`}>
          <div className="px-6 py-4 space-y-1">

            {/* Cart */}
            <button
              onClick={() => { openCart(); setMobileOpen(false); }}
              className="w-full flex items-center justify-between py-3 text-[12px] font-black uppercase tracking-widest text-[#C8A97E] border-b border-[#F5F5F5]"
            >
              <span className="flex items-center gap-2">
                Your Selection
                {mounted && itemCount > 0 && (
                  <span className="bg-[#C8A97E] text-white text-[9px] px-2 py-0.5 rounded-full">{itemCount}</span>
                )}
              </span>
              <ShoppingBag size={16} />
            </button>

            {/* Sign In */}
            {mounted && !user && (
              <button
                onClick={() => { setShowLoginModal(true); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 py-3 text-[12px] font-black uppercase tracking-widest text-[#2C2C2C] border-b border-[#F5F5F5]"
              >
                <User size={16} className="text-[#C8A97E]" />
                Sign In
              </button>
            )}

            {/* User info */}
            {mounted && user && (
              <div className="py-3 border-b border-[#F5F5F5]">
                <p className="text-[11px] font-black uppercase tracking-widest text-[#C8A97E]">Hello, {user.name.split(' ')[0]}</p>
                <button onClick={() => logout()} className="text-[11px] text-red-400 font-bold mt-1">Sign Out</button>
              </div>
            )}

            <Link href="/shop" className="block py-3 text-[12px] font-black uppercase tracking-widest text-[#2C2C2C] border-b border-[#F5F5F5]" onClick={() => setMobileOpen(false)}>
              All Products
            </Link>

            {infoLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-[12px] font-black uppercase tracking-widest text-[#2C2C2C] border-b border-[#F5F5F5]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

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
                    <Link href={`/shop?category_id=${cat.id}`} className="text-[12px] font-bold text-[#C8A97E] py-1.5" onClick={() => setMobileOpen(false)}>
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
    </>
  );
}
