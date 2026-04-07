"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Success
      setSuccess("Successfully logged in! Redirecting...");
      // Simulate redirection wait
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EF] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex flex-col items-center group">
            <span className="text-3xl font-black text-[#2C2C2C] leading-none tracking-[-0.03em] uppercase group-hover:text-[#C8A97E] transition-colors">
              Dar Al Fateh
            </span>
            <span className="text-[9px] font-bold text-[#C8A97E] tracking-[0.4em] mt-1.5 uppercase">International</span>
          </Link>
          <p className="text-[#999] text-[11px] font-bold uppercase tracking-widest mt-6">Premium Grooming & Grocery</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden border border-[#F0F0F0]">
          {/* Tab Toggle */}
          <div className="flex border-b border-[#F9F9F9]">
            <button
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                mode === "login"
                  ? "text-[#2C2C2C] border-b-2 border-[#C8A97E] bg-white"
                  : "text-[#CCC] hover:text-[#999] bg-[#FCFCFC]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
              className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                mode === "register"
                  ? "text-[#2C2C2C] border-b-2 border-[#C8A97E] bg-white"
                  : "text-[#CCC] hover:text-[#999] bg-[#FCFCFC]"
              }`}
            >
              Join Us
            </button>
          </div>

          <div className="p-10">
            <h2 className="text-xl font-bold text-[#2C2C2C] mb-2 text-center">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-[#999] text-[13px] mb-8 text-center font-medium">
              {mode === "login"
                ? "Please enter your details to continue"
                : "Join our exclusive collection today"}
            </p>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[12px] font-bold rounded-full px-6 py-3 mb-6 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[12px] font-bold rounded-full px-6 py-3 mb-6 text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field - register only */}
              {mode === "register" && (
                <div>
                  <label className="block text-[10px] font-black text-[#C8A97E] uppercase tracking-widest mb-2 ml-4">Full Identity</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DDD]" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder="Your Name"
                      className="w-full bg-[#FAFAFA] border border-[#EEE] rounded-full pl-14 pr-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#C8A97E] focus:bg-white transition-all italic"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[10px] font-black text-[#C8A97E] uppercase tracking-widest mb-2 ml-4">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DDD]" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                    className="w-full bg-[#FAFAFA] border border-[#EEE] rounded-full pl-14 pr-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#C8A97E] focus:bg-white transition-all italic"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2 ml-4 mr-4">
                  <label className="block text-[10px] font-black text-[#C8A97E] uppercase tracking-widest">Password</label>
                  {mode === "login" && (
                    <Link href="#" className="text-[10px] text-[#999] font-bold hover:text-[#C8A97E] transition-colors">
                      Forgot?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DDD]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full bg-[#FAFAFA] border border-[#EEE] rounded-full pl-14 pr-14 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#C8A97E] focus:bg-white transition-all italic"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#DDD] hover:text-[#C8A97E] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2C2C2C] text-white py-4 rounded-full font-black text-[13px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#C8A97E] transition-all shadow-xl shadow-black/5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{mode === "login" ? "Sign In" : "Join Now"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#F0F0F0]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-white px-4 text-[#CCC] font-bold">Or Continue With</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 border border-[#EEE] rounded-full py-3.5 text-[11px] font-bold text-[#2C2C2C] uppercase tracking-widest hover:bg-[#F9F9F9] transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-3 border border-[#EEE] rounded-full py-3.5 text-[11px] font-bold text-[#2C2C2C] uppercase tracking-widest hover:bg-[#F9F9F9] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
                GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-[10px] font-bold text-[#CCC] uppercase tracking-widest mt-10">
          Continuing confirms Your Agreement To Our{" "}
          <Link href="#" className="text-[#C8A97E] hover:underline">Terms</Link>
          {" "}&{" "}
          <Link href="#" className="text-[#C8A97E] hover:underline">Privacy</Link>.
        </p>
      </div>
    </div>
  );
}
