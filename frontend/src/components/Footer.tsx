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
      <div className="container mx-auto px-4 max-w-[1500px] py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          
          {/* Section 1: Useful Links */}
          <div className="flex flex-col gap-8">
            <h4 className="font-black text-[12px] uppercase tracking-[0.4em] text-[#C8A97E]">Useful Links</h4>
            <ul className="flex flex-col gap-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop Center', href: '/shop' },
                { label: 'Track Order', href: '/track' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact Us', href: '/contact' }
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[#666] text-[13px] hover:text-[#C8A97E] hover:translate-x-1 inline-block transition-all font-bold uppercase tracking-widest">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: About us */}
          <div className="flex flex-col gap-8">
            <h4 className="font-black text-[12px] uppercase tracking-[0.4em] text-[#C8A97E]">About us</h4>
            <div className="space-y-6">
              <p className="text-[#666] text-sm leading-relaxed font-medium">
                We are a team of passionate people whose goal is to improve everyone&apos;s life through disruptive products. We build great products to solve your business problems.
              </p>
              <p className="text-[#666] text-sm leading-relaxed font-medium">
                Our products are designed for small to medium size companies willing to optimize their performance.
              </p>
            </div>
          </div>

          {/* Section 3: Connect with us */}
          <div className="flex flex-col gap-8">
            <h4 className="font-black text-[12px] uppercase tracking-[0.4em] text-[#C8A97E]">Connect with us</h4>
            <div className="flex flex-col gap-6 text-sm text-[#555] font-medium">
              <Link href="/contact" className="flex items-center gap-4 hover:text-[#C8A97E] transition-colors group">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#C8A97E]" />
                </div>
                Contact us
              </Link>
              <a href="mailto:info@daralfateh.ae" className="flex items-center gap-4 hover:text-[#C8A97E] transition-colors">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#C8A97E]" />
                </div>
                info@daralfateh.ae
              </a>
              <a href="tel:+97145551234" className="flex items-center gap-4 hover:text-[#C8A97E] transition-colors">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#C8A97E]" />
                </div>
                +971 4 555 1234
              </a>
            </div>

            {/* Social Icons - White Circles */}
            <div className="flex items-center gap-4 pt-4">
              {[
                { label: 'FB', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { label: 'X', path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.493h2.039L6.486 3.24H4.298l13.311 17.406z' },
                { label: 'LI', path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
                { label: 'HM', path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' }
              ].map((icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full bg-white flex items-center justify-center transition-all hover:bg-[#C8A97E] group shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#EEE] hover:border-transparent">
                  <svg className="w-5 h-5 fill-current text-[#C8A97E] group-hover:text-white transition-colors" viewBox="0 0 24 24">
                    <path d={icon.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#EAEAEA] bg-white/50 backdrop-blur-sm py-10 px-4">
        <div className="container mx-auto max-w-[1500px] flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[#AAA] text-[10px] font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Dar Al Fateh. Quality Guaranteed.
          </p>
          <Link href="/" className="h-8 opacity-50 hover:opacity-100 transition-opacity">
            <img src="/api/logo" alt="Dar Al Fateh Group" className="h-full w-auto grayscale" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
