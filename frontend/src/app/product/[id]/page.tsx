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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<number, number>>({});
  const [currentVariant, setCurrentVariant] = useState<any>(null);
  const addItem = useCartStore(state => state.addItem);
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/product/${id}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && data.id) {
            setProduct(data);
            
            // Initialize selected attributes from the default variant
            if (data.variants && data.variants.length > 0) {
              const initialVariant = data.variants.find((v: any) => v.id === Number(id)) || data.variants[0];
              setCurrentVariant(initialVariant);
              
              const initialAttrs: Record<number, number> = {};
              data.attributes?.forEach((attr: any) => {
                const val = attr.values.find((v: any) => initialVariant.attribute_value_ids.includes(v.id));
                if (val) initialAttrs[attr.id] = val.id;
              });
              setSelectedAttributes(initialAttrs);
            }

            const catId = data.category[0]?.id;
            if (catId) {
              fetch(`/api/products?category_id=${catId}&limit=5`)
                .then(r => r.json())
                .then(list => {
                  if (Array.isArray(list)) setRelated(list.filter((p: Product) => p.id !== data.id).slice(0, 4));
                }).catch(() => {});
            }
            // Initialize main image
            setSelectedImage(data.image_url);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [params]);

  // Update current variant when selected attributes change
  useEffect(() => {
    if (!product?.variants) return;
    const selectedIds = Object.values(selectedAttributes);
    const variant = product.variants.find(v => 
      v.attribute_value_ids.length === selectedIds.length && 
      v.attribute_value_ids.every(id => selectedIds.includes(id))
    );
    if (variant) setCurrentVariant(variant);
  }, [selectedAttributes, product?.variants]);

  const handleAttributeSelect = (attrId: number, valueId: number) => {
    setSelectedAttributes(prev => ({ ...prev, [attrId]: valueId }));
  };

  const handleAddToCart = () => {
    if (!product || !currentVariant) return;
    const variantToStore = { ...product, id: currentVariant.id, price: currentVariant.price };
    for (let i = 0; i < quantity; i++) addItem(variantToStore);
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
          <div className="flex flex-col gap-6">
            <div className="relative">
              <div className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden aspect-square flex items-center justify-center p-10 group">
                <img
                  src={selectedImage || product.image_url || '/api/product-image/0'}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/api/product-image/0';
                  }}
                />
              </div>
            </div>

            {/* Thumbnails */}
            {product.extra_images && product.extra_images.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                <button 
                  onClick={() => setSelectedImage(product.image_url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all p-2 bg-white ${
                    selectedImage === product.image_url || !selectedImage ? 'border-[#C8A97E] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={product.image_url || ''} className="w-full h-full object-contain" />
                </button>
                {product.extra_images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all p-2 bg-white ${
                      selectedImage === img ? 'border-[#C8A97E] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
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
              <span className="text-4xl font-extrabold text-[#2C2C2C]">AED {(currentVariant?.price || product.price || 0).toFixed(2)}</span>
              <div className="flex flex-col">
                <span className="text-sm text-[#AAA] line-through font-bold">AED {((currentVariant?.price || product.price) * 1.25).toFixed(2)}</span>
                <span className="text-[10px] font-black text-[#C8A97E] uppercase tracking-wider">
                  Save AED {((currentVariant?.price || product.price) * 0.25).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Variants / Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="space-y-8 mb-10">
                {product.attributes.map((attr) => (
                  <div key={attr.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-[#2C2C2C] uppercase tracking-[0.2em]">{attr.name}:</span>
                      <span className="text-[11px] font-bold text-[#C8A97E]">
                        {attr.values.find(v => v.id === selectedAttributes[attr.id])?.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {attr.values.map((val) => {
                        const isSelected = selectedAttributes[attr.id] === val.id;
                        return (
                          <button
                            key={val.id}
                            onClick={() => handleAttributeSelect(attr.id, val.id)}
                            className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest border transition-all ${
                              isSelected
                                ? 'bg-[#2C2C2C] border-[#2C2C2C] text-white'
                                : 'bg-white border-[#EEE] text-[#999] hover:border-[#C8A97E] hover:text-[#C8A97E]'
                            }`}
                          >
                            {val.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="w-full h-px bg-[#EEE] mb-10" />

            {/* Quantity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mb-10">
              <span className="text-[11px] font-black text-[#2C2C2C] uppercase tracking-[0.2em]">Quantity:</span>
              <div className="flex items-center gap-6 bg-white border border-[#EEE] rounded-full px-6 py-2 shadow-sm">
                <button onClick={() => setQuantity((q: number) => Math.max(1, q - 1))} className="text-[#DDD] hover:text-[#C8A97E] transition-colors">
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span className="w-4 text-center font-bold text-[#2C2C2C]">{quantity}</span>
                <button onClick={() => setQuantity((q: number) => q + 1)} className="text-[#DDD] hover:text-[#C8A97E] transition-colors">
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4 mb-10">
              <h4 className="text-[11px] font-black text-[#2C2C2C] uppercase tracking-[0.2em]">Product Details</h4>
              <div className="prose prose-sm max-w-none text-[#666] leading-relaxed font-medium italic">
                {product.ecommerce_description ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: product.ecommerce_description }} 
                    className="odoo-description"
                  />
                ) : product.website_description ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: product.website_description }} 
                    className="odoo-description"
                  />
                ) : (
                  <p>
                    {product.description || product.internal_description ||
                      `Our ${product.name} represents the pinnacle of quality in our collection. Sourced sustainably and handled with utmost precision to ensure excellence from our pantry to your table.`}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full py-5 rounded-none font-black text-[12px] uppercase tracking-[0.45em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 shadow-[#C8A97E]/10 ${
                  added ? 'bg-black text-white' : 'bg-[#2C2C2C] text-white hover:bg-[#C8A97E]'
                }`}
              >
                {added ? <><Check size={18} strokeWidth={4} /> Added!</> : <><ShoppingBag size={18} strokeWidth={2} /> Add to Selection</>}
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
