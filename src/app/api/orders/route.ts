import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, type OrderItem } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

const FREE_SHIPPING_THRESHOLD = 15000;
const SHIPPING_FLAT = 1000;

type IncomingItem = { slug?: unknown; size?: unknown; qty?: unknown };

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json();

    const customerName = String(body.customerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const city = String(body.city ?? "").trim();
    const address = String(body.address ?? "").trim();
    const notes = String(body.notes ?? "").trim();
    const rawItems: IncomingItem[] = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !phone || !city || !address) {
      return NextResponse.json(
        { error: "Missing delivery details" },
        { status: 400 },
      );
    }
    if (rawItems.length === 0) {
      return NextResponse.json({ error: "Bag is empty" }, { status: 400 });
    }

    const slugs = rawItems.map((i) => String(i.slug ?? ""));
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.slug, slugs));

    const items: OrderItem[] = [];
    for (const raw of rawItems) {
      const slug = String(raw.slug ?? "");
      const product = dbProducts.find((p) => p.slug === slug);
      if (!product || !product.inStock) {
        return NextResponse.json(
          { error: `Piece unavailable: ${slug}` },
          { status: 400 },
        );
      }
      const size = String(raw.size ?? product.sizes[0] ?? "ONE SIZE");
      if (!product.sizes.includes(size)) {
        return NextResponse.json(
          { error: `Invalid size for ${product.name}` },
          { status: 400 },
        );
      }
      const qty = Math.max(1, Math.min(99, Number(raw.qty) || 1));
      items.push({
        slug: product.slug,
        name: product.name,
        size,
        qty,
        priceCents: product.priceCents,
        image: product.image,
      });
    }

    const subtotalCents = items.reduce((s, i) => s + i.qty * i.priceCents, 0);
    const shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    const totalCents = subtotalCents + shippingCents;

    const [order] = await db
      .insert(orders)
      .values({
        customerName,
        phone,
        city,
        address,
        notes,
        items,
        subtotalCents,
        shippingCents,
        totalCents,
        status: "new",
      })
      .returning({ id: orders.id });

    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (err) {
    console.error("Order creation failed", err);
    return NextResponse.json(
      { error: "Could not place order" },
      { status: 500 },
    );
  }
}
