import HeroBanner from "@/components/HeroBanner";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductCard from "@/components/ProductCard";
import Link from 'next/link';
import { fetchProducts, fetchCategories, getCategoryImageUrl } from '@/lib/odoo';

export const revalidate = 60;

export default async function Home() {
  // Fetch ONLY real Odoo data — no fallback demo data
  const [products, cats] = await Promise.all([
    fetchProducts({ limit: 10 }),
    fetchCategories(),
  ]);

  const displayCategories = cats.slice(0, 6).map(c => ({
    id: c.id,
    name: c.name,
    image_url: getCategoryImageUrl(c.id),
  }));

  return (
    <>
      <HeroBanner />
      {/* Categories from Odoo */}
      {displayCategories.length > 0 && (
        <FeaturedCategories categories={displayCategories} />
      )}

      {/* Best Sellers — only real Odoo products */}
      <section className="container mx-auto px-6 max-w-[1500px] mb-20">
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-[#EAEAEA]">
          <div>
            <p className="text-[11px] font-black text-[#C8A97E] uppercase tracking-[0.3em] mb-2">Handpicked</p>
            <h2 className="text-3xl font-black text-[#2C2C2C] tracking-tight">Best Sellers</h2>
          </div>
          <Link href="/shop" className="text-[11px] font-black text-[#999] uppercase tracking-widest hover:text-[#C8A97E] transition-colors">
            View All →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[20px] border border-[#EEE]">
            <p className="text-[#999] font-bold uppercase tracking-widest text-sm">No products available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </>
  );
}
