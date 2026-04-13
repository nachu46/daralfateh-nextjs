"use client";

import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  image_url: string;
}

interface Props {
  categories: Category[];
}

export default function FeaturedCategories({ categories }: Props) {
  // Predefined premium fallbacks for a luxury look
  const fallbacks = [
    '/categories/organic_fruits.png',
    '/categories/fresh_vegetables.png',
    '/categories/premium_dates.png',
    '/categories/exotic_spices.png',
  ];

  return (
    <section className="container mx-auto px-6 max-w-[1500px] mb-16">
      <div className="flex items-end justify-between mb-10 pb-4 border-b border-[#EAEAEA]">
        <div>
          <p className="text-[11px] font-black text-[#C8A97E] uppercase tracking-[0.4em] mb-2">Shop By</p>
          <h2 className="text-4xl font-black text-[#2C2C2C] uppercase tracking-tighter">Category</h2>
        </div>
        <Link href="/shop" className="text-[11px] font-black text-[#999] uppercase tracking-[0.2em] hover:text-[#C8A97E] transition-colors">
          Browse All →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <Link
            key={cat.id}
            href={`/shop?category_id=${cat.id}`}
            className="group relative overflow-hidden rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-700 block bg-[#F7F3EF]"
            style={{ aspectRatio: '3/4' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cat.image_url || fallbacks[index % fallbacks.length]}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (!img.src.includes('categories/')) {
                  img.src = fallbacks[index % fallbacks.length];
                }
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-white font-black text-[15px] uppercase tracking-[0.35em] leading-tight mb-3 drop-shadow-lg">
                {cat.name}
              </p>
              <div className="w-8 h-[2px] bg-[#C8A97E] transition-all duration-700 group-hover:w-16" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
