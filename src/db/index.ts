import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

type DrizzleDb = ReturnType<typeof drizzle>;

// Global singletons – survive hot-reload in dev
const globalForDb = globalThis as typeof globalThis & {
  __fmPool?: Pool;
  __fmDb?: DrizzleDb;
};

/**
 * Returns the pg Pool, creating it on first call.
 * Throws a clear error at RUNTIME (not import time) when DATABASE_URL is missing.
 * This allows `next build` to complete without env vars (Vercel CI).
 */
export function getPool(): Pool {
  if (globalForDb.__fmPool) return globalForDb.__fmPool;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Add it in Vercel → Project Settings → Environment Variables.",
    );
  }

  const pool = new Pool({
    connectionString: url,
    // Vercel serverless: keep pool small
    max: 3,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl:
      url.includes("localhost") || url.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
  });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__fmPool = pool;
  } else {
    globalForDb.__fmPool = pool;
  }

  return pool;
}

export function getDb(): DrizzleDb {
  if (globalForDb.__fmDb) return globalForDb.__fmDb;
  const instance = drizzle(getPool());
  globalForDb.__fmDb = instance;
  return instance;
}

/**
 * Lazy proxy – importing this module never opens a connection or reads env vars.
 * The real instance is created on first property access (i.e. first query).
 */
function makeLazy<T extends object>(factory: () => T): T {
  let instance: T | null = null;
  return new Proxy({} as T, {
    get(_t, prop, receiver) {
      if (!instance) instance = factory();
      const val = Reflect.get(instance, prop, receiver);
      return typeof val === "function" ? val.bind(instance) : val;
    },
    has(_t, prop) {
      if (!instance) instance = factory();
      return Reflect.has(instance, prop);
    },
  });
}

export const pool: Pool = makeLazy(getPool);
export const db: DrizzleDb = makeLazy(getDb);
