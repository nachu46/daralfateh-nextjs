"use client";

import { ReactNode, useEffect, useState, useMemo } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeProviderProps {
  children: ReactNode;
  clientSecret: string | null;
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  if (!clientSecret) return <>{children}</>;

  const options = useMemo(() => ({
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#C8A97E',
        colorBackground: '#ffffff',
        colorText: '#2C2C2C',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, sans-serif',
        spacingUnit: '4px',
        borderRadius: '12px',
      },
      rules: {
        '.Input': {
          border: '1px solid #EAEAEA',
          boxShadow: 'none',
        },
        '.Input:focus': {
          border: '1px solid #C8A97E',
          boxShadow: '0 0 0 1px #C8A97E',
        },
      }
    },
  }), [clientSecret]);

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
