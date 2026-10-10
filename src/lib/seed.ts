import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { sql } from "drizzle-orm";

const TEE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PANT_SIZES = ["S", "M", "L", "XL"];
const ONE_SIZE = ["ONE SIZE"];

const CATEGORY_SEED = [
  {
    name: "T-Shirts",
    slug: "t-shirts",
    description:
      "Heavyweight 240 GSM cotton tees. Boxy cuts, dropped shoulders, the Fares Mashour signature across the chest.",
    image: "/images/tee-black.jpg",
  },
  {
    name: "Hoodies",
    slug: "hoodies",
    description:
      "Brushed-back fleece hoodies built like armour. Oversized silhouettes made for cold nights and loud cities.",
    image: "/images/hoodie-black.jpg",
  },
  {
    name: "Bottoms",
    slug: "bottoms",
    description:
      "Relaxed heavyweight sweatpants and bottoms engineered to move. Cut to stack perfectly over sneakers.",
    image: "/images/sweatpants.jpg",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description:
      "Finishing touches. Embroidered caps and everyday carry pieces stamped with the FM monogram.",
    image: "/images/cap.jpg",
  },
];

const PRODUCT_SEED = [
  {
    name: "Signature Heavyweight Tee — Black",
    slug: "signature-tee-black",
    description:
      "The one that started it all. A 240 GSM heavyweight cotton tee cut boxy with dropped shoulders and a ribbed collar that refuses to sag. The FARES MASHOUR collegiate print sits bold across the chest — no small logos, no apologies.",
    priceCents: 6500,
    compareAtCents: null,
    categorySlug: "t-shirts",
    image: "/images/tee-black.jpg",
    images: ["/images/tee-black.jpg"],
    sizes: TEE_SIZES,
    color: "Jet Black",
    badge: "NEW",
    featured: true,
    inStock: true,
  },
  {
    name: "Signature Heavyweight Tee — White",
    slug: "signature-tee-white",
    description:
      "Off-white, bone-clean, impossible to ignore. Same heavyweight 240 GSM body, same boxy FM cut, flipped in black collegiate type.",
    priceCents: 6500,
    compareAtCents: null,
    categorySlug: "t-shirts",
    image: "/images/tee-white.jpg",
    images: ["/images/tee-white.jpg"],
    sizes: TEE_SIZES,
    color: "Bone White",
    badge: null,
    featured: true,
    inStock: true,
  },
  {
    name: "Signature Heavyweight Tee — Sand",
    slug: "signature-tee-sand",
    description:
      "Desert tones, city attitude. The sand colourway pairs an ecru heavyweight body with espresso-brown chest type.",
    priceCents: 6500,
    compareAtCents: null,
    categorySlug: "t-shirts",
    image: "/images/tee-sand.jpg",
    images: ["/images/tee-sand.jpg"],
    sizes: TEE_SIZES,
    color: "Sand Ecru",
    badge: null,
    featured: false,
    inStock: true,
  },
  {
    name: "FM Monogram Graphic Tee",
    slug: "fm-monogram-graphic-tee",
    description:
      "The limited one. An oversized front graphic carrying the giant FM monogram with a single ember-orange strike underneath.",
    priceCents: 7200,
    compareAtCents: 8800,
    categorySlug: "t-shirts",
    image: "/images/tee-graphic.jpg",
    images: ["/images/tee-graphic.jpg"],
    sizes: TEE_SIZES,
    color: "Jet Black",
    badge: "LIMITED",
    featured: true,
    inStock: true,
  },
  {
    name: "Oversized Fleece Hoodie — Black",
    slug: "oversized-hoodie-black",
    description:
      "450 GSM brushed-back fleece that hangs like armour. Double-lined hood, hidden phone pocket inside the kangaroo pouch.",
    priceCents: 12000,
    compareAtCents: null,
    categorySlug: "hoodies",
    image: "/images/hoodie-black.jpg",
    images: ["/images/hoodie-black.jpg"],
    sizes: TEE_SIZES,
    color: "Jet Black",
    badge: "NEW",
    featured: true,
    inStock: true,
  },
  {
    name: "Oversized Fleece Hoodie — Heather Grey",
    slug: "oversized-hoodie-grey",
    description:
      "The quiet flex. Heather grey fleece with black collegiate type — the hoodie that goes with everything you own.",
    priceCents: 12000,
    compareAtCents: null,
    categorySlug: "hoodies",
    image: "/images/hoodie-grey.jpg",
    images: ["/images/hoodie-grey.jpg"],
    sizes: TEE_SIZES,
    color: "Heather Grey",
    badge: null,
    featured: false,
    inStock: true,
  },
  {
    name: "Logo Sweatpants — Black",
    slug: "logo-sweatpants-black",
    description:
      "Relaxed through the thigh, stacked at the cuff. Heavyweight loopback sweatpants with a tonal drawstring.",
    priceCents: 9500,
    compareAtCents: null,
    categorySlug: "bottoms",
    image: "/images/sweatpants.jpg",
    images: ["/images/sweatpants.jpg"],
    sizes: PANT_SIZES,
    color: "Jet Black",
    badge: null,
    featured: false,
    inStock: true,
  },
  {
    name: "FM Embroidered Cap",
    slug: "fm-embroidered-cap",
    description:
      "Six panels, zero compromise. A structured black cap with the FM monogram embroidered in raised white thread.",
    priceCents: 4500,
    compareAtCents: null,
    categorySlug: "accessories",
    image: "/images/cap.jpg",
    images: ["/images/cap.jpg"],
    sizes: ONE_SIZE,
    color: "Jet Black",
    badge: "LOW STOCK",
    featured: true,
    inStock: true,
  },
];

async function tablesExist(): Promise<boolean> {
  try {
    await db.execute(
      sql`SELECT 1 FROM information_schema.tables WHERE table_name = 'categories' AND table_schema = 'public'`,
    );
    // Actually check if we can query the table
    await db.execute(sql`SELECT 1 FROM categories LIMIT 1`);
    return true;
  } catch {
    return false;
  }
}

async function doSeed(): Promise<void> {
  // Bail out gracefully if DB unreachable or tables don't exist yet
  const ready = await tablesExist().catch(() => false);
  if (!ready) return;

  const count = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(categories);
  if (Number(count[0]?.n ?? 0) > 0) return;

  const insertedCats = await db
    .insert(categories)
    .values(CATEGORY_SEED)
    .returning({ id: categories.id, slug: categories.slug });

  const catIdBySlug = new Map(insertedCats.map((c) => [c.slug, c.id]));

  await db.insert(products).values(
    PRODUCT_SEED.map(({ categorySlug, ...p }) => ({
      ...p,
      categoryId: catIdBySlug.get(categorySlug) ?? null,
    })),
  );
}

let seeded: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seeded) {
    seeded = doSeed().catch((err) => {
      console.error("[FM seed] failed:", err?.message ?? err);
      seeded = null; // allow retry on next request
    });
  }
  return seeded;
}
