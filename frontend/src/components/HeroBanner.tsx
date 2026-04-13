import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="container mx-auto px-6 max-w-[1500px] mt-6 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Main Hero - Large */}
        <div className="md:col-span-2 relative overflow-hidden rounded-[24px] min-h-[420px] flex items-end group"
          style={{ 
            backgroundImage: `linear-gradient(135deg, rgba(44,44,44,0.7) 0%, rgba(61,50,40,0.6) 40%, rgba(26,26,26,0.9) 100%), url('https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
          {/* Decorative circles for depth */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #C8A97E, transparent)' }} />
          <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #C8A97E, transparent)' }} />

          <div className="relative z-10 p-10">
            <p className="text-[#C8A97E] text-[11px] font-black uppercase tracking-[0.65em] mb-4">
              Premium Selection
            </p>
            <h2 className="text-white text-4xl md:text-6xl font-extrabold leading-[1] tracking-tighter mb-8 max-w-sm drop-shadow-2xl">
              Farm-Fresh Daily Deliveries
            </h2>
            <Link
              href="/shop"
              className="inline-flex items-center gap-4 bg-white text-[#2C2C2C] font-black text-[11px] uppercase tracking-[0.45em] px-10 py-5 rounded-none hover:bg-[#C8A97E] hover:text-white transition-all shadow-2xl group"
            >
              Shop Selection
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Side Banners */}
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-[24px] flex-1 min-h-[200px] group flex items-end"
            style={{ 
              backgroundImage: `linear-gradient(135deg, rgba(61,90,62,0.75) 0%, rgba(44,74,45,0.95) 100%), url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #C8A97E, transparent)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent" />
            <div className="relative z-10 p-6">
              <p className="font-black text-[11px] uppercase tracking-widest mb-1 text-[#C8A97E] drop-shadow-md">Organic</p>
              <p className="text-white font-black text-lg leading-tight drop-shadow-md">Premium Quality</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[24px] flex-1 min-h-[200px] group flex items-end"
            style={{ 
              backgroundImage: `linear-gradient(135deg, rgba(74,55,40,0.75) 0%, rgba(44,32,24,0.95) 100%), url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #C8A97E, transparent)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent" />
            <div className="relative z-10 p-6">
              <p className="font-black text-[11px] uppercase tracking-widest mb-1 text-[#C8A97E] drop-shadow-md">Fresh</p>
              <p className="text-white font-black text-lg leading-tight drop-shadow-md">New Arrivals</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
