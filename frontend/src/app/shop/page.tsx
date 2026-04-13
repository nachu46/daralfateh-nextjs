"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/components/ProductCard";
import { SlidersHorizontal, Search, ChevronDown } from "lucide-react";

interface Category {
  id: number;
  name: string;
  image_url: string;
}

const sortOptions = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const urlCategoryId = searchParams.get("category_id");
  const urlSearch = searchParams.get("search") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    urlCategoryId ? parseInt(urlCategoryId) : null
  );
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [maxPrice, setMaxPrice] = useState(500);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync state with URL changes
  useEffect(() => {
    if (urlCategoryId) {
      setSelectedCategory(parseInt(urlCategoryId));
    } else {
      setSelectedCategory(null);
    }
    // Also sync search term from URL (e.g. from header search bar)
    setSearchQuery(urlSearch);
  }, [urlCategoryId, urlSearch]);

  // Fetch products from our Next.js API (which talks to Odoo)
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (selectedCategory) params.set("category_id", String(selectedCategory));
    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCategory]);

  // Fetch categories once
  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, []);

  // Compute max price from actual products
  useEffect(() => {
    if (products.length) {
      const top = Math.ceil(Math.max(...products.map(p => p.price)));
      setMaxPrice(top);
    }
  }, [products]);

  const applyFilters = useCallback(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }
    result = result.filter(p => p.price <= maxPrice);
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    setFiltered(result);
  }, [products, sortBy, searchQuery, maxPrice]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const topPrice = products.length ? Math.ceil(Math.max(...products.map(p => p.price))) : 500;

  return (
    <div className="min-h-screen bg-[#F7F3EF]">
      {/* Page Header */}
      <div className="w-full bg-white border-b border-[#EEE] py-12 px-4 mb-10">
        <div className="container mx-auto max-w-[1500px] text-center">
          <h1 className="text-3xl md:text-4xl font-black text-[#2C2C2C] mb-3 tracking-tight uppercase">Our Collections</h1>
          <p className="text-[#C8A97E] text-[13px] font-bold tracking-[0.2em] uppercase">Premium Quality • Fresh Daily • Hand Picked</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1500px] pb-24">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A97E]" />
            <input
              type="text"
              placeholder="Search our pantry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#EEE] rounded-full pl-14 pr-6 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C8A97E] shadow-sm italic"
            />
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-grow lg:flex-grow-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full bg-white border border-[#EEE] rounded-full px-8 py-3.5 pr-12 text-xs font-bold text-[#2C2C2C] uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-[#C8A97E] shadow-sm cursor-pointer"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A97E] pointer-events-none" />
            </div>
            <button
              onClick={() => setShowFilters(p => !p)}
              className="lg:hidden flex items-center justify-center gap-2 bg-white border border-[#EEE] rounded-full px-8 py-3.5 text-[11px] font-bold text-[#2C2C2C] uppercase tracking-widest shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className={`w-full lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-[16px] border border-[#EEE] p-8 shadow-sm lg:sticky lg:top-32">
              <h3 className="font-bold text-[#2C2C2C] text-sm uppercase tracking-[0.2em] mb-8 pb-3 border-b border-[#F9F9F9]">Refine By</h3>

              {/* Category Filter */}
              <div className="mb-10">
                <h4 className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.15em] mb-5">Category</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`text-left text-[13px] px-0 py-1.5 font-bold transition-all border-l-2 pl-4 ${
                      selectedCategory === null ? 'border-[#C8A97E] text-[#C8A97E]' : 'border-transparent text-[#666] hover:text-[#2C2C2C] hover:border-[#EEE]'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-left text-[13px] px-0 py-1.5 font-bold transition-all border-l-2 pl-4 ${
                        selectedCategory === cat.id ? 'border-[#C8A97E] text-[#C8A97E]' : 'border-transparent text-[#666] hover:text-[#2C2C2C] hover:border-[#EEE]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.15em] mb-5">Max Price</h4>
                <input
                  type="range"
                  min={0}
                  max={topPrice}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-[#F0F0F0] rounded-lg appearance-none cursor-pointer accent-[#C8A97E]"
                />
                <div className="flex justify-between text-[11px] text-[#999] mt-3 font-bold">
                  <span>AED 0</span>
                  <span className="text-[#2C2C2C]">AED {maxPrice}</span>
                </div>
              </div>

              <button
                onClick={() => { setSelectedCategory(null); setMaxPrice(topPrice); setSearchQuery(""); setSortBy("default"); }}
                className="w-full text-[10px] text-[#999] uppercase tracking-widest font-black mt-6 py-3 border border-[#F0F0F0] rounded-full hover:bg-[#F9F9F9] transition-all"
              >
                Clear All
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[11px] font-black text-[#999] uppercase tracking-widest">
                {loading ? 'Loading...' : <>Showing <span className="text-[#C8A97E]">{filtered.length}</span> products</>}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[12px] animate-pulse" style={{ height: '300px' }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[20px] border border-[#EEE] shadow-sm">
                <div className="text-4xl mb-4">✧</div>
                <h3 className="font-bold text-[#2C2C2C] text-lg mb-2">No items found</h3>
                <p className="text-[#999] text-sm italic">Consider adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
