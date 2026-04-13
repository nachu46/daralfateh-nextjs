"use client";

import { useState, useRef } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, Lock, AlertCircle } from 'lucide-react';

interface CheckoutFormProps {
  customer: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    zip: string;
  };
  billing?: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    zip: string;
  };
  onBack: () => void;
}

export default function CheckoutForm({ customer, billing, onBack }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { items } = useCartStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isSubmitting = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || isSubmitting.current) return;

    isSubmitting.current = true;
    setIsLoading(true);
    setError('');

    // 1. Validate and Submit Elements
    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.error('[Stripe Submit Error]:', submitError);
      setError(submitError.message || 'Validation failed.');
      setIsLoading(false);
      isSubmitting.current = false;
      return;
    }

    // 2. Confirm Payment with Stripe
    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        // Detailed error extraction
        console.error('[Stripe Confirmation Error Detail]:', {
          code: stripeError.code,
          type: stripeError.type,
          message: stripeError.message,
          decline_code: (stripeError as any).decline_code
        });
        setError(stripeError.message || 'Payment failed.');
        setIsLoading(false);
        isSubmitting.current = false;
        return;
      }

      // Handle successful or processing states
      if (paymentIntent) {
        if (paymentIntent.status === 'succeeded') {
          try {
            // 3. Finalize Order with Odoo via Backend
            const res = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentIntentId: paymentIntent.id,
                customer,
                billing,
                items: items.map(i => ({ id: i.id, quantity: i.quantity }))
              })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to finalize order in Odoo.');

            // 4. Success!
            router.push(`/checkout/success?orderName=${encodeURIComponent(data.orderName)}`);
          } catch (err: any) {
            setError(err.message || 'Payment succeeded but we failed to record your order. Please contact support.');
            setIsLoading(false);
          } finally {
            isSubmitting.current = false;
          }
        } else if (paymentIntent.status === 'processing') {
          setError('Your payment is being processed. We will notify you once confirmed.');
          setIsLoading(false);
          isSubmitting.current = false;
        } else if (paymentIntent.status === 'requires_payment_method') {
          setError('Payment failed. Please try a different payment method.');
          setIsLoading(false);
          isSubmitting.current = false;
        } else {
          setError(`Payment status: ${paymentIntent.status}. Please check with your bank.`);
          setIsLoading(false);
          isSubmitting.current = false;
        }
      }
    } catch (err: any) {
      console.error('[Stripe Process Error]:', err);
      setError('An unexpected error occurred during processing.');
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#F0F0F0]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-[#2C2C2C] text-white rounded-full flex items-center justify-center font-black text-lg">2</div>
          <h2 className="text-2xl font-black text-[#2C2C2C] uppercase tracking-tight flex items-center gap-3">
            Payment Details
            <Lock size={16} className="text-[#C8A97E]" />
          </h2>
        </div>

        <div className="mb-8">
          <PaymentElement options={{ layout: 'tabs' }} />
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 mb-6">
            <AlertCircle size={18} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-8 py-5 rounded-full text-[11px] font-black uppercase tracking-widest text-[#888] border border-[#EAEAEA] hover:bg-[#F7F3EF] transition-all"
          >
            Go Back
          </button>
          <button 
            type="submit" 
            disabled={isLoading || !stripe || !elements}
            className="flex-[2] bg-[#C8A97E] text-white py-5 rounded-full text-[13px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#2C2C2C] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(200,169,126,0.2)]"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Verifying...
              </>
            ) : (
              <>
                Pay Now <CheckCircle size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
