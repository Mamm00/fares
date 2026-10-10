import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { listCategories, listProducts, type ProductSort } from "@/lib/data";

export const dynamic = "force-dynamic";

const SORTS: { key: ProductSort; label: string }[] = [
  { key: "new", label: "NEWEST" },
  { key: "price-asc", label: "PRICE ↑" },
  { key: "price-desc", label: "PRICE ↓" },
  { key: "name", label: "A — Z" },
];

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category;
  const sort = (SORTS.some((s) => s.key === sp.sort) ? sp.sort : "new") as ProductSort;

  const [categories, products] = await Promise.all([
    listCategories(),
    listProducts({ categorySlug: category, sort }),
  ]);

  const href = (params: { category?: string; sort?: string }) => {
    const q = new URLSearchParams();
    const c = params.category ?? category;
    const s = params.sort ?? sort;
    if (c) q.set("category", c);
    if (s !== "new") q.set("sort", s);
    const str = q.toString();
    return `/catalog${str ? `?${str}` : ""}`;
  };

  return (
    <main className="mx-auto max-w-[1600px] px-5 pb-28 pt-32 md:px-10 md:pt-40">
      <Reveal>
        <p className="font-mono text-[10px] tracking-[0.35em] text-ember">
          FARES MASHOUR® — FULL RANGE
        </p>
        <h1 className="display-tight pt-4 text-7xl md:text-[10rem]">CATALOG</h1>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-10 flex flex-col justify-between gap-6 border-y border-line py-5 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={href({ category: "" })}
              className={`btn-press border px-4 py-2 font-mono text-[10px] tracking-[0.25em] ${
                !category
                  ? "border-ember bg-ember text-ink"
                  : "border-line text-smoke hover:border-paper hover:text-paper"
              }`}
            >
              ALL
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={href({ category: cat.slug })}
                className={`btn-press border px-4 py-2 font-mono text-[10px] tracking-[0.25em] ${
                  category === cat.slug
                    ? "border-ember bg-ember text-ink"
                    : "border-line text-smoke hover:border-paper hover:text-paper"
                }`}
              >
                {cat.name.toUpperCase()}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.25em] text-smoke">
              {products.length} PIECES
            </span>
            <div className="flex items-center gap-1 border border-line px-2 py-1.5">
              <span className="px-1 font-mono text-[10px] text-smoke">SORT:</span>
              {SORTS.map((s) => (
                <Link
                  key={s.key}
                  href={href({ sort: s.key })}
                  className={`px-1.5 py-0.5 font-mono text-[10px] tracking-widest ${
                    sort === s.key ? "text-ember" : "text-smoke hover:text-paper"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-32 text-center">
          <p className="display-tight text-5xl text-smoke">NOTHING HERE YET</p>
          <Link href="/catalog" className="link-sweep font-mono text-xs tracking-[0.3em] text-ember">
            RESET FILTERS
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 pt-14 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 80} className={i % 2 === 1 ? "lg:mt-14" : ""}>
              <ProductCard product={product} index={i} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
