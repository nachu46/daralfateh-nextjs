import { Apple, Croissant, Milk, Wheat, Fish, Cookie, Beef, Bean } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Fresh Fruits', icon: Apple, color: 'bg-red-50 text-red-600 border-red-100' },
  { name: 'Bakery', icon: Croissant, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { name: 'Dairy & Eggs', icon: Milk, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { name: 'Meat & Poultry', icon: Beef, color: 'bg-rose-50 text-rose-700 border-rose-100' },
  { name: 'Seafood', icon: Fish, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
  { name: 'Grains & Pasta', icon: Wheat, color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
  { name: 'Snacks', icon: Cookie, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { name: 'Legumes', icon: Bean, color: 'bg-stone-50 text-stone-600 border-stone-100' },
];

export default function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 py-8 mb-12 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Shop By Category</h2>
        <Link href="/categories" className="text-sm font-bold text-[var(--color-brand-green)] hover:underline hidden md:block">View All</Link>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
        {categories.map((cat, i) => (
          <Link href={`/category/${cat.name.toLowerCase()}`} key={i} className="flex flex-col items-center group">
            <div className={`w-[72px] h-[72px] md:w-28 md:h-28 rounded-3xl ${cat.color} border flex items-center justify-center mb-4 group-hover:scale-105 group-hover:shadow-md transition-all duration-300`}>
              <cat.icon className="w-8 h-8 md:w-12 md:h-12 opacity-90 group-hover:opacity-100 group-hover:animate-pulse" strokeWidth={1.5} />
            </div>
            <span className="text-xs md:text-sm font-semibold text-slate-700 text-center leading-tight group-hover:text-slate-900 transition-colors">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
