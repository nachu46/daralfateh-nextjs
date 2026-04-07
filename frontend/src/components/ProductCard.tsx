"use client";

import Link from 'next/link';
import { Plus, Check, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { useState } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  hover_image_url?: string | null;
  category: { id: number; name: string }[];
  badge?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem);
  const addToast = useToastStore(state => state.addToast);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    addToast(`${product.name} added to pantry ✧`, 'success');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(w => !w);
  };

  const displayImage = hovered && product.hover_image_url
    ? product.hover_image_url
    : (product.image_url || 'https://dar-al-fateh.odoo.com/web/image/website.s_cover_default_image');

  return (
    <div
      className="bg-white rounded-[12px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 transition-all duration-500 relative group flex flex-col h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10 bg-[#C8A97E] text-white text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full shadow">
          {product.badge}
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition-all ${wishlisted ? 'text-[#C8A97E]' : 'text-[#CCC] hover:text-[#C8A97E]'} opacity-0 group-hover:opacity-100`}
      >
        <Heart size={15} fill={wishlisted ? "currentColor" : "none"} strokeWidth={1.5} />
      </button>

      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden bg-[#F9F9F9]" style={{ height: '200px' }}>
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-grow flex flex-col">
        <p className="text-[9px] uppercase tracking-[0.15em] text-[#C8A97E] font-black mb-1">
          {product.category[0]?.name || 'Fresh'}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-[13px] font-semibold text-[#2C2C2C] line-clamp-2 leading-snug hover:text-[#C8A97E] transition-colors mb-3">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-[15px] font-bold text-[#2C2C2C]">
            AED {product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex-shrink-0 ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-[#F7F3EF] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-white'
            }`}
          >
            {added ? <Check size={13} strokeWidth={3} /> : <Plus size={13} strokeWidth={3} />}
            {added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
