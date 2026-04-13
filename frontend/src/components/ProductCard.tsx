"use client";

import Link from 'next/link';
import { Plus, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { useState } from 'react';

export interface ProductAttribute {
  id: number;
  name: string;
  values: { id: number; name: string }[];
}

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  attribute_value_ids: number[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  hover_image_url?: string | null;
  category: { id: number; name: string }[];
  badge?: string;
  description?: string;
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
  extra_images?: string[];
  website_description?: string;
  ecommerce_description?: string;
  internal_description?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem);
  const addToast = useToastStore(state => state.addToast);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    addToast(`${product.name} added to pantry ✧`, 'success');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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

      {/* Product Image — two-image crossfade on hover */}
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden bg-[#F9F9F9]" style={{ height: '220px' }}>
        {/* Primary image */}
        <img
          src={product.image_url || '/api/product-image/0'}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            hovered && product.hover_image_url ? 'opacity-0' : 'opacity-100'
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/api/product-image/0';
          }}
        />
        {/* Hover image — only rendered when available */}
        {product.hover_image_url && (
          <img
            src={product.hover_image_url}
            alt={`${product.name} – detail`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </Link>

      {/* Product Details */}
      <div className="p-6 flex-grow flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-black">
          {product.category[0]?.name || 'Fresh'}
        </p>
        
        <Link href={`/product/${product.id}`} className="group/title">
          <h3 className="text-[15px] font-extrabold text-[#2C2C2C] uppercase tracking-tight leading-[1.2] line-clamp-2 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-2 flex items-center justify-between gap-4">
          <span className="text-[17px] font-black text-[#2C2C2C]">
            AED {product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all flex-shrink-0 ${
              added
                ? 'bg-black text-white'
                : 'bg-[#F7F3EF] text-[#C8A97E] hover:bg-black hover:text-white'
            }`}
          >
            {added ? <Check size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={4} />}
            {added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
