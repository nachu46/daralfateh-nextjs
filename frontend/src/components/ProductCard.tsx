"use client";

import Link from 'next/link';
import { Plus, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  category: { id: number; name: string }[];
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-[var(--color-card-bg)] rounded-3xl p-4 md:p-5 border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 relative group flex flex-col h-full">
      <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md shadow-sm">
        -20%
      </div>
      
      <Link href={`/product/${product.id}`} className="block flex-1">
        <div className="relative w-full aspect-square bg-slate-50 mix-blend-multiply rounded-2xl mb-5 overflow-hidden flex items-center justify-center p-6">
          <img 
            src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80'} 
            alt={product.name}
            className="object-contain w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="mb-1.5 text-[10px] md:text-xs text-slate-500 font-bold tracking-wider uppercase">
          {product.category[0]?.name || 'Fresh Produce'}
        </div>
        <h3 className="font-semibold text-slate-800 leading-snug mb-2 line-clamp-2 md:text-lg">
          {product.name}
        </h3>
      </Link>
      
      <div className="flex items-center justify-between mt-auto pt-4 relative z-10 border-t border-slate-50">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 line-through decoration-slate-300 font-medium">AED {(product.price * 1.25).toFixed(2)}</span>
          <span className="text-xl md:text-2xl font-extrabold text-[var(--color-brand-green-hover)] tracking-tight tracking-[-0.02em]">AED {product.price.toFixed(2)}</span>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={added}
          className={`p-3 md:p-4 rounded-2xl transition-all shadow-md group/btn ${added ? 'bg-emerald-100 text-emerald-600 shadow-none' : 'bg-[var(--color-brand-green)] text-white hover:bg-[var(--color-brand-green-hover)] shadow-[var(--color-brand-green)]/20 active:scale-95'}`}
        >
          {added ? (
            <Check className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
          ) : (
            <Plus className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
}
