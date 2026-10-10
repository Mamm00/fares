import CategoryManager from "@/components/admin/CategoryManager";
import { listCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

  return (
    <div>
      <div className="pb-8">
        <p className="font-mono text-[10px] tracking-[0.35em] text-ink/40">
          TAXONOMY
        </p>
        <h1 className="pt-2 font-display text-5xl uppercase md:text-6xl">
          Categories
        </h1>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
