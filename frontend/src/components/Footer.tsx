import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'Fresh Fruits', href: '/shop?category_id=1' },
    { label: 'Vegetables', href: '/shop?category_id=2' },
    { label: 'Beverages', href: '/shop?category_id=3' },
    { label: 'Meat & Poultry', href: '/shop?category_id=4' },
    { label: 'Bakery', href: '/shop?category_id=5' },
  ],
  account: [
    { label: 'Login / Register', href: '/login' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Track My Order', href: '/track' },
  ],
  info: [
    { label: 'About Us', href: '/about' },
    { label: 'Delivery Information', href: '/delivery' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Contact Us', href: '/contact' },
  ]
};

export default function Footer() {
  return (
    <footer className="bg-[#EFE8E1] text-[#2C2C2C] mt-16 border-t border-[#EAEAEA]">
      {/* Newsletter Banner */}
      <div className="bg-[#C8A97E] py-8 px-4">
        <div className="container mx-auto max-w-[1500px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-extrabold text-xl md:text-2xl mb-1 tracking-tight">Join our Private Circle</h3>
            <p className="text-white/80 text-sm font-medium">Subscribe for exclusive updates and first access to new arrivals.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto relative">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 md:w-80 bg-white text-[#2C2C2C] text-sm px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white placeholder-[#999] shadow-sm italic"
            />
            <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#2C2C2C] text-white font-bold px-6 rounded-full hover:bg-[#1A1A1A] transition-colors whitespace-nowrap text-[11px] uppercase tracking-widest shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 max-w-[1500px] py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-8">
            <Link href="/" className="inline-flex flex-col mb-6 group">
              <span className="text-3xl font-black text-[#2C2C2C] leading-none tracking-[-0.03em] uppercase group-hover:text-[#C8A97E] transition-colors">
                Dar Al Fateh
              </span>
              <span className="text-[9px] font-bold text-[#C8A97E] tracking-[0.4em] mt-1.5 uppercase">International</span>
            </Link>
            <p className="text-[#666] text-sm leading-relaxed mb-8 max-w-sm">
              Your trusted purveyor of premium provisions. Curated selections delivered with unparalleled excellence across the UAE.
            </p>
            <div className="flex flex-col gap-3.5 text-sm text-[#555] font-medium">
              <a href="tel:+97145551234" className="flex items-center gap-3 hover:text-[#C8A97E] transition-colors">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Phone className="w-3.5 h-3.5 text-[#C8A97E]" />
                </div>
                +971 4 555 1234
              </a>
              <a href="mailto:hello@daralfateh.ae" className="flex items-center gap-3 hover:text-[#C8A97E] transition-colors">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Mail className="w-3.5 h-3.5 text-[#C8A97E]" />
                </div>
                hello@daralfateh.ae
              </a>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-[#C8A97E]" />
                </div>
                <span>Premium District, Dubai, UAE</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-[#C8A97E] mb-6">Explore</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.shop.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#666] text-sm hover:text-[#2C2C2C] hover:translate-x-1 inline-block transition-all font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-[#C8A97E] mb-6">Client Services</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.account.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#666] text-sm hover:text-[#2C2C2C] hover:translate-x-1 inline-block transition-all font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-[#C8A97E] mb-6">The Brand</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.info.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#666] text-sm hover:text-[#2C2C2C] hover:translate-x-1 inline-block transition-all font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#EAEAEA] bg-white py-6 px-4">
        <div className="container mx-auto max-w-[1500px] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[#999] text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Dar Al Fateh. Quality Guaranteed.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { label: 'IG', href: '#', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
              { label: 'FB', href: '#', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { label: 'YT', href: '#', path: 'M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
            ].map(({ label: _label, href, path }, i) => (
              <a key={i} href={href} className="w-10 h-10 rounded-full bg-[#F7F3EF] hover:bg-[#C8A97E] flex items-center justify-center transition-all group shadow-sm border border-[#EAEAEA] hover:border-transparent">
                <svg className="w-4 h-4 fill-current text-[#999] group-hover:text-white transition-colors" viewBox="0 0 24 24"><path d={path} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
