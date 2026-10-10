import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { listCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await listCategories();

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-ink/50 hover:text-ember"
      >
        <ArrowLeft size={12} /> BACK TO PRODUCTS
      </Link>
      <h1 className="py-6 font-display text-5xl uppercase md:text-6xl">
        New Product
      </h1>
      <ProductForm categories={categories} />
    </div>
  );
}
