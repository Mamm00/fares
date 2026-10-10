"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import type { ProductWithCategory } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export default function ProductsTable({
  products,
}: {
  products: ProductWithCategory[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(product: ProductWithCategory, field: "inStock" | "featured", value: boolean) {
    setBusy(product.slug + field);
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toggle: field, value }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(product: ProductWithCategory) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setBusy(product.slug + "delete");
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="border border-ink/15 bg-white shadow-[5px_5px_0_0_rgba(10,10,11,1)]">
      <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
        <p className="font-mono text-[10px] tracking-[0.3em] text-ink/40">
          {products.length} PIECES IN THE RANGE
        </p>
        <Link
          href="/admin/products/new"
          className="btn-press flex items-center gap-2 bg-ink px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.25em] text-cream hover:bg-ember hover:text-ink"
        >
          <Plus size={13} /> NEW PRODUCT
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-ink/10 font-mono text-[9px] tracking-[0.3em] text-ink/40">
              <th className="px-5 py-3 font-normal">PIECE</th>
              <th className="px-4 py-3 font-normal">CATEGORY</th>
              <th className="px-4 py-3 font-normal">PRICE</th>
              <th className="px-4 py-3 font-normal">STOCK</th>
              <th className="px-4 py-3 font-normal">FEATURED</th>
              <th className="px-5 py-3 text-right font-normal">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-cream/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt="" className="h-14 w-11 shrink-0 object-cover" />
                    <div>
                      <p className="text-sm font-semibold leading-snug">{product.name}</p>
                      <p className="font-mono text-[10px] tracking-widest text-ink/40">
                        /{product.slug}
                      </p>
                    </div>
                    {product.badge && (
                      <span className="bg-ember px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-widest text-cream">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] tracking-widest text-ink/60">
                  {product.categoryName?.toUpperCase() ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-sm">
                  {formatPrice(product.priceCents)}
                </td>
                <td className="px-4 py-3">
                  <button
                    disabled={busy !== null}
                    onClick={() => toggle(product, "inStock", !product.inStock)}
                    className={`px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.2em] transition-colors ${
                      product.inStock
                        ? "bg-emerald-600 text-cream hover:bg-ember"
                        : "bg-ink/15 text-ink/50 hover:bg-ember hover:text-cream"
                    }`}
                  >
                    {product.inStock ? "IN STOCK" : "SOLD OUT"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    disabled={busy !== null}
                    onClick={() => toggle(product, "featured", !product.featured)}
                    aria-label="Toggle featured"
                    className={`transition-colors ${product.featured ? "text-ember" : "text-ink/25 hover:text-ink/60"}`}
                  >
                    <Star size={17} fill={product.featured ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="btn-press border border-ink/20 p-2 text-ink/60 hover:border-ink hover:text-ink"
                      aria-label="Edit product"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => remove(product)}
                      disabled={busy !== null}
                      className="btn-press border border-ink/20 p-2 text-ink/60 hover:border-ember hover:text-ember"
                      aria-label="Delete product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
