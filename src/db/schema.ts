import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull().default(0),
  compareAtCents: integer("compare_at_cents"),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  image: text("image").notNull().default(""),
  images: jsonb("images").$type<string[]>().notNull(),
  sizes: jsonb("sizes").$type<string[]>().notNull(),
  color: text("color").notNull().default(""),
  badge: text("badge"),
  featured: boolean("featured").notNull().default(false),
  inStock: boolean("in_stock").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type OrderItem = {
  slug: string;
  name: string;
  size: string;
  qty: number;
  priceCents: number;
  image: string;
};

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull().default(""),
  address: text("address").notNull().default(""),
  notes: text("notes").notNull().default(""),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  subtotalCents: integer("subtotal_cents").notNull().default(0),
  shippingCents: integer("shipping_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type NewCategory = typeof categories.$inferInsert;
