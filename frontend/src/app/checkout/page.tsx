import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 max-w-3xl py-12">
      <Link href="/cart" className="text-[var(--color-brand-green)] flex items-center gap-2 mb-8 font-bold hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>
      
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 bg-[var(--color-brand-green-light)] text-[var(--color-brand-green-hover)] rounded-full flex items-center justify-center font-bold">1</div>
          <h2 className="text-2xl font-extrabold text-slate-900">Delivery Address</h2>
        </div>
        
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
              <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] bg-slate-50" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
              <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] bg-slate-50" placeholder="Doe" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
            <input type="tel" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] bg-slate-50" placeholder="+971 50 123 4567" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Apartment / Villa Number</label>
            <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] bg-slate-50" placeholder="Apt 101" />
          </div>
          
          <div className="pt-6 border-t border-slate-100 mt-8 mb-8 flex items-center gap-3 pb-6">
            <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center font-bold">2</div>
            <h2 className="text-2xl font-extrabold text-slate-400">Payment</h2>
          </div>
          
          <button type="button" className="w-full bg-[var(--color-brand-green)] text-white py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 hover:bg-[var(--color-brand-green-hover)] transition-colors shadow-lg shadow-emerald-500/20 active:scale-95">
            <CheckCircle className="w-5 h-5" /> Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
