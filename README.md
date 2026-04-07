# Dar Al Fateh: Headless Boutique eCommerce

A high-end, bespoke eCommerce platform merging a **Next.js 15** storefront with an **Odoo 18** enterprise backend. Designed for a "Human-Crafted" luxury experience, focusing on minimalist aesthetics and secure, native Odoo transactions.

---

## ✨ Key Features

### 🎨 "Humanized" Luxury Design
- **Boutique Pantry**: A refined, sidebar-driven cart experience with architectural spacing and luxury typography.
- **Micro-Animations**: Delicate `700ms` transitions and top-centered "Pill" notifications (Toaster) for a premium, non-generic feel.
- **Outfit Typography**: Curated font pairings with generous letter-spacing to mirror high-end fashion and lifestyle brands.

### 💳 Enterprise Odoo 18 Bridge
- **Native Checkout**: Fully secure, PCI-compliant checkout handled by Odoo's native payment portal (Stripe, PayPal, etc.).
- **Guest Synchronization**: Real-time `res.partner` creation and `sale.order` confirmation (`draft` -> `sale`) for every transaction.
- **Odoo 18 Variant Support**: Deep integration with Odoo's product models, ensuring accurate inventory and pricing sync via JSON-RPC.

### ⚡ Technical Excellence
- **Server-Side Bridge**: All Odoo communication is proxied through a secure server-side layer (`odoo.ts`) to hide credentials.
- **Reactive Math**: Stable `useMemo` based total calculations to ensure cart amounts are always 100% accurate.
- **Cloudflare Resilience**: Robust error handling for ephemeral Cloudflare tunnels (TryCloudflare support).

---

## 🏗️ Project Structure

```text
daralfateh/
├── frontend/             # Next.js 15 Application
│   ├── src/app/          # Pages (Shop, Cart, Product, API Routes)
│   ├── src/components/   # Bespoke UI (Header, CheckoutForm, Toaster, CartDrawer)
│   ├── src/lib/          # Secure Odoo JSON-RPC Library
│   └── src/store/        # Zustand Persistence (Cart & Notifications)
└── odoo/                 # Odoo Backend Modules
    └── website_shop_luxury/  # Odoo-side luxury shop overrides
```

---

## 🚀 Setup Guide

### 1. Odoo 18 Configuration
1. Ensure `website_sale` and `sale_management` are installed.
2. Configure at least one **Payment Provider** (Stripe, Razorpay, etc.) in `Settings -> Payment Providers`.
3. Set up a **Cloudflare Tunnel** if running locally to expose your Odoo JSON-RPC endpoint.

### 2. Frontend Configuration
1. Navigate to `/frontend` and run `npm install`.
2. Create a `.env.local` file:
   ```env
   # Odoo Connection (Server-Side Only)
   ODOO_URL=https://your-tunnel-url.trycloudflare.com
   ODOO_DB=your_database_name
   ODOO_USERNAME=your_admin_user
   ODOO_PASSWORD=your_password
   ```
3. Run the development server: `npm run dev`.

---

## 🛠️ Developer Notes

- **Checkout Flow**: The `api/checkout` route is the orchestrator. It creates the partner, confirms the sale order, and retrieves the secure portal payment link in a single atomic flow.
- **Cart math**: Never destructure `totalAmount` directly from the store; use the reactive selectors implemented in `CartPage` or `CartDrawer` to ensure reactivity.
- **Error Logs**: If you see "Unexpected Token <", your Cloudflare tunnel has likely expired and needs a restart.

---

## 📜 Deployment

- **Frontend**: Deploy to **Vercel** or **Netlify**. Ensure all ODOO environment variables are added to the production cabinet.
- **Backend**: Deploy Odoo 18 on a dedicated VPS with an SSL-enabled Nginx proxy for the JSON-RPC interface.

---

*✧ Crafted for the luxury pantry experience of Dar Al Fateh ✧*