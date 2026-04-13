"use client";

import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please try again.');
      } else {
        login({ id: data.id, name: data.name, email: data.email });
        onClose();
        setEmail('');
        setPassword('');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] w-full max-w-md mx-4 p-10"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-[#F7F3EF] text-[#666] hover:bg-[#C8A97E] hover:text-white transition-all"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="text-[10px] font-black text-[#C8A97E] tracking-[0.4em] uppercase mb-2">Welcome Back</div>
          <h2 className="text-2xl font-black text-[#2C2C2C] uppercase tracking-tight">Sign In</h2>
          <p className="text-[13px] text-[#AAA] mt-2">Access your account and order history.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C8A97E]" />
            <input
              type="text"
              placeholder="Email or Username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-[#F7F3EF] rounded-full py-3.5 pl-11 pr-5 text-[13px] font-medium text-[#2C2C2C] placeholder:text-[#BBB] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C8A97E]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-[#F7F3EF] rounded-full py-3.5 pl-11 pr-12 text-[13px] font-medium text-[#2C2C2C] placeholder:text-[#BBB] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/40 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAA] hover:text-[#C8A97E] transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-[12px] font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2C2C2C] text-white rounded-full py-4 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#C8A97E] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
