"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Check, ChevronRight, Loader2, ShoppingBag } from "lucide-react";
import { BAG_EVENT, readBag, writeBag, type BagItem } from "@/lib/bag";
import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_THRESHOLD = 15000;
const SHIPPING_FLAT = 1000;

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<BagItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    setItems(readBag());
    const sync = () => setItems(readBag());
    window.addEventListener(BAG_EVENT, sync);
    return () => window.removeEventListener(BAG_EVENT, sync);
  }, []);

  if (items === null) {
    return <main className="min-h-screen" />;
  }

  if (orderId !== null) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="max-w-lg text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center border border-ember text-ember">
            <Check size={28} />
          </span>
          <h1 className="display-tight pt-8 text-6xl md:text-7xl">
            ORDER <span className="text-ember">LOCKED IN</span>
          </h1>
          <p className="pt-6 font-mono text-xs leading-loose tracking-[0.2em] text-smoke">
            ORDER № FM-{String(orderId).padStart(4, "0")}
            <br />
            WE&apos;LL CALL YOU TO CONFIRM DELIVERY.
            <br />
            CASH ON DELIVERY — KEEP THE TOTAL READY.
          </p>
          <Link
            href="/catalog"
            className="btn-press mt-10 inline-block bg-ember px-8 py-4 font-mono text-xs font-bold tracking-[0.3em] text-ink hover:bg-paper"
          >
            BACK TO THE CATALOG
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="text-center">
          <ShoppingBag size={36} className="mx-auto text-smoke" strokeWidth={1.5} />
          <h1 className="display-tight pt-6 text-6xl text-smoke">BAG IS EMPTY</h1>
          <Link
            href="/catalog"
            className="btn-press mt-8 inline-block border border-ember px-8 py-4 font-mono text-xs tracking-[0.3em] text-ember hover:bg-ember hover:text-ink"
          >
            SHOP THE CATALOG
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = items.reduce((s, i) => s + i.qty * i.priceCents, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items!.map((i) => ({ slug: i.slug, size: i.size, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      writeBag([]);
      setOrderId(data.id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1600px] px-5 pb-28 pt-32 md:px-10 md:pt-40">
      <nav className="flex items-center gap-1 font-mono text-[10px] tracking-[0.25em] text-smoke">
        <Link href="/" className="hover:text-ember">HOME</Link>
        <ChevronRight size={11} />
        <Link href="/catalog" className="hover:text-ember">CATALOG</Link>
        <ChevronRight size={11} />
        <span className="text-ember">CHECKOUT</span>
      </nav>

      <h1 className="display-tight pt-6 text-7xl md:text-[9rem]">CHECKOUT</h1>

      <div className="grid grid-cols-1 gap-14 pt-14 lg:grid-cols-12">
        {/* Form */}
        <form onSubmit={submit} className="space-y-5 lg:col-span-7">
          <p className="font-mono text-[10px] tracking-[0.35em] text-smoke">
            01 — DELIVERY DETAILS
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="FULL NAME *">
              <input required value={form.customerName} onChange={set("customerName")} placeholder="Fares Mashour" className="checkout-input" />
            </Field>
            <Field label="PHONE / WHATSAPP *">
              <input required value={form.phone} onChange={set("phone")} placeholder="+20 100 000 0000" className="checkout-input" />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="CITY *">
              <input required value={form.city} onChange={set("city")} placeholder="Cairo" className="checkout-input" />
            </Field>
            <Field label="ADDRESS *">
              <input required value={form.address} onChange={set("address")} placeholder="Street, building, apt" className="checkout-input" />
            </Field>
          </div>
          <Field label="NOTES (OPTIONAL)">
            <textarea value={form.notes} onChange={set("notes")} rows={3} placeholder="Anything we should know?" className="checkout-input resize-none" />
          </Field>

          {error && (
            <p className="border border-ember bg-ember/10 px-4 py-3 font-mono text-xs tracking-widest text-ember">
              {error.toUpperCase()}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-press flex w-full items-center justify-center gap-3 bg-ember py-5 font-mono text-xs font-bold tracking-[0.35em] text-ink hover:bg-paper disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            PLACE ORDER — {formatPrice(total)} COD
          </button>
        </form>

        {/* Summary */}
        <aside className="lg:col-span-5">
          <p className="font-mono text-[10px] tracking-[0.35em] text-smoke">
            02 — ORDER SUMMARY
          </p>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li key={`${item.slug}-${item.size}`} className="flex items-center gap-4 py-4">
                <div className="img-frame relative h-20 w-16 shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-snug">{item.name}</p>
                  <p className="pt-1 font-mono text-[10px] tracking-widest text-smoke">
                    SIZE {item.size} × {item.qty}
                  </p>
                </div>
                <p className="font-mono text-sm">{formatPrice(item.priceCents * item.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="space-y-3 pt-6 font-mono text-xs tracking-[0.2em]">
            <div className="flex justify-between text-smoke">
              <dt>SUBTOTAL</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-smoke">
              <dt>SHIPPING</dt>
              <dd className={shipping === 0 ? "text-ember" : ""}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-4 text-base text-paper">
              <dt>TOTAL — COD</dt>
              <dd className="font-display text-2xl tracking-normal">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="pt-4 font-mono text-[10px] leading-relaxed tracking-widest text-smoke">
            PAY CASH WHEN YOUR PIECES ARRIVE. WE CALL TO CONFIRM EVERY ORDER BEFORE
            DISPATCH.
          </p>
        </aside>
      </div>

      <style jsx global>{`
        .checkout-input {
          width: 100%;
          border: 1px solid var(--color-line);
          background: var(--color-coal);
          padding: 0.9rem 1.1rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--color-paper);
          transition: border-color 0.25s ease;
        }
        .checkout-input::placeholder {
          color: var(--color-smoke);
          opacity: 0.6;
        }
        .checkout-input:focus {
          outline: none;
          border-color: var(--color-ember);
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] tracking-[0.3em] text-smoke">
        {label}
      </span>
      {children}
    </label>
  );
}
