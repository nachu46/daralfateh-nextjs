"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-[#F7F3EF] min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white p-12 text-center border border-[#EAEAEA] shadow-[0_40px_120px_rgba(0,0,0,0.06)] relative overflow-hidden group">
        {/* Subtle Decorative Element */}
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-[#F7F3EF] rounded-full opacity-50 transition-transform duration-1000 group-hover:scale-110" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 border border-[#C8A97E] rounded-full flex items-center justify-center mx-auto mb-10 transition-transform duration-700 hover:rotate-12">
            <Compass className="text-[#C8A97E]" size={36} strokeWidth={1} />
          </div>

          <h1 className="text-5xl font-bold text-[#2C2C2C] uppercase tracking-tighter mb-4">
            404
          </h1>
          
          <div className="space-y-4 mb-10">
            <h2 className="text-[11px] font-black text-[#C8A97E] uppercase tracking-[0.4em]">Selection Not Found</h2>
            <p className="text-[#999] text-sm leading-relaxed max-w-sm mx-auto">
              It seems you’ve ventured into an uncharted corner of our boutique. Let us guide you back to the collection.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link 
              href="/" 
              className="w-full bg-[#C8A97E] text-white py-5 rounded-none font-black text-[11px] uppercase tracking-[0.4em] hover:bg-[#111] transition-all flex items-center justify-center gap-4 shadow-xl group"
            >
              <ArrowLeft size={16} strokeWidth={3} className="group-hover:translate-x-[-4px] transition-transform" />
              Return to Gallery
            </Link>
          </div>
          
          <div className="mt-16 pt-8 border-t border-[#F5F5F5]">
            <p className="text-[9px] text-[#CCC] font-bold uppercase tracking-[0.3em]">
              Dar Al Fateh Luxury Pantry
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
