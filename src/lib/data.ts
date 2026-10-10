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

export type ProductWithCategory = Product & { categoryName: string | null; categorySlug: string | null };
export type CategoryWithCount = Category & { productCount: number };

export type ProductSort = "new" | "price-asc" | "price-desc" | "name";

export async function listCategories(): Promise<CategoryWithCount[]> {
  await ensureSeeded();
  return db
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
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return rows[0];
}

export async function listProducts(options?: {
  categorySlug?: string;
  sort?: ProductSort;
  featured?: boolean;
  limit?: number;
}): Promise<ProductWithCategory[]> {
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
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCategory | undefined> {
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
  return { ...r.product, categoryName: r.categoryName ?? null, categorySlug: r.categorySlug ?? null };
}

export async function getProductById(id: number): Promise<Product | undefined> {
  await ensureSeeded();
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0];
}

export async function listOrders(): Promise<Order[]> {
  await ensureSeeded();
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function dashboardStats() {
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
}
