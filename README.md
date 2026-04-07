# Dar Al Fateh eCommerce Platform

A premium headless eCommerce application combining a sleek **Next.js frontend** and a robust **Odoo backend**.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
4. [Sample API Responses](#sample-api-responses)
5. [Deployment Instructions](#deployment-instructions)

---

## Architecture Overview
- **Frontend**: Next.js (App Router), React, Zustand (State Management), Tailwind CSS v4, Lucide React (Icons).
- **Backend**: Odoo Headless Custom API module processing JSON Requests over REST.
- **Design System**: A vibrant, grid-oriented and information-dense layout perfectly recreating the premium Kibsons UI/UX. Includes a dedicated category navigation bar, split promotional hero banners, and a circular featured categories section.

---

## Project Structure

```text
daralfateh/
├── frontend/             # Next.js App Router application
│   ├── src/app/          # Pages and routing (cart, checkout, etc.)
│   ├── src/components/   # Reusable UI components (CategoryNav, HeroBanner, etc.)
│   └── src/store/        # Zustand state management
└── odoo/                 # Odoo backend modules
    └── custom_api/       # REST API endpoints for the headless setup
        ├── controllers/  # API route definitions (Products, Categories, etc.)
        └── models/       # Odoo model extensions
```

---

## Step-by-Step Setup Guide

### 1. Backend (Odoo 18) Setup
1. **Install Dependencies**: Ensure you have an Odoo 18 instance running with `website_sale` and `sale_management` installed.
2. **Copy Module**: Copy the `/odoo/custom_api` folder to your Odoo `addons` path.
3. **Install Module**:
   - Restart your Odoo server.
   - Go to **Settings**, scroll down, and click **Activate the developer mode**.
   - Go to **Apps**, click **Update Apps List**.
   - Search for "Dar Al Fateh APIs" and click **Activate/Install**.
4. **CORS Configuration**:
   - The module natively supports CORS through an `OPTIONS` preflight route handling `Access-Control-Allow-Origin`. 

### 2. Frontend (Next.js) Setup
1. **Navigate**: `cd frontend`
2. **Install node modules**: `npm install`
3. **Environment Setup**: Add a `.env.local` file inside `frontend/` with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8069
   ```
4. **Run Server**: `npm run dev`
5. **View UI**: Open http://localhost:3000

---

## Sample API Responses

The custom API module exposes several REST endpoints:

- `GET /api/products` - Filterable list of products (supports `limit`, `offset`, `category_id`).
- `GET /api/products/<id>` - Detailed view of a single product.
- `GET /api/categories` - Top-level product categories.

### `GET /api/products`
Retrieves a list of active products formatted for grid display.
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Organic Hass Avocados (Pack of 3)",
      "price": 24.50,
      "description": "Rich, creamy, and 100% organic.",
      "category": [
        {"id": 15, "name": "Fresh Fruits"}
      ],
      "image_url": "/web/image/product.template/1/image_1920"
    }
  ]
}
```

### `GET /api/categories`
Retrieves public product categories.
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": 15,
        "name": "Fresh Fruits",
        "parent_id": null
      }
    ]
  }
}
```

---

## Deployment Instructions

### Frontend (Vercel Deployment)
1. Push the `frontend` folder to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Set the Framework Preset to **Next.js**.
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL=https://api.daralfateh.com`
6. Click **Deploy**. Vercel will build and host the fast CDN-cached frontend. Map it to `daralfateh.com`.

### Backend (Odoo VPS on DigitalOcean)
1. Provision a DigitalOcean Ubuntu Droplet (Minimum 2GB RAM / 2 vCPUs).
2. Install PostgreSQL and configure your Odoo system using standard installation scripts.
3. Put the `custom_api` code inside `/opt/odoo/addons/`.
4. Run Odoo securely behind an Nginx reverse proxy. Request an SSL certificate via Let's Encrypt for `api.daralfateh.com`.

**Example Nginx config for API**:
```nginx
server {
    listen 443 ssl;
    server_name api.daralfateh.com;
    
    location / {
        proxy_pass http://127.0.0.1:8069;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```