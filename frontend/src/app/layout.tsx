import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dar Al Fateh | Premium Online Grocery",
  description: "Fresh groceries, organic produce, and premium household essentials delivered to you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
        
        {/* Simple Footer */}
        <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-16">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <h3 className="text-xl font-bold text-[var(--color-brand-green)] mb-2">Dar Al Fateh</h3>
            <p className="text-slate-500 text-sm mb-6">Premium delivery app. Inspired by the best, built for excellence.</p>
            <div className="text-slate-400 text-xs uppercase tracking-widest font-bold">
              © {new Date().getFullYear()} Dar Al Fateh. All Rights Reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
