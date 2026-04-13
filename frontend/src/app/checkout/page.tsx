"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import StripeProvider from '@/components/Checkout/StripeProvider';
import CheckoutForm from '@/components/Checkout/CheckoutForm';

export default function CheckoutPage() {
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1: Delivery, 2: Payment
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dubai');
  
  // Billing State
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billFirstName, setBillFirstName] = useState('');
  const [billLastName, setBillLastName] = useState('');
  const [billEmail, setBillEmail] = useState('');
  const [billPhone, setBillPhone] = useState('');
  const [billAddress, setBillAddress] = useState('');
  const [billCity, setBillCity] = useState('Dubai');
  
  // Stripe State
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0;
  const grandTotal = total + shipping;

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsInitializing(true);

    if (items.length === 0) {
      setError('Your cart is empty.');
      setIsInitializing(false);
      return;
    }

    try {
      // Fetch PaymentIntent from backend
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment.');

      setClientSecret(data.clientSecret);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'An error occurred during initialization.');
    } finally {
      setIsInitializing(false);
    }
  };

  if (!mounted) return null;

  const customerDetails = {
    name: `${firstName} ${lastName}`.trim(),
    email,
    phone,
    street: address,
    city,
    zip: '00000'
  };

  const billingDetails = billingSameAsShipping ? customerDetails : {
    name: `${billFirstName} ${billLastName}`.trim(),
    email: billEmail,
    phone: billPhone,
    street: billAddress,
    city: billCity,
    zip: '00000'
  };

  return (
    <div className="bg-[#F7F3EF] min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <Link href="/cart" className="inline-flex flex-row items-center gap-2 text-[#C8A97E] text-[11px] font-black uppercase tracking-widest hover:text-[#2C2C2C] transition-colors mb-10">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Checkout Area */}
          <div className="flex-1">
            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-8">
                <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#F0F0F0]">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-[#C8A97E] text-white rounded-full flex items-center justify-center font-black text-lg">1</div>
                    <h2 className="text-2xl font-black text-[#2C2C2C] uppercase tracking-tight">Delivery Details</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">First Name</label>
                      <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-[#F7F3EF] border border-transparent focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none focus:bg-white transition-all font-medium placeholder:text-[#BBB]" placeholder="Ahmed" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">Last Name</label>
                      <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-[#F7F3EF] border border-transparent focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none focus:bg-white transition-all font-medium placeholder:text-[#BBB]" placeholder="Al Suwaidi" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">Email Address</label>
                      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#F7F3EF] border border-transparent focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none focus:bg-white transition-all font-medium placeholder:text-[#BBB]" placeholder="ahmed@example.com" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">Mobile Number</label>
                      <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#F7F3EF] border border-transparent focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none focus:bg-white transition-all font-medium placeholder:text-[#BBB]" placeholder="+971 50 123 4567" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">Delivery Address (Apartment, Street)</label>
                    <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-[#F7F3EF] border border-transparent focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none focus:bg-white transition-all font-medium placeholder:text-[#BBB]" placeholder="Villa 12, Palm Jumeirah" />
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">City / Emirate</label>
                    <select required value={city} onChange={e => setCity(e.target.value)} className="w-full bg-[#F7F3EF] border border-transparent focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none focus:bg-white transition-all font-medium">
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                    </select>
                  </div>
                  
                  <div className="mt-10 pt-10 border-t border-[#F0F0F0]">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={billingSameAsShipping} 
                          onChange={e => setBillingSameAsShipping(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-6 h-6 border-2 border-[#EAEAEA] rounded-md transition-all peer-checked:bg-[#C8A97E] peer-checked:border-[#C8A97E]" />
                        <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-[14px] font-bold text-[#2C2C2C] select-none">My billing address is the same as shipping</span>
                    </label>
                  </div>

                  {!billingSameAsShipping && (
                    <div className="mt-10 p-6 md:p-8 bg-[#F7F3EF]/50 rounded-[20px] border border-[#EAEAEA] animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-lg font-black text-[#2C2C2C] uppercase tracking-tight">Billing Address</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">First Name</label>
                          <input required type="text" value={billFirstName} onChange={e => setBillFirstName(e.target.value)} className="w-full bg-white border border-[#EAEAEA] focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none transition-all font-medium placeholder:text-[#BBB]" placeholder="Ahmed" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">Last Name</label>
                          <input required type="text" value={billLastName} onChange={e => setBillLastName(e.target.value)} className="w-full bg-white border border-[#EAEAEA] focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none transition-all font-medium placeholder:text-[#BBB]" placeholder="Al Suwaidi" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">Email Address</label>
                          <input required type="email" value={billEmail} onChange={e => setBillEmail(e.target.value)} className="w-full bg-white border border-[#EAEAEA] focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none transition-all font-medium placeholder:text-[#BBB]" placeholder="ahmed@example.com" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">Mobile Number</label>
                          <input required type="tel" value={billPhone} onChange={e => setBillPhone(e.target.value)} className="w-full bg-white border border-[#EAEAEA] focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none transition-all font-medium placeholder:text-[#BBB]" placeholder="+971 50 123 4567" />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">Billing Address (Street, Building)</label>
                        <input required type="text" value={billAddress} onChange={e => setBillAddress(e.target.value)} className="w-full bg-white border border-[#EAEAEA] focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none transition-all font-medium placeholder:text-[#BBB]" placeholder="Office 402, Business Bay" />
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-[#888] mb-2">City / Emirate</label>
                        <select required value={billCity} onChange={e => setBillCity(e.target.value)} className="w-full bg-white border border-[#EAEAEA] focus:border-[#C8A97E] rounded-xl px-5 py-4 text-[14px] text-[#2C2C2C] focus:outline-none transition-all font-medium">
                          <option value="Dubai">Dubai</option>
                          <option value="Abu Dhabi">Abu Dhabi</option>
                          <option value="Sharjah">Sharjah</option>
                          <option value="Ajman">Ajman</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isInitializing}
                    className="w-full mt-10 bg-[#2C2C2C] text-white py-5 rounded-full text-[13px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#C8A97E] transition-all disabled:opacity-70 group"
                  >
                    {isInitializing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Preparing Payment...
                      </>
                    ) : (
                      <>
                        Continue to Payment <Lock size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <StripeProvider clientSecret={clientSecret}>
                <CheckoutForm 
                  customer={customerDetails} 
                  billing={billingDetails}
                  onBack={() => setStep(1)} 
                />
              </StripeProvider>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#F0F0F0] sticky top-32">
              <h3 className="text-xl font-black text-[#2C2C2C] uppercase tracking-tight mb-6">Order Summary</h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.length === 0 ? (
                  <p className="text-[13px] text-[#888] font-medium text-center py-4">Your cart is empty.</p>
                ) : items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl bg-[#F7F3EF] overflow-hidden flex-shrink-0 border border-[#EAEAEA] p-1">
                      <img src={item.image_url || '/placeholder.png'} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] font-black text-[#2C2C2C] uppercase tracking-tight mb-1">{item.name}</p>
                      <p className="text-[11px] text-[#888] font-bold">Qty {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-black text-[#C8A97E]">
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#F0F0F0] space-y-4">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#888] font-bold uppercase tracking-widest">Subtotal</span>
                  <span className="font-black text-[#2C2C2C]">AED {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-[#888] font-bold uppercase tracking-widest">Shipping</span>
                  <span className="font-black text-[#2C2C2C]">Free</span>
                </div>
                
                <div className="pt-6 mt-6 border-t border-[#F0F0F0] flex justify-between items-center">
                  <span className="text-[14px] font-black uppercase tracking-[0.2em] text-[#2C2C2C]">Total</span>
                  <span className="text-2xl font-black text-[#C8A97E]">
                    AED {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
