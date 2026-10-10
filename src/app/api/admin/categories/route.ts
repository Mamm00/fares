import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { parseCategoryPayload } from "@/lib/payload";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = parseCategoryPayload(body);
    const [created] = await db.insert(categories).values(data).returning();
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create category";
    const duplicate =
      typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "23505";
    return NextResponse.json(
      { error: duplicate ? "A category with this slug already exists" : message },
      { status: duplicate ? 409 : 400 },
    );
  }
}
