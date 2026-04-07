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
  return (
    <section className="container mx-auto px-6 max-w-[1500px] mb-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[11px] font-black text-[#C8A97E] uppercase tracking-[0.3em] mb-2">Shop By</p>
          <h2 className="text-3xl font-black text-[#2C2C2C] tracking-tight">Category</h2>
        </div>
        <Link href="/shop" className="text-[11px] font-black text-[#999] uppercase tracking-widest hover:text-[#C8A97E] transition-colors">
          Browse All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category_id=${cat.id}`}
            className="group relative overflow-hidden rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 block"
            style={{ aspectRatio: '3/4' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cat.image_url}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-black text-[12px] uppercase tracking-widest leading-tight">
                {cat.name}
              </p>
            </div>
            {/* Accent border on hover */}
            <div className="absolute inset-0 border-2 border-[#C8A97E] rounded-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}
