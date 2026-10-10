# FARES MASHOUR® — Heavyweight Streetwear

A full-stack e-commerce experience for the **Fares Mashour** clothing label: cinematic dark storefront, filterable catalog, category collections, working bag + cash-on-delivery checkout, and a complete admin back-office — powered by Next.js, PostgreSQL and Drizzle ORM.

## Features

### Storefront
- Editorial homepage with AI-generated campaign photography, marquee tickers, scroll-reveal motion and a horizontal product rail
- **Catalog** (`/catalog`) — category filtering + sorting (newest, price, A–Z)
- **Category pages** (`/category/t-shirts`, `/hoodies`, `/bottoms`, `/accessories`) with full-bleed banners
- **Product pages** — size/quantity selection, sale badges, accordions, related pieces
- **Bag + Checkout** — slide-out bag drawer (localStorage), COD checkout with server-side stock/size validation and free shipping over $150

### Admin Back-Office (`/admin`)
- Dashboard — revenue, orders, inventory stats, recent activity
- **Products** — full CRUD, image picker, galleries, sizes, badges, compare-at sale pricing, one-click stock/featured toggles
- **Categories** — full CRUD with live product counts
- **Orders** — expandable details, status pipeline (new → confirmed → fulfilled → cancelled)
- HMAC-signed session cookies; all admin APIs are protected

### Database
- PostgreSQL via Drizzle ORM (`categories`, `products`, `orders`)
- Auto-seeds 4 categories + 8 products on first request when empty

## Tech Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · Drizzle ORM · PostgreSQL · Lucide icons · next/font (Anton, Archivo, Space Mono)

## Quickstart

```bash
npm install

# configure environment
cp .env.example .env   # then edit values

# start PostgreSQL locally, then push the schema
npx drizzle-kit push

# run
npm run dev
```

Open http://localhost:3000 — the catalog seeds itself on first load.

**Admin:** http://localhost:3000/admin — default password `fares2025`
(change it with the `ADMIN_PASSWORD` env variable).

## Environment Variables

| Variable         | Description                                    |
| ---------------- | ---------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string                   |
| `ADMIN_PASSWORD` | Password for the `/admin` back-office          |
| `ADMIN_SECRET`   | Random string used to sign admin cookies       |

## Deploy to Vercel

1. Push this repo to GitHub
2. [vercel.com/new](https://vercel.com/new) → **Import** the repository
3. Add a Postgres database (Vercel Postgres, Neon, Supabase…) and set `DATABASE_URL`
4. Set `ADMIN_PASSWORD` and `ADMIN_SECRET`
5. Deploy — then run `npx drizzle-kit push` once with the production `DATABASE_URL` to create tables

---

© FARES MASHOUR® — Heavyweight only. No compromise.
