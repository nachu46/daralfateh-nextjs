"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, CheckCircle2, ChevronLeft, Loader2, Mail, Hash } from "lucide-react";

export default function TrackOrderPage() {
  const [email, setEmail] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, orderRef }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to retrieve tracking details.");
      }

      setResult(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusMap: Record<string, { label: string; color: string; desc: string }> = {
    draft: { label: "Processing", color: "text-amber-500", desc: "Your order is being reviewed." },
    sent: { label: "Confirmed", color: "text-blue-500", desc: "Quotation sent and confirmed." },
    sale: { label: "Confirmed & Prepared", color: "text-emerald-500", desc: "Order is confirmed and being prepared." },
    done: { label: "Completed", color: "text-[#C8A97E]", desc: "Your order has been fully completed." },
    cancel: { label: "Cancelled", color: "text-red-500", desc: "This order has been cancelled." },
  };

  return (
    <div className="min-h-screen bg-[#F7F3EF] pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-[800px]">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.3em] flex items-center gap-1.5 hover:translate-x-[-4px] transition-transform mb-6 w-max">
            <ChevronLeft size={14} /> Back to Store
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] uppercase tracking-tighter mb-4">
            Track Your Order
          </h1>
          <p className="text-[11px] font-bold text-[#AAA] uppercase tracking-[0.3em]">
            Enter your details below to check live order status.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[24px] border border-[#EAEAEA] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          {!result ? (
            <form onSubmit={handleTrack} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[13px] font-bold mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#AAA] uppercase tracking-[0.4em] pl-1">Email Address</label>
                <div className="relative group">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-[#F7F3EF] border-transparent focus:border-[#C8A97E] focus:bg-white rounded-xl py-4 pl-12 pr-4 text-[13px] font-semibold text-[#2C2C2C] focus:outline-none transition-all duration-300"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CCC] group-focus-within:text-[#C8A97E] transition-colors" size={16} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#AAA] uppercase tracking-[0.4em] pl-1">Order Number</label>
                <div className="relative group">
                  <input
                    required
                    type="text"
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value)}
                    placeholder="e.g. S00010"
                    className="w-full bg-[#F7F3EF] border-transparent focus:border-[#C8A97E] focus:bg-white rounded-xl py-4 pl-12 pr-4 text-[13px] font-semibold text-[#2C2C2C] focus:outline-none transition-all duration-300 uppercase"
                  />
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CCC] group-focus-within:text-[#C8A97E] transition-colors" size={16} />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C8A97E] text-white py-5 rounded-full font-black text-[12px] uppercase tracking-[0.4em] hover:bg-[#111] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Fetching Status...
                    </>
                  ) : (
                    <>
                      Track Order <Search size={16} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#F0F0F0]">
                <div>
                  <p className="text-[10px] font-black text-[#C8A97E] uppercase tracking-[0.4em] mb-2">Order Found</p>
                  <h2 className="text-3xl font-black text-[#2C2C2C] uppercase tracking-tighter">{result.orderNumber}</h2>
                </div>
                <div className="w-16 h-16 bg-[#F7F3EF] rounded-full flex items-center justify-center text-[#C8A97E]">
                  <Package size={28} />
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-[#F9F9F9] p-6 rounded-2xl border border-[#EEE]">
                  <p className="text-[10px] font-black text-[#AAA] uppercase tracking-[0.3em] mb-4">Current Status</p>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-6 h-6 ${statusMap[result.status]?.color || 'text-[#2C2C2C]'}`} />
                    <div>
                      <h3 className={`text-lg font-black uppercase tracking-tight ${statusMap[result.status]?.color || 'text-[#2C2C2C]'}`}>
                        {statusMap[result.status]?.label || result.status}
                      </h3>
                      <p className="text-[#888] text-[13px] font-bold mt-1">
                        {statusMap[result.status]?.desc || "Your order is in progress."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#AAA] uppercase tracking-[0.3em]">Customer Name</p>
                      <p className="text-[14px] font-bold text-[#2C2C2C] capitalize">{result.customerName}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#AAA] uppercase tracking-[0.3em]">Total Amount</p>
                      <p className="text-[14px] font-bold text-[#2C2C2C] uppercase">AED {result.total.toFixed(2)}</p>
                   </div>
                   <div className="space-y-1 col-span-2">
                      <p className="text-[10px] font-black text-[#AAA] uppercase tracking-[0.3em]">Order Date</p>
                      <p className="text-[14px] font-bold text-[#2C2C2C]">{new Date(result.date).toLocaleString()}</p>
                   </div>
                </div>

                <div className="pt-8 text-center border-t border-[#F0F0F0]">
                  <button
                    onClick={() => setResult(null)}
                    className="text-[11px] font-black text-[#C8A97E] uppercase tracking-[0.3em] hover:text-[#2C2C2C] transition-colors"
                  >
                    Track Another Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
