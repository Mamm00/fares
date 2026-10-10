"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import type { Order } from "@/db/schema";
import { formatDate, formatPrice } from "@/lib/format";

const STATUSES = ["new", "confirmed", "fulfilled", "cancelled"];

const STATUS_STYLE: Record<string, string> = {
  new: "bg-ember text-cream",
  confirmed: "bg-ink text-cream",
  fulfilled: "bg-emerald-600 text-cream",
  cancelled: "bg-ink/15 text-ink/50",
};

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  async function setStatus(id: number, status: string) {
    setBusy(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(order: Order) {
    if (!window.confirm(`Delete order FM-${String(order.id).padStart(4, "0")}?`)) return;
    setBusy(order.id);
    await fetch(`/api/admin/orders/${order.id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-ink/25 py-24 text-center">
        <p className="font-display text-3xl uppercase text-ink/40">No orders yet</p>
        <p className="pt-2 font-mono text-[10px] tracking-[0.25em] text-ink/35">
          WHEN CUSTOMERS CHECK OUT, ORDERS LAND HERE IN REAL TIME
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <details
          key={order.id}
          className="group border border-ink/15 bg-white shadow-[5px_5px_0_0_rgba(10,10,11,1)]"
        >
          <summary className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 transition-colors hover:bg-cream/60">
            <div className="min-w-28">
              <p className="font-display text-lg uppercase">
                FM-{String(order.id).padStart(4, "0")}
              </p>
              <p className="font-mono text-[9px] tracking-[0.2em] text-ink/40">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="min-w-36 flex-1">
              <p className="text-sm font-semibold">{order.customerName}</p>
              <p className="font-mono text-[10px] tracking-widest text-ink/40">
                {order.phone} — {order.city}
              </p>
            </div>
            <p className="font-mono text-[11px] tracking-widest text-ink/60">
              {order.items.reduce((s, i) => s + i.qty, 0)} ITEMS
            </p>
            <p className="font-display text-xl">{formatPrice(order.totalCents)}</p>
            <span
              className={`px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.2em] ${STATUS_STYLE[order.status] ?? STATUS_STYLE.new}`}
            >
              {order.status.toUpperCase()}
            </span>
            <ChevronDown
              size={16}
              className="text-ink/40 transition-transform duration-300 group-open:rotate-180"
            />
          </summary>

          <div className="grid grid-cols-1 gap-6 border-t border-ink/10 px-5 py-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <p className="font-mono text-[9px] tracking-[0.3em] text-ink/40">PIECES</p>
              <ul className="mt-3 space-y-2">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" className="h-12 w-9 object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-snug">{item.name}</p>
                      <p className="font-mono text-[9px] tracking-widest text-ink/40">
                        SIZE {item.size} × {item.qty}
                      </p>
                    </div>
                    <p className="font-mono text-xs">{formatPrice(item.priceCents * item.qty)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-1 border-t border-ink/10 pt-3 font-mono text-[11px] tracking-widest text-ink/60">
                <div className="flex justify-between">
                  <dt>SUBTOTAL</dt>
                  <dd>{formatPrice(order.subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>SHIPPING</dt>
                  <dd>{order.shippingCents === 0 ? "FREE" : formatPrice(order.shippingCents)}</dd>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold text-ink">
                  <dt>TOTAL — COD</dt>
                  <dd>{formatPrice(order.totalCents)}</dd>
                </div>
              </dl>
            </div>

            <div>
              <p className="font-mono text-[9px] tracking-[0.3em] text-ink/40">DELIVERY</p>
              <p className="mt-3 text-sm leading-relaxed">
                {order.address}, {order.city}
                <br />
                <span className="font-mono text-xs text-ink/60">{order.phone}</span>
              </p>
              {order.notes && (
                <p className="mt-3 border-l-2 border-ember pl-3 font-mono text-[11px] leading-relaxed text-ink/60">
                  “{order.notes}”
                </p>
              )}

              <p className="mt-5 font-mono text-[9px] tracking-[0.3em] text-ink/40">SET STATUS</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    disabled={busy === order.id || order.status === status}
                    onClick={() => setStatus(order.id, status)}
                    className={`btn-press px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.15em] disabled:opacity-40 ${
                      order.status === status
                        ? STATUS_STYLE[status]
                        : "border border-ink/20 text-ink/60 hover:border-ink hover:text-ink"
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => remove(order)}
                disabled={busy === order.id}
                className="btn-press mt-5 flex items-center gap-2 border border-ink/20 px-3 py-2 font-mono text-[9px] tracking-[0.2em] text-ink/50 hover:border-ember hover:text-ember"
              >
                <Trash2 size={12} /> DELETE ORDER
              </button>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
