# FARES MASHOUR — Clothing Brand Website

Static storefront + admin panel. No build step, no backend needed.

## Pages
- index.html   — Home: hero, category cards, featured products
- shop.html    — Full catalog with category filter pills (?cat=T-Shirts works too)
- admin.html   — Admin panel (default password: admin123 — change it inside)

## Admin panel can:
- Add / edit / delete products (name, category, price, badge, sizes, image)
- Edit announcement bar, hero title, hero subtitle
- Export / import the whole catalog as JSON (for backups)
- Change admin password
All changes are saved in the browser (localStorage) and appear instantly on the store.

## Deploy free on Vercel (recommended)
1. Create a NEW private repo on GitHub named `fares-mashour` (do NOT paste tokens anywhere).
2. Upload all these files (keep the folder structure) and commit.
3. Go to vercel.com -> "Add New Project" -> import the repo -> Deploy. Done.
   Vercel auto-deploys every future commit — no tokens needed.

## Or GitHub Pages
Repo -> Settings -> Pages -> Source: main branch / root -> Save.
