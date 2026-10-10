import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardList,
  Package,
  Plus,
  Tags,
} from "lucide-react";
import { dashboardStats, listOrders, listProducts } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  new: "bg-ember text-cream",
  confirmed: "bg-ink text-cream",
  fulfilled: "bg-emerald-600 text-cream",
  cancelled: "bg-ink/15 text-ink/50",
};

export default async function AdminDashboard() {
  const [stats, orders, products] = await Promise.all([
    dashboardStats(),
    listOrders(),
    listProducts({ sort: "new" }),
  ]);

  const cards = [
    { label: "PRODUCTS", value: String(stats.products), icon: Package },
    { label: "CATEGORIES", value: String(stats.categories), icon: Tags },
    { label: "ORDERS", value: String(stats.orders), icon: ClipboardList, sub: `${stats.newOrders} new` },
    { label: "REVENUE", value: formatPrice(stats.revenueCents), icon: ArrowUpRight, sub: "excl. cancelled" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] text-ink/40">
            BACK OFFICE
          </p>
          <h1 className="pt-2 font-display text-5xl uppercase md:text-6xl">
            Dashboard
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-press flex items-center gap-2 bg-ink px-5 py-3 font-mono text-[11px] font-bold tracking-[0.25em] text-cream hover:bg-ember hover:text-ink"
        >
          <Plus size={14} /> NEW PRODUCT
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="border border-ink/15 bg-white p-5 shadow-[5px_5px_0_0_rgba(10,10,11,1)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] tracking-[0.3em] text-ink/40">
                  {card.label}
                </p>
                <Icon size={15} className="text-ember" />
              </div>
              <p className="pt-4 font-display text-4xl">{card.value}</p>
              {card.sub && (
                <p className="pt-1 font-mono text-[10px] tracking-widest text-ink/40">
                  {card.sub}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Recent orders */}
        <section className="border border-ink/15 bg-white shadow-[5px_5px_0_0_rgba(10,10,11,1)]">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <h2 className="font-display text-xl uppercase">Recent Orders</h2>
            <Link href="/admin/orders" className="link-sweep font-mono text-[10px] tracking-[0.25em] text-ink/50 hover:text-ember">
              VIEW ALL
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="px-5 py-10 text-center font-mono text-xs tracking-widest text-ink/35">
              NO ORDERS YET — THEY&apos;LL LAND HERE
            </p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {orders.slice(0, 5).map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div>
                    <p className="text-sm font-semibold">
                      FM-{String(order.id).padStart(4, "0")} — {order.customerName}
                    </p>
                    <p className="font-mono text-[10px] tracking-widest text-ink/40">
                      {order.items.reduce((s, i) => s + i.qty, 0)} ITEMS — {order.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{formatPrice(order.totalCents)}</span>
                    <span className={`px-2 py-1 font-mono text-[9px] font-bold tracking-[0.2em] ${STATUS_STYLE[order.status] ?? STATUS_STYLE.new}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Inventory snapshot */}
        <section className="border border-ink/15 bg-white shadow-[5px_5px_0_0_rgba(10,10,11,1)]">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <h2 className="font-display text-xl uppercase">Inventory Snapshot</h2>
            <Link href="/admin/products" className="link-sweep font-mono text-[10px] tracking-[0.25em] text-ink/50 hover:text-ember">
              MANAGE
            </Link>
          </div>
          <ul className="divide-y divide-ink/10">
            {products.slice(0, 5).map((product) => (
              <li key={product.id} className="flex items-center gap-4 px-5 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt="" className="h-12 w-10 object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-snug">{product.name}</p>
                  <p className="font-mono text-[10px] tracking-widest text-ink/40">
                    {product.categoryName?.toUpperCase() ?? "UNCATEGORIZED"} — {formatPrice(product.priceCents)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 font-mono text-[9px] font-bold tracking-[0.2em] ${
                    product.inStock ? "bg-emerald-600 text-cream" : "bg-ember text-cream"
                  }`}
                >
                  {product.inStock ? "IN STOCK" : "SOLD OUT"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
