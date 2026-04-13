"use client";

import { useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { CheckCircle2, Package, ArrowRight, Hash } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#F7F3EF] min-h-[80vh] flex flex-col justify-center items-center text-[#2C2C2C]">
        <p className="animate-pulse font-black uppercase tracking-[0.4em] text-[#C8A97E]">Loading Confirmation...</p>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderName = searchParams.get('orderName');
  const clearCart = useCartStore(state => state.clearCart);
  const hasCleared = useRef(false);

  useEffect(() => {
    // Clear cart on mount exactly once 
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  return (
    <div className="bg-[#F7F3EF] min-h-[80vh] flex flex-col justify-center items-center relative overflow-hidden px-6">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8A97E] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="relative z-10 bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-16 max-w-[600px] w-full text-center shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-[#EAEAEA]">
        
        <div className="w-20 h-20 md:w-24 md:h-24 bg-[#C8A97E]/20 text-[#C8A97E] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#C8A97E]/30 relative">
          <div className="absolute inset-0 bg-[#C8A97E] rounded-full animate-ping opacity-20" />
          <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" strokeWidth={2.5} />
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C8A97E] mb-3">
          Order Confirmed
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2C2C2C] uppercase tracking-tight leading-[1.1] mb-6">
          Thank you for<br />your purchase
        </h1>

        <p className="text-[15px] font-medium text-[#AAA] max-w-md mx-auto leading-relaxed mb-10">
          Your secure payment was successfully processed. A perfectly curated selection of premium produce will soon be dispatched to your delivery address.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-[#F7F3EF] rounded-2xl p-6 border border-[#EAEAEA] flex items-center gap-4 text-left">
            <Hash size={24} className="text-[#C8A97E]" />
            <div>
              <p className="text-[11px] font-bold text-[#888] uppercase tracking-widest mb-1">Order ID</p>
              <p className="text-[14px] font-black text-[#2C2C2C] uppercase tracking-wider">{orderName || 'Processing...'}</p>
            </div>
          </div>
          <div className="bg-[#F7F3EF] rounded-2xl p-6 border border-[#EAEAEA] flex items-center gap-4 text-left">
            <Package size={24} className="text-[#C8A97E]" />
            <div>
              <p className="text-[11px] font-bold text-[#888] uppercase tracking-widest mb-1">Status</p>
              <p className="text-[14px] font-black text-[#2C2C2C] uppercase tracking-wider">Confirmed</p>
            </div>
          </div>
        </div>

        <Link 
          href="/shop"
          className="inline-flex items-center gap-3 bg-[#2C2C2C] text-white px-10 py-5 rounded-full text-[12px] font-black uppercase tracking-[0.2em] hover:bg-[#C8A97E] transition-all group shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
        >
          Continue Shopping
          <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
