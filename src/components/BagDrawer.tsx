"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { BAG_EVENT, readBag, writeBag, type BagItem } from "@/lib/bag";
import { formatPrice } from "@/lib/format";

export default function BagDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<BagItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readBag());
    sync();
    window.addEventListener(BAG_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(BAG_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (open) setItems(readBag());
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const subtotal = items.reduce((s, i) => s + i.qty * i.priceCents, 0);

  const updateQty = (slug: string, size: string, delta: number) => {
    const next = items
      .map((i) =>
        i.slug === slug && i.size === size
          ? { ...i, qty: Math.max(0, i.qty + delta) }
          : i,
      )
      .filter((i) => i.qty > 0);
    writeBag(next);
  };

  const removeItem = (slug: string, size: string) => {
    writeBag(items.filter((i) => !(i.slug === slug && i.size === size)));
  };

  return (
    <div
      className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-coal transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <p className="font-mono text-xs tracking-[0.3em] text-smoke">
            YOUR BAG — {items.reduce((s, i) => s + i.qty, 0)} ITEMS
          </p>
          <button
            onClick={onClose}
            className="btn-press text-smoke transition-colors hover:text-ember"
            aria-label="Close bag"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag size={32} className="text-smoke" strokeWidth={1.5} />
              <p className="font-display text-2xl uppercase text-paper">
                Bag is empty
              </p>
              <p className="max-w-[26ch] font-mono text-xs leading-relaxed text-smoke">
                HEAVYWEIGHT PIECES ARE WAITING. GO GET SOME.
              </p>
              <Link
                href="/catalog"
                onClick={onClose}
                className="btn-press mt-2 border border-paper px-6 py-3 font-mono text-xs tracking-[0.25em] hover:border-ember hover:text-ember"
              >
                SHOP THE CATALOG
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {items.map((item) => (
                <li key={`${item.slug}-${item.size}`} className="flex gap-4 py-5">
                  <div className="img-frame relative h-24 w-20 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold leading-snug">
                          {item.name}
                        </p>
                        <p className="mt-1 font-mono text-[11px] tracking-widest text-smoke">
                          SIZE {item.size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.slug, item.size)}
                        className="btn-press text-smoke hover:text-ember"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-line">
                        <button
                          onClick={() => updateQty(item.slug, item.size, -1)}
                          className="btn-press px-2 py-1 text-smoke hover:text-paper"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center font-mono text-xs">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.slug, item.size, 1)}
                          className="btn-press px-2 py-1 text-smoke hover:text-paper"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="font-mono text-sm text-paper">
                        {formatPrice(item.priceCents * item.qty)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="flex items-center justify-between pb-4">
              <span className="font-mono text-xs tracking-[0.25em] text-smoke">
                SUBTOTAL
              </span>
              <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-press block w-full bg-ember py-4 text-center font-mono text-xs font-bold tracking-[0.3em] text-ink hover:bg-paper"
            >
              CHECKOUT
            </Link>
            <p className="pt-3 text-center font-mono text-[10px] tracking-widest text-smoke">
              FREE SHIPPING OVER $150 — CASH ON DELIVERY
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
