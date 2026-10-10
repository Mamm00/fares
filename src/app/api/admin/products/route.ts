import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { parseProductPayload } from "@/lib/payload";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = parseProductPayload(body);
    const [created] = await db.insert(products).values(data).returning();
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    const duplicate =
      typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "23505";
    return NextResponse.json(
      { error: duplicate ? "A product with this slug already exists" : message },
      { status: duplicate ? 409 : 400 },
    );
  }
}
