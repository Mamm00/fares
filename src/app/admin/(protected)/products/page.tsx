import ProductsTable from "@/components/admin/ProductsTable";
import { listProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listProducts({ sort: "new" });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] text-ink/40">
            INVENTORY
          </p>
          <h1 className="pt-2 font-display text-5xl uppercase md:text-6xl">
            Products
          </h1>
        </div>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
