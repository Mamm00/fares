"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 text-ink">
      <div className="w-full max-w-md">
        <p className="text-center font-display text-4xl uppercase leading-none">
          Fares Mashour<span className="text-ember">®</span>
        </p>
        <p className="pt-3 text-center font-mono text-[10px] tracking-[0.4em] text-ink/40">
          BACK OFFICE — AUTHORIZED ONLY
        </p>

        <form
          onSubmit={submit}
          className="mt-10 border border-ink/15 bg-white p-8 shadow-[8px_8px_0_0_rgba(10,10,11,1)]"
        >
          <label className="block">
            <span className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-ink/50">
              <Lock size={12} /> ADMIN PASSWORD
            </span>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-ink/20 bg-cream px-4 py-3.5 font-mono text-sm tracking-widest outline-none focus:border-ember"
            />
          </label>

          {error && (
            <p className="mt-4 border border-ember bg-ember/10 px-4 py-2.5 font-mono text-[11px] tracking-widest text-ember">
              {error.toUpperCase()}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-press mt-6 flex w-full items-center justify-center gap-3 bg-ink py-4 font-mono text-xs font-bold tracking-[0.35em] text-cream hover:bg-ember hover:text-ink disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
            ENTER THE STUDIO
          </button>

          <p className="pt-5 text-center font-mono text-[10px] leading-relaxed tracking-widest text-ink/35">
            DEFAULT: fares2025 — CHANGE WITH ADMIN_PASSWORD ENV VAR
          </p>
        </form>
      </div>
    </main>
  );
}
