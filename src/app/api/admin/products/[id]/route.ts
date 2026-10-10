import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { parseProductPayload } from "@/lib/payload";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await request.json();

    // Quick toggles (stock / featured)
    if (body.toggle !== undefined) {
      if (body.toggle !== "inStock" && body.toggle !== "featured") {
        return NextResponse.json({ error: "Invalid toggle" }, { status: 400 });
      }
      const patch =
        body.toggle === "inStock"
          ? { inStock: Boolean(body.value) }
          : { featured: Boolean(body.value) };
      const [updated] = await db
        .update(products)
        .set(patch)
        .where(eq(products.id, numId))
        .returning();
      if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(updated);
    }

    const data = parseProductPayload(body);
    const [updated] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, numId))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update product";
    const duplicate =
      typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "23505";
    return NextResponse.json(
      { error: duplicate ? "A product with this slug already exists" : message },
      { status: duplicate ? 409 : 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await db.delete(products).where(eq(products.id, numId));
  return NextResponse.json({ ok: true });
}
