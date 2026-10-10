import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getCategoryBySlug, listCategories, listProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, allCategories] = await Promise.all([
    listProducts({ categorySlug: slug, sort: "new" }),
    listCategories(),
  ]);

  return (
    <main className="pb-28">
      {/* Banner */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-14 md:px-10">
          <Reveal>
            <nav className="flex items-center gap-1 font-mono text-[10px] tracking-[0.25em] text-paper/60">
              <Link href="/" className="hover:text-ember">HOME</Link>
              <ChevronRight size={11} />
              <Link href="/catalog" className="hover:text-ember">CATALOG</Link>
              <ChevronRight size={11} />
              <span className="text-ember">{category.name.toUpperCase()}</span>
            </nav>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-tight pt-6 text-[16vw] md:text-[10rem]">
              {category.name}
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-xl text-base leading-relaxed text-paper/75">
                {category.description}
              </p>
              <p className="font-mono text-[10px] tracking-[0.3em] text-smoke">
                {products.length} PIECES — DROP 002
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1600px] px-5 md:px-10">
        {products.length === 0 ? (
          <div className="py-32 text-center">
            <p className="display-tight text-5xl text-smoke">COMING SOON</p>
            <Link href="/catalog" className="link-sweep mt-6 inline-block font-mono text-xs tracking-[0.3em] text-ember">
              SHOP ALL PIECES
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 pt-16 lg:grid-cols-4">
            {products.map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 80} className={i % 2 === 1 ? "lg:mt-14" : ""}>
                <ProductCard product={product} index={i} priority={i < 4} />
              </Reveal>
            ))}
          </div>
        )}

        {/* Other categories */}
        <div className="mt-24 border-t border-line pt-10">
          <p className="font-mono text-[10px] tracking-[0.35em] text-smoke">
            MORE CATEGORIES
          </p>
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
            {allCategories
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="display-tight group text-4xl text-paper/40 transition-colors hover:text-ember md:text-6xl"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
