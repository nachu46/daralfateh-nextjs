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
        <div className="p-8 border-b border-[#EAEAEA] bg-white flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-[11px] font-black text-[#C8A97E] uppercase tracking-[0.4em] leading-none mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>
              Selection
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-[#2C2C2C] uppercase tracking-tighter">Current Pantry</span>
              <span className="bg-[#F7F3EF] text-[#2C2C2C] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                {items.reduce((acc, item) => acc + item.quantity, 0)} Items
              </span>
            </div>
          </div>
          <button 
            onClick={closeCart}
            className="w-12 h-12 rounded-full hover:bg-[#F7F3EF] flex items-center justify-center transition-all duration-300 text-[#CCC] hover:text-[#2C2C2C] hover:rotate-90"
          >
            <X size={22} strokeWidth={1} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {items.length === 0 ? (
            <EmptyCart isDrawer />
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-6 group animate-in slide-in-from-right-8 duration-500">
                <div className="w-20 h-20 bg-white rounded-none p-3 flex-shrink-0 border border-[#F0F0F0] shadow-sm overflow-hidden flex items-center justify-center relative">
                  <img src={item.image_url!} alt={item.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-[11px] font-black text-[#2C2C2C] uppercase tracking-[0.1em] leading-tight mb-2 line-clamp-1" style={{ fontFamily: 'var(--font-outfit)' }}>{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-[#C8A97E] uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-outfit)' }}>AED {item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-[#F7F3EF] px-2 py-0.5 rounded-none border border-[#EAEAEA]">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-[#AAA] hover:text-[#C8A97E] transition-colors"
                        >
                          <Minus size={10} strokeWidth={4} />
                        </button>
                        <span className="text-[10px] font-black text-[#2C2C2C] w-3 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-[#AAA] hover:text-[#C8A97E] transition-colors"
                        >
                          <Plus size={10} strokeWidth={4} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[#CCC] hover:text-[#2C2C2C] transition-colors p-1"
                      >
                        <X size={14} />
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
          <div className="p-10 bg-white border-t border-[#EAEAEA] space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-[#999] text-[10px] font-black uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-outfit)' }}>
                <span>Sub-Total</span>
                <span className="text-[#2C2C2C]">AED {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#999] text-[10px] font-black uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-outfit)' }}>
                <span>Bespoke Delivery</span>
                <span className="text-emerald-500">Complimentary</span>
              </div>
              <div className="flex justify-between items-end pt-6 border-t border-[#F5F5F5]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.3em] mb-1" style={{ fontFamily: 'var(--font-outfit)' }}>Order Total</span>
                  <span className="text-2xl font-bold text-[#2C2C2C] uppercase tracking-tighter">AED {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#C8A97E] text-white py-6 rounded-none font-black text-[11px] uppercase tracking-[0.4em] hover:bg-[#111] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-[0.99] disabled:bg-[#CCC]"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Complete Selection
                <ArrowRight size={14} strokeWidth={3} />
              </button>
              <Link 
                href="/cart" 
                onClick={closeCart}
                className="block text-center text-[10px] font-black text-[#AAA] uppercase tracking-[0.2em] hover:text-[#C8A97E] transition-colors"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Manage Full Pantry
              </Link>
            </div>
            
            <p className="text-[9px] text-center text-[#CCC] font-bold uppercase tracking-[0.3em] leading-relaxed">
              Securely bridged to Odoo 18
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
