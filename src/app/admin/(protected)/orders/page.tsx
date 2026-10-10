import OrdersTable from "@/components/admin/OrdersTable";
import { listOrders } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  const fresh = orders.filter((o) => o.status === "new").length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.totalCents, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] text-ink/40">
            FULFILLMENT
          </p>
          <h1 className="pt-2 font-display text-5xl uppercase md:text-6xl">
            Orders
          </h1>
        </div>
        <div className="flex gap-6 font-mono text-[10px] tracking-[0.25em] text-ink/50">
          <p>
            <span className="text-ember">{fresh}</span> NEW
          </p>
          <p>
            <span className="text-ember">{formatPrice(revenue)}</span> REVENUE
          </p>
        </div>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
