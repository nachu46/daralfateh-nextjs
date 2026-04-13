"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import EmptyCart from "@/components/EmptyCart";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  
  // FIX: Reactive total amount calculation using useMemo for stability
  const totalAmount = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [items]);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCheckout = () => {
    closeCart();
    router.push("/cart");
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-[#F7F3EF] z-[101] shadow-[-20px_0_100px_rgba(0,0,0,0.06)] transform transition-transform duration-700 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-10 border-b border-[#EAEAEA] bg-white flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.5em] leading-none mb-1">
              Pantry Selection
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-[#2C2C2C] uppercase tracking-tighter">
                Your Bouquet
              </span>
              <span className="bg-[#F7F3EF] text-[#C8A97E] text-[9px] font-black px-3 py-1 rounded-none uppercase tracking-[0.2em]">
                {items.reduce((acc, item) => acc + item.quantity, 0)} Items
              </span>
            </div>
          </div>
          <button 
            onClick={closeCart}
            className="w-10 h-10 rounded-none border border-[#F0F0F0] hover:bg-[#F7F3EF] flex items-center justify-center transition-all duration-500 text-[#CCC] hover:text-[#C8A97E] group"
          >
            <X size={18} strokeWidth={1} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-white/50">
          {items.length === 0 ? (
            <EmptyCart isDrawer />
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-8 group animate-in slide-in-from-right-8 duration-700">
                <div className="w-24 h-24 bg-white rounded-none p-4 flex-shrink-0 border border-[#F5F5F5] shadow-sm overflow-hidden flex items-center justify-center relative">
                  <img src={item.image_url!} alt={item.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110" />
                </div>
                <div className="flex-1 flex flex-col justify-center gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-[13px] font-black text-[#2C2C2C] uppercase tracking-[0.1em] leading-tight line-clamp-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {item.name}
                    </h3>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-[#DDD] hover:text-[#F87171] transition-colors p-1"
                    >
                      <Trash2 size={12} strokeWidth={2} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-bold text-[#C8A97E] uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-outfit)' }}>
                      AED {item.price.toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-6 bg-[#F7F3EF] px-3 py-1 border border-[#F0F0F0]">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-[#AAA] hover:text-[#C8A97E] transition-colors"
                      >
                        <Minus size={10} strokeWidth={3} />
                      </button>
                      <span className="text-[11px] font-black text-[#2C2C2C] w-4 text-center" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-[#AAA] hover:text-[#C8A97E] transition-colors"
                      >
                        <Plus size={10} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-10 bg-white border-t border-[#EAEAEA] space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between text-[#AAA] text-[10px] font-black uppercase tracking-[0.4em]" style={{ fontFamily: 'var(--font-outfit)' }}>
                <span>Sub-Total</span>
                <span className="text-[#2C2C2C]">AED {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#AAA] text-[10px] font-black uppercase tracking-[0.4em]" style={{ fontFamily: 'var(--font-outfit)' }}>
                <span>Shipping</span>
                <span className="text-[#C8A97E] font-bold">Free</span>
              </div>
              
              <div className="pt-8 border-t border-[#F5F5F5] flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.5em] mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>Total Selection</span>
                  <span className="text-3xl font-black text-[#2C2C2C] uppercase tracking-tighter" style={{ fontFamily: 'var(--font-outfit)' }}>AED {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#C8A97E] text-white py-6 rounded-none font-black text-[12px] uppercase tracking-[0.5em] hover:bg-[#111] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-[0.99] group shadow-[#C8A97E]/20"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Secure Portal
                <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link 
                href="/cart" 
                onClick={closeCart}
                className="block text-center text-[10px] font-black text-[#CCC] uppercase tracking-[0.3em] hover:text-[#C8A97E] transition-all"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Refine Selection →
              </Link>
            </div>
            
            <p className="text-[8px] text-center text-[#DDD] font-bold uppercase tracking-[0.4em] leading-relaxed">
              Odoo 18 Bridged Selection
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EAEAEA;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #C8A97E;
        }
      `}</style>
    </>
  );
}
