"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Heart, Check, Plus, Minus, Shield, Truck, Clock } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { useState, useEffect } from "react";
import type { Product } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    params.then(({ id }) => {
      // Fetch product from our Next.js API route (proxies to Odoo)
      fetch(`/api/product/${id}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && data.id) {
            setProduct(data);
            // Fetch related products in same category
            const catId = data.category[0]?.id;
            if (catId) {
              fetch(`/api/products?category_id=${catId}&limit=5`)
                .then(r => r.json())
                .then(list => {
                  if (Array.isArray(list)) setRelated(list.filter((p: Product) => p.id !== data.id).slice(0, 4));
                }).catch(() => {});
            }
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [params]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addItem(product);
    addToast(`${quantity}x ${product.name} added to pantry ✧`, 'success');
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[11px] font-black text-[#999] uppercase tracking-widest">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F3EF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">✧</p>
          <h2 className="font-black text-[#2C2C2C] text-xl mb-2">Product not found</h2>
          <Link href="/shop" className="text-[#C8A97E] underline text-sm font-bold">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const originalPrice = (product.price * 1.25).toFixed(2);
  const discount = Math.round(20);

  return (
    <div className="min-h-screen bg-[#F7F3EF]">
      {/* Breadcrumb */}
      <div className="w-full bg-white border-b border-[#F0F0F0]">
        <div className="container mx-auto px-4 max-w-[1500px] py-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-[#999]">
          <Link href="/" className="hover:text-[#C8A97E] transition-colors">Home</Link>
          <span className="text-[#DDD]">/</span>
          <Link href="/shop" className="hover:text-[#C8A97E] transition-colors">Shop</Link>
          <span className="text-[#DDD]">/</span>
          <span className="text-[#2C2C2C] truncate max-w-[200px] normal-case font-semibold">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1500px] py-12">
        <Link href="/shop" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#999] hover:text-[#C8A97E] mb-12 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Keep Shopping
        </Link>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Image Panel */}
          <div className="relative">
            <div className="absolute top-6 left-6 z-10 bg-[#C8A97E] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
              {discount}% Collection Sale
            </div>
            <div className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden aspect-square flex items-center justify-center p-10 group">
              <img
                src={product.image_url || ''}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://dar-al-fateh.odoo.com/web/image/website.s_cover_default_image';
                }}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="flex flex-col justify-center">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C8A97E] mb-4">
              {product.category[0]?.name || 'Premium'}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#2C2C2C] leading-[1.1] mb-6 tracking-[-0.02em]">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-6 mb-10">
              <span className="text-4xl font-bold text-[#2C2C2C]">AED {product.price.toFixed(2)}</span>
              <div className="flex flex-col">
                <span className="text-sm text-[#AAA] line-through font-bold">AED {originalPrice}</span>
                <span className="text-[10px] font-black text-[#C8A97E] uppercase tracking-wider">
                  Save AED {(product.price * 0.25).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-[#EEE] mb-10" />

            {/* Quantity */}
            <div className="flex items-center gap-8 mb-10">
              <span className="text-[11px] font-black text-[#2C2C2C] uppercase tracking-[0.2em]">Quantity:</span>
              <div className="flex items-center gap-6 bg-white border border-[#EEE] rounded-full px-6 py-2 shadow-sm">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-[#DDD] hover:text-[#C8A97E] transition-colors">
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span className="w-4 text-center font-bold text-[#2C2C2C]">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="text-[#DDD] hover:text-[#C8A97E] transition-colors">
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-12">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-[3] py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                  added ? 'bg-emerald-500 text-white' : 'bg-[#2C2C2C] text-white hover:bg-[#C8A97E] shadow-black/10'
                }`}
              >
                {added ? <><Check size={18} strokeWidth={3} /> Added!</> : <><ShoppingBag size={18} strokeWidth={2} /> Add to Cart</>}
              </button>
              <button
                onClick={() => setWishlisted(w => !w)}
                className={`flex-1 rounded-full border border-[#EEE] flex items-center justify-center transition-all ${
                  wishlisted ? 'bg-white border-[#C8A97E] text-[#C8A97E]' : 'bg-white text-[#CCC] hover:border-[#C8A97E] hover:text-[#C8A97E]'
                }`}
              >
                <Heart size={20} fill={wishlisted ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mb-12 py-6 border-y border-[#F0F0F0]">
              {[{ icon: Truck, label: "Expedited" }, { icon: Shield, label: "Secure" }, { icon: Clock, label: "Fresh" }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2">
                  <Icon size={18} className="text-[#C8A97E]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#999]">{label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-[#666] text-sm leading-relaxed font-medium italic">
              {(product as Product & { description?: string }).description ||
                `Our ${product.name} represents the pinnacle of quality in our collection. Sourced sustainably and handled with utmost precision to ensure excellence from our pantry to your table.`}
            </p>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 pt-16 border-t border-[#EEE]">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-black text-[#2C2C2C] uppercase tracking-tight">You May Also Like</h2>
              <Link href="/shop" className="text-[11px] font-black text-[#C8A97E] uppercase tracking-widest hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
