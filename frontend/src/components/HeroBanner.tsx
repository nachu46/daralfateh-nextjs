import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="container mx-auto px-6 max-w-[1500px] mt-6 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Main Hero - Large */}
        <div className="md:col-span-2 relative overflow-hidden rounded-[24px] bg-[#2C2C2C] min-h-[420px] flex items-end group">
          <img
            src="https://dar-al-fateh.odoo.com/web/image/website.s_cover_default_image"
            alt="Dar Al Fateh Premium"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
          />
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
          <div className="relative overflow-hidden rounded-[24px] bg-[#F7F3EF] flex-1 min-h-[200px] group flex items-end">
            <img
              src="https://dar-al-fateh.odoo.com/web/image/website.s_carousel_default_image_1"
              alt="Organic Selection"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 via-transparent" />
            <div className="relative z-10 p-6">
              <p className="text-white font-black text-[11px] uppercase tracking-widest mb-1 text-[#C8A97E] drop-shadow-md">Organic</p>
              <p className="text-white font-black text-lg leading-tight drop-shadow-md">Premium Quality</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[24px] bg-[#EEE8E0] flex-1 min-h-[200px] group flex items-end">
            <img
              src="https://dar-al-fateh.odoo.com/web/image/website.s_carousel_default_image_3"
              alt="Fresh Arrivals"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 via-transparent" />
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
