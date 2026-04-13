"use client";

import { useCartStore } from "@/store/useCartStore";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import EmptyCart from "@/components/EmptyCart";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  // FIX: Reactive total amount calculation using useMemo
  const totalAmount = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [items]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#F7F3EF] min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* Page Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/shop" className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.3em] flex items-center gap-1.5 hover:translate-x-[-4px] transition-transform">
              <ChevronLeft size={14} />
              Continue Shopping
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] uppercase tracking-tighter mb-4">
            Your Selection
          </h1>
          <p className="text-[11px] font-bold text-[#AAA] uppercase tracking-[0.3em]">
            Quality items synchronizing with our Odoo 18 Pantry
          </p>
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left side: Cart Items or Checkout Form */}
            <div className="lg:col-span-8 space-y-8">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-none border border-[#EAEAEA] shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-8 group">
                  <div className="w-full md:w-40 h-40 bg-[#F9F9F9] p-4 flex items-center justify-center flex-shrink-0">
                    <img src={item.image_url!} alt={item.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.3em] mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {item.category[0]?.name || 'Pantry Item'}
                    </div>
                    <h3 className="text-xl font-bold text-[#2C2C2C] uppercase tracking-tighter mb-4 leading-tight">{item.name}</h3>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F5F5F5]">
                      <div className="text-lg font-bold text-[#2C2C2C]">AED {item.price.toFixed(2)}</div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 bg-[#F7F3EF] px-3 py-1.5 border border-[#EAEAEA]">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[#AAA] hover:text-[#C8A97E] transition-colors"><Minus size={14} strokeWidth={3} /></button>
                          <span className="text-[12px] font-black text-[#2C2C2C] w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#AAA] hover:text-[#C8A97E] transition-colors"><Plus size={14} strokeWidth={3} /></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-[#CCC] hover:text-[#2C2C2C] transition-colors p-2"><Trash2 size={18} strokeWidth={1.5} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Order Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <div className="bg-white p-10 border border-[#EAEAEA] shadow-[0_20px_80px_rgba(0,0,0,0.06)] space-y-10">
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black text-[#C8A97E] uppercase tracking-[0.4em]" style={{ fontFamily: 'var(--font-outfit)' }}>Order Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-[#999] text-[10px] font-black uppercase tracking-[0.3em]">
                      <span>Subtotal</span>
                      <span className="text-[#2C2C2C]">AED {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#999] text-[10px] font-black uppercase tracking-[0.3em]">
                      <span>Shipping</span>
                      <span className="text-[#C8A97E] font-bold">Free</span>
                    </div>
                    <div className="flex justify-between items-end pt-8 border-t border-[#F5F5F5]">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.3em] mb-1">Total Amount</span>
                        <span className="text-3xl font-bold text-[#2C2C2C] uppercase tracking-tighter">AED {totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-10">
                  <Link 
                    href="/checkout"
                    className="w-full bg-[#C8A97E] text-white py-6 rounded-none font-black text-[11px] uppercase tracking-[0.4em] hover:bg-[#111] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-[0.99] group"
                  >
                    Continue to Checkout
                    <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="pt-10 border-t border-[#F5F5F5]">
                  <p className="text-[10px] font-black text-[#CCC] uppercase tracking-[0.2em] leading-relaxed mb-6">
                    Professional payments handled securely by Odoo 18. We accept Visa, Mastercard, and Apple Pay via bridged portal.
                  </p>
                  <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
