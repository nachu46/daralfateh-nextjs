import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Award, Leaf, Globe, CheckCircle2, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Certificates & Quality Standards | Dar Al Fateh International',
  description: 'View all quality certifications and food safety standards maintained by Dar Al Fateh International for premium fresh produce.',
};

const certifications = [
  {
    code: 'ESMA - Liwa',
    title: 'Certificate of Conformity',
    body: 'Emirates Authority for Standardization & Metrology',
    year: '2019',
    description: 'Product is registered under the Emirates Conformity Assessment Scheme (ECAS). Certified Organic Crop Production for Vegetables & Dates at Liwa Farm.',
    color: '#4A7C59',
    status: 'Active',
  },
  {
    code: 'ESMA - Bida Faris',
    title: 'Certificate of Conformity',
    body: 'Emirates Authority for Standardization & Metrology',
    year: '2019',
    description: 'Product is registered under the Emirates Conformity Assessment Scheme (ECAS). Certified Organic Crop Production for Vegetables at Bida Faris Farm.',
    color: '#6B7F5E',
    status: 'Active',
  },
  {
    code: 'DUBAI SME',
    title: 'Membership Certificate',
    body: 'Mohamed Bin Rashid Establishment',
    year: 'Active',
    description: 'Recognized as a supported national business by Dubai SME and the Mohamed Bin Rashid Al Maktoum Global Initiatives.',
    color: '#C8A97E',
    status: 'Active',
  },
];

const qualitySteps = [
  { step: '01', title: 'Source Verification', desc: 'Every farm partner is audited for quality, sustainability, and ethical practices before onboarding.' },
  { step: '02', title: 'Harvest Standards', desc: 'Products are harvested at peak ripeness using recommended practices to preserve nutritional value.' },
  { step: '03', title: 'Cold Chain Management', desc: 'Unbroken cold chain from farm to warehouse, maintaining the ideal temperature for each product category.' },
  { step: '04', title: 'Quality Inspection', desc: 'Every shipment undergoes rigorous multi-point inspection by our certified quality assurance team.' },
  { step: '05', title: 'Hygienic Packaging', desc: 'Packed in certified facilities using food-grade materials to preserve freshness and prevent contamination.' },
  { step: '06', title: 'Delivery Guarantee', desc: 'Temperature-controlled delivery vehicles ensure your order arrives as fresh as the day it was packed.' },
];

export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EF]">

      {/* Hero */}
      <section className="w-full bg-[#2C2C2C] text-white py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C8A97E] blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#C8A97E] blur-[80px] -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto max-w-[900px] text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-[#C8A97E]/20 border border-[#C8A97E]/40 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={28} className="text-[#C8A97E]" />
          </div>
          <p className="text-[#C8A97E] text-[10px] font-black uppercase tracking-[0.5em] mb-4">Quality & Compliance</p>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.05] mb-6">
            Our Certifications &amp;
            <br />
            <span className="text-[#C8A97E]">Quality Standards</span>
          </h1>
          <p className="text-[16px] text-[#CCC] max-w-2xl mx-auto leading-relaxed font-medium">
            At Dar Al Fateh International, quality is not just a promise — it is a certified, verified, and continuously audited commitment to every customer we serve.
          </p>
        </div>
      </section>

      {/* Trust badges strip */}
      <section className="w-full bg-[#C8A97E] py-5 px-6">
        <div className="container mx-auto max-w-[1200px] flex flex-wrap items-center justify-center gap-8">
          {['ESMA Certified', 'Organic Farming', 'Dubai SME Member', 'UAE Local Produce', 'ECAS Registered'].map(b => (
            <div key={b} className="flex items-center gap-2 text-white">
              <CheckCircle2 size={14} className="flex-shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">{b}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="text-center mb-16">
            <p className="text-[#C8A97E] text-[10px] font-black uppercase tracking-[0.5em] mb-3">Internationally Recognized</p>
            <h2 className="text-4xl font-black text-[#2C2C2C] uppercase tracking-tight">Our Certificates</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.code}
                className="bg-white rounded-[20px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#F0F0F0] hover:shadow-[0_16px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-400 flex flex-col"
              >
                {/* Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="px-4 py-2 rounded-full text-white text-[11px] font-black uppercase tracking-[0.2em]"
                    style={{ backgroundColor: cert.color }}
                  >
                    {cert.code}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-green-50 text-green-600 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    {cert.status}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-[16px] font-black text-[#2C2C2C] uppercase tracking-tight mb-1 leading-tight">{cert.title}</h3>
                <p className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-[0.15em] mb-4">{cert.body}</p>
                <p className="text-[13px] text-[#666] leading-relaxed font-medium flex-1">{cert.description}</p>

                {/* Footer */}
                <div className="mt-6 pt-5 border-t border-[#F0F0F0] flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#BBB] uppercase tracking-widest">Certified {cert.year}</span>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-[#C8A97E] uppercase tracking-widest">
                    <Award size={12} />
                    Valid
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Process */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-[1200px]">
          <div className="text-center mb-16">
            <p className="text-[#C8A97E] text-[10px] font-black uppercase tracking-[0.5em] mb-3">How We Maintain Quality</p>
            <h2 className="text-4xl font-black text-[#2C2C2C] uppercase tracking-tight">Our Quality Process</h2>
            <p className="text-[14px] text-[#888] mt-4 max-w-xl mx-auto font-medium">
              From farm to your door — every step is tracked, controlled, and certified.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualitySteps.map((s) => (
              <div key={s.step} className="group">
                <div className="bg-[#F7F3EF] rounded-[20px] p-8 h-full hover:bg-[#2C2C2C] transition-all duration-500">
                  <div className="text-5xl font-black text-[#C8A97E]/30 group-hover:text-[#C8A97E]/50 mb-4 transition-colors duration-500 leading-none">
                    {s.step}
                  </div>
                  <h3 className="text-[15px] font-black text-[#2C2C2C] group-hover:text-white uppercase tracking-tight mb-3 transition-colors duration-500">
                    {s.title}
                  </h3>
                  <p className="text-[13px] text-[#777] group-hover:text-[#CCC] leading-relaxed font-medium transition-colors duration-500">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Note */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[900px]">
          <div className="bg-white rounded-[24px] border border-[#F0F0F0] shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-16 h-16 rounded-full bg-[#F7F3EF] flex items-center justify-center flex-shrink-0">
              <Globe size={28} className="text-[#C8A97E]" />
            </div>
            <div>
              <h3 className="text-[18px] font-black text-[#2C2C2C] uppercase tracking-tight mb-2">Regulatory Compliance</h3>
              <p className="text-[13px] text-[#666] leading-relaxed font-medium">
                All organic produce sold through Dar Al Fateh Group complies with the Emirates Organic Food Certification System (Ministerial Resolution No. 84 of 2012) and is registered with ESMA and the Ministry of Climate Change and Environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#2C2C2C] text-white text-center">
        <div className="container mx-auto max-w-[600px]">
          <Leaf size={32} className="text-[#C8A97E] mx-auto mb-4" />
          <h2 className="text-3xl font-black uppercase mb-4 leading-tight">Shop with Confidence</h2>
          <p className="text-[#AAA] text-[14px] mb-8 font-medium">Every product in our store is backed by international quality standards.</p>
          <Link
            href="/shop"
            className="inline-block bg-[#C8A97E] text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-[#2C2C2C] transition-all"
          >
            Explore Our Products →
          </Link>
        </div>
      </section>
    </div>
  );
}
