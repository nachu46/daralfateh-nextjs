import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, Globe, Users, Heart, Award, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Dar Al Fateh International',
  description: 'Learn about Dar Al Fateh International — your trusted source for premium fresh produce, dates, and pantry essentials directly from farm to table.',
};

const values = [
  { icon: Leaf, title: 'Farm Fresh', desc: 'We source directly from trusted farms across the world, ensuring every product arrives at peak freshness.' },
  { icon: Globe, title: 'Global Sourcing', desc: 'Our network spans across Asia, Africa, and the Middle East to bring you authentic, high-quality produce.' },
  { icon: Award, title: 'Quality Certified', desc: 'All products meet strict food safety and quality standards, backed by international certifications.' },
  { icon: Truck, title: 'Swift Delivery', desc: 'Our logistics network ensures every order reaches your door fresh and on time, every time.' },
  { icon: Heart, title: 'Community First', desc: 'We believe in supporting local communities and sustainable farming practices for a better tomorrow.' },
  { icon: Users, title: 'Trusted Partner', desc: 'Thousands of families and businesses in the UAE trust Dar Al Fateh as their preferred grocery partner.' },
];

const team = [
  { name: 'Ahmed Bin Ateeq Al Suwaidi', role: 'Founder & Chairman', initials: 'AS' },
  { name: 'Executive Team', role: 'Operations & Procurement', initials: 'ET' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EF]">

      {/* Hero Section */}
      <section className="w-full bg-[#2C2C2C] text-white py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#C8A97E] blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#C8A97E] blur-[100px] translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto max-w-[900px] text-center relative z-10">
          <p className="text-[#C8A97E] text-[10px] font-black uppercase tracking-[0.5em] mb-4">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.05] mb-6">
            Bringing the World&apos;s
            <br />
            <span className="text-[#C8A97E]">Finest Produce</span>
            <br />
            to Your Table
          </h1>
          <p className="text-[16px] text-[#CCC] max-w-2xl mx-auto leading-relaxed font-medium">
            Founded in 2007 by Mr. Ahmed Bin Ateeq Al Suwaidi, Dar Al Fateh Group was established with a vision to help UAE residents live longer and healthier by providing premium organic produce.
          </p>
        </div>
      </section>

      {/* Mission Strip */}
      <section className="w-full bg-[#C8A97E] py-6 px-6">
        <div className="container mx-auto max-w-[1200px] text-center">
          <p className="text-white text-[13px] font-bold uppercase tracking-[0.3em]">
            ✧ &nbsp; Fresh Every Day &nbsp; • &nbsp; Globally Sourced &nbsp; • &nbsp; UAE&apos;s Trusted Grocery Partner &nbsp; ✧
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C8A97E] text-[10px] font-black uppercase tracking-[0.5em] mb-3">Who We Are</p>
              <h2 className="text-4xl font-black text-[#2C2C2C] uppercase tracking-tight mb-6 leading-tight">
                A Legacy Built on
                <br />
                Quality &amp; Trust
              </h2>
              <div className="space-y-4 text-[#555] text-[15px] leading-relaxed font-medium">
                <p>
                  Established in 2007 in the UAE, the Dar Al Fateh Group operates major high-tech organic farms to meet the continuous demand for premium organic vegetables and dates across the region.
                </p>
                <p>
                  Our operations began with the Bida Faris farm in Al Ain (70 dunam) and later expanded in 2011 with the acquisition of the Liwa farm in the Western Region (155 dunam) to keep pace with growing demand.
                </p>
                <p>
                  Today, with a total organic farming area of 157,337 square meters, Dar Al Fateh Agriculture produces high-quality organic vegetables every day, distributed through our Trading Division to top retailers across the U.A.E.
                </p>
              </div>
              <div className="mt-10 flex gap-8">
                <div>
                  <p className="text-4xl font-black text-[#C8A97E]">2007</p>
                  <p className="text-[11px] font-bold text-[#999] uppercase tracking-widest mt-1">Established</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-[#C8A97E]">157K+</p>
                  <p className="text-[11px] font-bold text-[#999] uppercase tracking-widest mt-1">Sq Meters Farmed</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-[#C8A97E]">2</p>
                  <p className="text-[11px] font-bold text-[#999] uppercase tracking-widest mt-1">Major Organic Farms</p>
                </div>
              </div>
            </div>
            {/* Visual card */}
            <div className="relative">
              <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-10 border border-[#F0F0F0]">
                <div className="w-20 h-20 rounded-full bg-[#C8A97E] flex items-center justify-center mb-6 mx-auto">
                  <Leaf size={36} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-[#2C2C2C] text-center uppercase mb-4">Our Mission</h3>
                <p className="text-[#666] text-[14px] leading-relaxed text-center font-medium">
                  To connect the world&apos;s finest agricultural producers with families and businesses in the UAE — delivering freshness, integrity, and value in every single order.
                </p>
                <div className="mt-8 pt-6 border-t border-[#F0F0F0] text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C8A97E]">Dar Al Fateh Group</p>
                  <p className="text-[11px] text-[#AAA] mt-1 font-medium">Established in 2007</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#C8A97E]/10 rounded-[24px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-[1200px]">
          <div className="text-center mb-16">
            <p className="text-[#C8A97E] text-[10px] font-black uppercase tracking-[0.5em] mb-3">What Drives Us</p>
            <h2 className="text-4xl font-black text-[#2C2C2C] uppercase tracking-tight">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="group bg-[#F7F3EF] rounded-[20px] p-8 hover:bg-[#2C2C2C] transition-all duration-500">
                <div className="w-12 h-12 rounded-full bg-[#C8A97E]/20 group-hover:bg-[#C8A97E] flex items-center justify-center mb-5 transition-all duration-500">
                  <v.icon size={22} className="text-[#C8A97E] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-[16px] font-black text-[#2C2C2C] group-hover:text-white uppercase tracking-tight mb-3 transition-colors duration-500">{v.title}</h3>
                <p className="text-[13px] text-[#777] group-hover:text-[#CCC] leading-relaxed font-medium transition-colors duration-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="text-center mb-16">
            <p className="text-[#C8A97E] text-[10px] font-black uppercase tracking-[0.5em] mb-3">The People Behind</p>
            <h2 className="text-4xl font-black text-[#2C2C2C] uppercase tracking-tight">Our Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-[20px] p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#F0F0F0] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C8A97E] to-[#a07848] flex items-center justify-center text-white text-xl font-black mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="text-[15px] font-black text-[#2C2C2C] mb-1">{member.name}</h3>
                <p className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-[0.2em]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#2C2C2C] text-white text-center">
        <div className="container mx-auto max-w-[600px]">
          <p className="text-[#C8A97E] text-[10px] font-black uppercase tracking-[0.5em] mb-3">Ready to Experience the Difference?</p>
          <h2 className="text-3xl font-black uppercase mb-6 leading-tight">Shop Our Premium Collection</h2>
          <Link
            href="/shop"
            className="inline-block bg-[#C8A97E] text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-[#2C2C2C] transition-all"
          >
            Browse All Products →
          </Link>
        </div>
      </section>
    </div>
  );
}
