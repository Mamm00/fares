"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import type { Category, Product } from "@/db/schema";
import { KNOWN_IMAGES } from "@/lib/images";
import { slugify } from "@/lib/format";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "ONE SIZE"];
const BADGES = ["", "NEW", "LIMITED", "LOW STOCK"];

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Product;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    price: initial ? (initial.priceCents / 100).toString() : "",
    compareAt: initial?.compareAtCents ? (initial.compareAtCents / 100).toString() : "",
    categoryId: initial?.categoryId ? String(initial.categoryId) : "",
    color: initial?.color ?? "",
    badge: initial?.badge ?? "",
    image: initial?.image ?? KNOWN_IMAGES[0].src,
    gallery: (initial?.images ?? []).join("\n"),
    sizes: initial?.sizes ?? ["S", "M", "L", "XL"],
    featured: initial?.featured ?? false,
    inStock: initial?.inStock ?? true,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function toggleSize(size: string) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: form.price,
        compareAt: form.compareAt || null,
        categoryId: form.categoryId || null,
        color: form.color,
        badge: form.badge || null,
        image: form.image,
        images: form.gallery.split("\n").map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes,
        featured: form.featured,
        inStock: form.inStock,
      };
      const res = await fetch(
        initial ? `/api/admin/products/${initial.id}` : "/api/admin/products",
        {
          method: initial ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* Main */}
      <div className="space-y-6 xl:col-span-2">
        <section className="border border-ink/15 bg-white p-6 shadow-[5px_5px_0_0_rgba(10,10,11,1)]">
          <h2 className="font-display text-xl uppercase">Basics</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="PRODUCT NAME *" className="sm:col-span-2">
              <input
                required
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
                className="admin-input"
                placeholder="Signature Heavyweight Tee — Black"
              />
            </Field>
            <Field label="URL SLUG *">
              <input
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
                className="admin-input"
                placeholder="signature-tee-black"
              />
            </Field>
            <Field label="COLORWAY">
              <input
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                className="admin-input"
                placeholder="Jet Black"
              />
            </Field>
            <Field label="DESCRIPTION" className="sm:col-span-2">
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className="admin-input resize-none"
                placeholder="Tell the story of the piece…"
              />
            </Field>
          </div>
        </section>

        <section className="border border-ink/15 bg-white p-6 shadow-[5px_5px_0_0_rgba(10,10,11,1)]">
          <h2 className="font-display text-xl uppercase">Pricing</h2>
          <div className="mt-5 grid grid-cols-2 gap-5">
            <Field label="PRICE (USD) *">
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="admin-input"
                placeholder="65"
              />
            </Field>
            <Field label="COMPARE-AT PRICE (OPTIONAL)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.compareAt}
                onChange={(e) => set("compareAt", e.target.value)}
                className="admin-input"
                placeholder="88"
              />
            </Field>
          </div>
          <p className="pt-3 font-mono text-[10px] tracking-widest text-ink/35">
            SET A COMPARE-AT PRICE TO SHOW A STRIKETHROUGH SALE BADGE.
          </p>
        </section>

        <section className="border border-ink/15 bg-white p-6 shadow-[5px_5px_0_0_rgba(10,10,11,1)]">
          <h2 className="font-display text-xl uppercase">Gallery</h2>
          <p className="pt-1 font-mono text-[10px] tracking-widest text-ink/35">
            EXTRA PHOTOS — ONE URL PER LINE. FIRST PHOTO IS ALREADY THE MAIN IMAGE.
          </p>
          <textarea
            rows={3}
            value={form.gallery}
            onChange={(e) => set("gallery", e.target.value)}
            className="admin-input mt-4 resize-none font-mono text-xs"
            placeholder={"/images/tee-black.jpg"}
          />
        </section>
      </div>

      {/* Side */}
      <div className="space-y-6">
        <section className="border border-ink/15 bg-white p-6 shadow-[5px_5px_0_0_rgba(10,10,11,1)]">
          <h2 className="font-display text-xl uppercase">Main Image</h2>
          <div className="mt-4 aspect-[4/5] w-full overflow-hidden bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image} alt="Main product" className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {KNOWN_IMAGES.map((img) => (
              <button
                type="button"
                key={img.src}
                title={img.label}
                onClick={() => set("image", img.src)}
                className={`relative aspect-square overflow-hidden border-2 transition-all ${
                  form.image === img.src
                    ? "border-ember"
                    : "border-transparent hover:border-ink/30"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                {form.image === img.src && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ember/30">
                    <Check size={14} className="text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
          <Field label="OR CUSTOM IMAGE URL" className="mt-4">
            <input
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              className="admin-input font-mono text-xs"
              placeholder="/images/… or https://…"
            />
          </Field>
        </section>

        <section className="border border-ink/15 bg-white p-6 shadow-[5px_5px_0_0_rgba(10,10,11,1)]">
          <h2 className="font-display text-xl uppercase">Organize</h2>
          <div className="mt-5 space-y-5">
            <Field label="CATEGORY">
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="admin-input"
              >
                <option value="">— Uncategorized —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="BADGE">
              <select
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
                className="admin-input"
              >
                {BADGES.map((b) => (
                  <option key={b} value={b}>
                    {b === "" ? "— None —" : b}
                  </option>
                ))}
              </select>
            </Field>
            <div>
              <p className="mb-2 font-mono text-[10px] tracking-[0.3em] text-ink/50">
                AVAILABLE SIZES
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`btn-press border px-3 py-2 font-mono text-[10px] font-bold tracking-widest ${
                      form.sizes.includes(size)
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/20 text-ink/50 hover:border-ink"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3 border-t border-ink/10 pt-4">
              {[
                { key: "inStock" as const, label: "IN STOCK — VISIBLE & BUYABLE" },
                { key: "featured" as const, label: "FEATURED — SHOWS ON HOMEPAGE" },
              ].map((opt) => (
                <label key={opt.key} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form[opt.key]}
                    onChange={(e) => set(opt.key, e.target.checked)}
                    className="h-4 w-4 accent-[#ff4d00]"
                  />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-ink/60">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {error && (
          <p className="border border-ember bg-ember/10 px-4 py-3 font-mono text-[11px] tracking-widest text-ember">
            {error.toUpperCase()}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-press flex w-full items-center justify-center gap-3 bg-ink py-4 font-mono text-xs font-bold tracking-[0.35em] text-cream hover:bg-ember hover:text-ink disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          {initial ? "SAVE CHANGES" : "CREATE PRODUCT"}
        </button>
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border: 1px solid rgba(10, 10, 11, 0.2);
          background: var(--color-cream);
          padding: 0.7rem 0.9rem;
          font-size: 0.85rem;
          color: var(--color-ink);
          transition: border-color 0.2s ease;
        }
        .admin-input::placeholder {
          color: rgba(10, 10, 11, 0.3);
        }
        .admin-input:focus {
          outline: none;
          border-color: var(--color-ember);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-ink/50">
        {label}
      </span>
      {children}
    </label>
  );
}
