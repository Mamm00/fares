"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Minus, Plus, RotateCcw, Ruler, Truck } from "lucide-react";
import { addToBag } from "@/lib/bag";
import { formatPrice } from "@/lib/format";

export default function PurchasePanel({
  product,
}: {
  product: {
    slug: string;
    name: string;
    image: string;
    priceCents: number;
    sizes: string[];
    inStock: boolean;
  };
}) {
  const [size, setSize] = useState<string>(product.sizes[0] ?? "ONE SIZE");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product.inStock) {
    return (
      <div className="border border-line bg-coal px-6 py-5 text-center">
        <p className="font-display text-2xl uppercase text-smoke">Sold out</p>
        <p className="pt-2 font-mono text-[10px] tracking-[0.25em] text-smoke">
          JOIN THE LIST ON THE HOMEPAGE FOR THE RESTOCK
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Sizes */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-[0.3em] text-smoke">
          SELECT SIZE — <span className="text-ember">{size}</span>
        </p>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-smoke">
          <Ruler size={12} /> TRUE TO SIZE
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.sizes.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`btn-press min-w-12 border px-3 py-2.5 font-mono text-xs tracking-widest ${
              size === s
                ? "border-ember bg-ember text-ink"
                : "border-line text-paper/80 hover:border-paper"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Qty + Add */}
      <div className="mt-6 flex gap-3">
        <div className="flex items-center border border-line">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="btn-press px-3 py-3 text-smoke hover:text-paper"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center font-mono text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(9, q + 1))}
            className="btn-press px-3 py-3 text-smoke hover:text-paper"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
        <button
          onClick={() => {
            addToBag({
              slug: product.slug,
              name: product.name,
              image: product.image,
              priceCents: product.priceCents,
              size,
              qty,
            });
            setAdded(true);
            window.setTimeout(() => setAdded(false), 2200);
          }}
          className={`btn-press flex flex-1 items-center justify-center gap-3 py-4 font-mono text-xs font-bold tracking-[0.3em] ${
            added ? "bg-paper text-ink" : "bg-ember text-ink hover:bg-paper"
          }`}
        >
          {added ? (
            <>
              <Check size={15} /> ADDED TO BAG
            </>
          ) : (
            <>
              ADD TO BAG — {formatPrice(product.priceCents * qty)}
            </>
          )}
        </button>
      </div>

      {added && (
        <Link
          href="/checkout"
          className="mt-3 flex items-center justify-center gap-2 border border-ember py-3 font-mono text-[11px] tracking-[0.3em] text-ember hover:bg-ember hover:text-ink"
        >
          GO TO CHECKOUT <ArrowRight size={13} />
        </Link>
      )}

      <div className="mt-6 space-y-2.5 border-t border-line pt-5 font-mono text-[10px] tracking-[0.2em] text-smoke">
        <p className="flex items-center gap-2.5">
          <Truck size={13} className="text-ember" /> FREE SHIPPING OVER $150 — COD AVAILABLE
        </p>
        <p className="flex items-center gap-2.5">
          <RotateCcw size={13} className="text-ember" /> 14-DAY EXCHANGE, NO QUESTIONS
        </p>
      </div>
    </div>
  );
}
