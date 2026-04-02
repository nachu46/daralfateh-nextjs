import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative bg-[var(--color-brand-green-light)] overflow-hidden rounded-3xl mx-4 mt-6 mb-12 md:mx-auto container max-w-7xl h-[320px] md:h-[480px]">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-green)]/15 to-transparent"></div>
      
      {/* Decorative blobs for modern organic feel */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-[var(--color-brand-green-hover)]/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[30%] h-[60%] bg-[var(--color-brand-green)]/10 blur-3xl rounded-full"></div>

      <div className="relative h-full flex flex-col justify-center px-8 md:px-20 w-full md:w-3/4 lg:w-1/2 z-10">
        <span className="bg-white/90 backdrop-blur-sm text-[var(--color-brand-green-hover)] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] py-1.5 px-4 rounded-full w-fit mb-6 shadow-sm">
          Fresh Arrival
        </span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.15] tracking-tight">
          Premium Groceries Delivered Fresh
        </h1>
        <p className="text-slate-700 md:text-lg mb-8 max-w-md font-medium leading-relaxed">
          Discover a curated selection of organic produce, dairy, and everyday essentials straight to your door.
        </p>
        <Link href="/shop" className="group bg-[var(--color-brand-green)] text-white px-8 py-3.5 rounded-full w-max text-sm font-bold tracking-wider hover:bg-[var(--color-brand-green-hover)] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-[var(--color-brand-green)]/30 flex items-center gap-2">
          Start Shopping
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div >
  );
}
