import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

type Db = ReturnType<typeof drizzle>;

const globalForDb = globalThis as typeof globalThis & {
  __fmPool?: Pool;
  __fmDb?: Db;
};

function getPool(): Pool {
  if (globalForDb.__fmPool) return globalForDb.__fmPool;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  globalForDb.__fmPool = new Pool({ connectionString: databaseUrl });
  return globalForDb.__fmPool;
}

function getDb(): Db {
  if (globalForDb.__fmDb) return globalForDb.__fmDb;
  globalForDb.__fmDb = drizzle(getPool());
  return globalForDb.__fmDb;
}

/**
 * Lazily bind to the underlying instance so importing this module never
 * touches env vars or opens connections — required so `next build` page-data
 * collection works without DATABASE_URL (e.g. on Vercel CI). The error only
 * surfaces if an actual query runs without the variable set (runtime only).
 */
function lazy<T extends object>(get: () => T): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      const real = get() as unknown as Record<PropertyKey, unknown>;
      const value = Reflect.get(real, prop);
      return typeof value === "function"
        ? (value as (...args: unknown[]) => unknown).bind(real)
        : value;
    },
  });
}

export const pool = lazy(getPool);
export const db = lazy(getDb);
