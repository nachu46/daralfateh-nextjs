"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Ensure cart is cleared upon reaching success
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-[#F7F3EF] min-h-screen flex items-center justify-center py-20 px-6">
      <div className="max-w-xl w-full bg-white p-12 text-center border border-[#EAEAEA] shadow-[0_40px_120px_rgba(0,0,0,0.06)] relative overflow-hidden">
        {/* Boutique Decorative Background Element */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[#F7F3EF] rounded-full opacity-50" />
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-10 border border-[#C8E6C9] animate-in zoom-in duration-700">
            <CheckCircle className="text-emerald-500" size={48} strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl font-bold text-[#2C2C2C] uppercase tracking-tighter mb-6">
            Pantry Synchronized ✧
          </h1>
          
          <div className="space-y-6 mb-12">
            <p className="text-[11px] font-black text-[#C8A97E] uppercase tracking-[0.4em]">
              Order Successfully Placed
            </p>
            <p className="text-[#666] text-sm leading-relaxed max-w-sm mx-auto">
              Your selection has been securely confirmed in our Odoo 18 system. You will receive a bespoke confirmation email shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Link 
              href="/shop" 
              className="bg-[#C8A97E] text-white py-6 rounded-none font-black text-[11px] uppercase tracking-[0.4em] hover:bg-[#111] transition-all flex items-center justify-center gap-4 shadow-xl group"
            >
              Continue Boutique Journey
              <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/" 
              className="text-[10px] font-black text-[#AAA] uppercase tracking-[0.3em] py-4 hover:text-[#2C2C2C] transition-colors"
            >
              Return to Gallery
            </Link>
          </div>

          <div className="mt-16 pt-10 border-t border-[#F5F5F5]">
            <p className="text-[9px] text-[#CCC] font-bold uppercase tracking-[0.3em] leading-relaxed">
              Order Managed Natively by Odoo 18 <br/> 
              ✧ Dar Al Fateh Luxury Pantry ✧
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
