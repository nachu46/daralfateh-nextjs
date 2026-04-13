"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, ArrowRight, Loader2 } from "lucide-react";

interface CheckoutFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
    country_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-none border border-[#EAEAEA] shadow-[0_20px_80px_rgba(0,0,0,0.04)]">
      <div className="mb-10">
        <h2 className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.65em] mb-4">
          Secure Checkout
        </h2>
        <p className="text-2xl font-black text-[#2C2C2C] uppercase tracking-tighter">
          Your Delivery Information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-[#AAA] uppercase tracking-[0.4em] pl-1">Full Name</label>
            <div className="relative group">
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-[#F7F3EF] border-transparent focus:border-[#C8A97E] focus:bg-white rounded-none py-4 pl-12 pr-4 text-[13px] font-semibold text-[#2C2C2C] focus:outline-none transition-all duration-300"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CCC] group-focus-within:text-[#C8A97E] transition-colors" size={16} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-black text-[#AAA] uppercase tracking-[0.4em] pl-1">Email Address</label>
            <div className="relative group">
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-[#F7F3EF] border-transparent focus:border-[#C8A97E] focus:bg-white rounded-none py-4 pl-12 pr-4 text-[13px] font-semibold text-[#2C2C2C] focus:outline-none transition-all duration-300"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CCC] group-focus-within:text-[#C8A97E] transition-colors" size={16} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-[#AAA] uppercase tracking-[0.4em] pl-1">Phone Number</label>
            <div className="relative group">
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+971 00 000 0000"
                className="w-full bg-[#F7F3EF] border-transparent focus:border-[#C8A97E] focus:bg-white rounded-none py-4 pl-12 pr-4 text-[13px] font-semibold text-[#2C2C2C] focus:outline-none transition-all duration-300"
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CCC] group-focus-within:text-[#C8A97E] transition-colors" size={16} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-black text-[#AAA] uppercase tracking-[0.4em] pl-1">Street Address</label>
            <div className="relative group">
              <input
                required
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Villa 123, Street 45"
                className="w-full bg-[#F7F3EF] border-transparent focus:border-[#C8A97E] focus:bg-white rounded-none py-4 pl-12 pr-4 text-[13px] font-semibold text-[#2C2C2C] focus:outline-none transition-all duration-300"
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CCC] group-focus-within:text-[#C8A97E] transition-colors" size={16} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-[#AAA] uppercase tracking-[0.4em] pl-1">City</label>
            <input
              required
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Dubai"
              className="w-full bg-[#F7F3EF] border-transparent focus:border-[#C8A97E] focus:bg-white rounded-none py-4 px-4 text-[13px] font-semibold text-[#2C2C2C] focus:outline-none transition-all duration-300"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[9px] font-black text-[#AAA] uppercase tracking-[0.4em] pl-1">ZIP / Postal</label>
            <input
              required
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              placeholder="00000"
              className="w-full bg-[#F7F3EF] border-transparent focus:border-[#C8A97E] focus:bg-white rounded-none py-4 px-4 text-[13px] font-semibold text-[#2C2C2C] focus:outline-none transition-all duration-300"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[9px] font-black text-[#AAA] uppercase tracking-[0.4em] pl-1">Country</label>
            <input
              required
              name="country_name"
              value={formData.country_name}
              onChange={handleChange}
              placeholder="United Arab Emirates"
              className="w-full bg-[#F7F3EF] border-transparent focus:border-[#C8A97E] focus:bg-white rounded-none py-4 px-4 text-[13px] font-semibold text-[#2C2C2C] focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        <div className="pt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C8A97E] text-white py-6 rounded-none font-black text-[12px] uppercase tracking-[0.55em] hover:bg-[#111] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-[0.99] disabled:bg-[#CCC] shadow-[#C8A97E]/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Securing Tunnel...
              </>
            ) : (
              <>
                Proceed to Secure Payment
                <ArrowRight size={16} strokeWidth={3} />
              </>
            )}
          </button>
        </div>
        <p className="text-[9px] text-center text-[#CCC] font-black uppercase tracking-[0.35em] mt-6">
          All customer data is synchronized securely with the Odoo portal.
        </p>
      </form>
    </div>
  );
}
