"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalAmount } = useCartStore();
  
  // To avoid hydration mismatch when using localStorage persistence
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900 tracking-tight">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Your cart is empty</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover fresh products in our shop.</p>
          <Link href="/shop" className="bg-[var(--color-brand-green)] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform active:scale-95 inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="flex-[0.65] flex flex-col gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] rounded-3xl p-4 md:p-6 flex items-center gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-2xl flex items-center justify-center p-2">
                  <img src={item.image_url!} alt={item.name} className="object-contain w-full h-full mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-500 font-bold tracking-wider uppercase mb-1">{item.category[0]?.name}</div>
                  <h3 className="font-bold text-slate-800 lg:text-lg mb-2 line-clamp-2 md:line-clamp-1">{item.name}</h3>
                  <div className="font-extrabold text-[var(--color-brand-green-hover)] text-lg">AED {item.price.toFixed(2)}</div>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-full border border-slate-200">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-[var(--color-brand-green)] border border-slate-200 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-4 text-center font-bold text-slate-700">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-[var(--color-brand-green)] border border-slate-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors text-sm font-medium flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> <span className="hidden md:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="flex-[0.35]">
            <div className="bg-slate-50 rounded-3xl p-6 lg:p-8 sticky top-24 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
              
              <div className="flex flex-col gap-4 mb-6 text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800">AED {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-600 font-bold">Free</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-lg mt-2">
                  <span className="text-slate-900 font-bold">Total</span>
                  <span className="text-2xl font-extrabold text-[var(--color-brand-green-hover)]">AED {totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <Link href="/checkout" className="w-full bg-[var(--color-brand-green)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-brand-green-hover)] transition-colors shadow-lg shadow-emerald-500/20 active:scale-95 group">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <p className="text-xs text-center text-slate-500 mt-6 display-flex flex-col gap-1">
                <span className="block font-medium">Secure Payments by Odoo</span>
                <span>We accept Visa, Mastercard, and Apple Pay</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
