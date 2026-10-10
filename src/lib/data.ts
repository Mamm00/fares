import { db } from "@/db";
import {
  categories,
  orders,
  products,
  type Category,
  type Order,
  type Product,
} from "@/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { ensureSeeded } from "./seed";

export type ProductWithCategory = Product & {
  categoryName: string | null;
  categorySlug: string | null;
};
export type CategoryWithCount = Category & { productCount: number };
export type ProductSort = "new" | "price-asc" | "price-desc" | "name";

/* ------------------------------------------------------------------ */
/*  DB availability check                                               */
/* ------------------------------------------------------------------ */
export async function isDbAvailable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Categories                                                          */
/* ------------------------------------------------------------------ */
export async function listCategories(): Promise<CategoryWithCount[]> {
  try {
    await ensureSeeded();
    return await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        image: categories.image,
        createdAt: categories.createdAt,
        productCount: sql<number>`count(${products.id})::int`,
      })
      .from(categories)
      .leftJoin(products, eq(products.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(asc(categories.id));
  } catch (err) {
    console.error("[FM] listCategories error:", err);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    return rows[0];
  } catch (err) {
    console.error("[FM] getCategoryBySlug error:", err);
    return undefined;
  }
}

/* ------------------------------------------------------------------ */
/*  Products                                                            */
/* ------------------------------------------------------------------ */
export async function listProducts(options?: {
  categorySlug?: string;
  sort?: ProductSort;
  featured?: boolean;
  limit?: number;
}): Promise<ProductWithCategory[]> {
  try {
    await ensureSeeded();
    const sort = options?.sort ?? "new";
    const orderBy =
      sort === "price-asc"
        ? [asc(products.priceCents)]
        : sort === "price-desc"
          ? [desc(products.priceCents)]
          : sort === "name"
            ? [asc(products.name)]
            : [desc(products.createdAt), desc(products.id)];

    const base = db
      .select({
        product: products,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));

    const rows = options?.categorySlug
      ? await base
          .where(eq(categories.slug, options.categorySlug))
          .orderBy(...orderBy)
      : await base.orderBy(...orderBy);

    const mapped = rows.map((r) => ({
      ...r.product,
      categoryName: r.categoryName ?? null,
      categorySlug: r.categorySlug ?? null,
    }));

    const filtered =
      options?.featured === undefined
        ? mapped
        : mapped.filter((p) => p.featured === options.featured);

    return options?.limit ? filtered.slice(0, options.limit) : filtered;
  } catch (err) {
    console.error("[FM] listProducts error:", err);
    return [];
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCategory | undefined> {
  try {
    await ensureSeeded();
    const rows = await db
      .select({
        product: products,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.slug, slug))
      .limit(1);
    const r = rows[0];
    if (!r) return undefined;
    return {
      ...r.product,
      categoryName: r.categoryName ?? null,
      categorySlug: r.categorySlug ?? null,
    };
  } catch (err) {
    console.error("[FM] getProductBySlug error:", err);
    return undefined;
  }
}

export async function getProductById(id: number): Promise<Product | undefined> {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    return rows[0];
  } catch (err) {
    console.error("[FM] getProductById error:", err);
    return undefined;
  }
}

/* ------------------------------------------------------------------ */
/*  Orders                                                              */
/* ------------------------------------------------------------------ */
export async function listOrders(): Promise<Order[]> {
  try {
    await ensureSeeded();
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (err) {
    console.error("[FM] listOrders error:", err);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                           */
/* ------------------------------------------------------------------ */
export async function dashboardStats() {
  try {
    await ensureSeeded();
    const [p] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(products);
    const [c] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(categories);
    const [o] = await db
      .select({
        total: sql<number>`count(*)::int`,
        fresh: sql<number>`count(*) filter (where ${orders.status} = 'new')::int`,
        revenue: sql<number>`coalesce(sum(${orders.totalCents}) filter (where ${orders.status} <> 'cancelled'), 0)::int`,
      })
      .from(orders);
    return {
      products: Number(p?.n ?? 0),
      categories: Number(c?.n ?? 0),
      orders: Number(o?.total ?? 0),
      newOrders: Number(o?.fresh ?? 0),
      revenueCents: Number(o?.revenue ?? 0),
    };
  } catch (err) {
    console.error("[FM] dashboardStats error:", err);
    return {
      products: 0,
      categories: 0,
      orders: 0,
      newOrders: 0,
      revenueCents: 0,
    };
  }
}
