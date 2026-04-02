import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";

// Dummy data to visualize the UI before tying up with Odoo
const dummyProducts = [
  { id: 1, name: "Organic Hass Avocados (Pack of 3)", price: 24.50, category: [{ id: 1, name: "Fresh Fruits" }], image_url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=600" },
  { id: 2, name: "Fresh Atlantic Salmon Fillet", price: 89.00, category: [{ id: 1, name: "Seafood" }], image_url: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=600" },
  { id: 3, name: "Artisan Sourdough Loaf", price: 18.00, category: [{ id: 1, name: "Bakery" }], image_url: "https://images.unsplash.com/photo-1585478259715-ddc2a969f6bb?auto=format&fit=crop&q=80&w=600" },
  { id: 4, name: "Organic Cherry Tomatoes 500g", price: 12.00, category: [{ id: 1, name: "Fresh Produce" }], image_url: "https://images.unsplash.com/photo-1506154674744-8cb3897ea8d9?auto=format&fit=crop&q=80&w=600" },
  { id: 5, name: "Free Range Large Brown Eggs (12 pcs)", price: 15.75, category: [{ id: 1, name: "Dairy & Eggs" }], image_url: "https://images.unsplash.com/photo-1587486913049-53cb889f412d?auto=format&fit=crop&q=80&w=600" },
  { id: 6, name: "Premium Angus Ribeye Steak", price: 115.00, category: [{ id: 1, name: "Meat & Poultry" }], image_url: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=600" },
  { id: 7, name: "Almond Milk Unsweetened 1L", price: 14.50, category: [{ id: 1, name: "Dairy Alternatives" }], image_url: "https://images.unsplash.com/photo-1628183185340-e291244e883e?auto=format&fit=crop&q=80&w=600" },
  { id: 8, name: "Organic Honeycrisp Apples (1kg)", price: 21.00, category: [{ id: 1, name: "Fresh Fruits" }], image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6fd6e?auto=format&fit=crop&q=80&w=600" },
];

export default function Home() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      
      <section className="container mx-auto px-4 max-w-7xl mb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Bestsellers</h2>
            <p className="text-slate-500 font-medium md:text-lg">Top picks selected just for you</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {dummyProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="container mx-auto px-4 max-w-7xl mb-16">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden relative flex items-center shadow-xl">
          <div className="absolute right-0 bottom-0 opacity-10 blur-3xl w-full h-full bg-[var(--color-brand-green)] rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Get Delivery in Minutes</h2>
            <p className="text-emerald-100/80 text-lg mb-8">Try Dar Al Fateh Plus for free delivery on all orders, exclusive discounts, and priority support.</p>
            <button className="bg-[var(--color-brand-green)] text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform active:scale-95">
              Start Free Trial
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
