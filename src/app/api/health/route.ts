import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Basic health — always returns 200 so Vercel preview passes
  const hasDb = Boolean(process.env.DATABASE_URL);

  if (!hasDb) {
    return NextResponse.json(
      { ok: true, db: false, message: "DATABASE_URL not configured" },
      { status: 200 },
    );
  }

  try {
    const { getDb } = await import("@/db");
    const { sql } = await import("drizzle-orm");
    await getDb().execute(sql`SELECT 1`);
    return NextResponse.json({ ok: true, db: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "DB error";
    return NextResponse.json(
      { ok: true, db: false, message },
      { status: 200 },
    );
  }
}
