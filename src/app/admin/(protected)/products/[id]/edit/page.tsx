import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById, listCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();

  const [product, categories] = await Promise.all([
    getProductById(numId),
    listCategories(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-ink/50 hover:text-ember"
      >
        <ArrowLeft size={12} /> BACK TO PRODUCTS
      </Link>
      <h1 className="py-6 font-display text-5xl uppercase md:text-6xl">
        Edit Product
      </h1>
      <p className="pb-8 font-mono text-[10px] tracking-[0.3em] text-ink/40">
        /{product.slug}
      </p>
      <ProductForm categories={categories} initial={product} />
    </div>
  );
}
