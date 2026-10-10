import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Minus } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import PurchasePanel from "@/components/PurchasePanel";
import Reveal from "@/components/Reveal";
import { getProductBySlug, listProducts } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const gallery = product.images.length > 0 ? product.images : [product.image];
  const related = (
    await listProducts({ categorySlug: product.categorySlug ?? undefined })
  )
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-[1600px] px-5 pb-28 pt-28 md:px-10 md:pt-36">
      <Reveal>
        <nav className="flex flex-wrap items-center gap-1 font-mono text-[10px] tracking-[0.25em] text-smoke">
          <Link href="/" className="hover:text-ember">HOME</Link>
          <ChevronRight size={11} />
          <Link href="/catalog" className="hover:text-ember">CATALOG</Link>
          <ChevronRight size={11} />
          {product.categorySlug && (
            <>
              <Link href={`/category/${product.categorySlug}`} className="hover:text-ember">
                {product.categoryName?.toUpperCase()}
              </Link>
              <ChevronRight size={11} />
            </>
          )}
          <span className="text-ember">{product.name.toUpperCase()}</span>
        </nav>
      </Reveal>

      <div className="grid grid-cols-1 gap-12 pt-10 lg:grid-cols-12">
        {/* Gallery */}
        <div className="lg:col-span-6">
          <Reveal>
            <div className="img-frame relative aspect-[4/5]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {product.badge && (
                <span
                  className={`absolute left-4 top-4 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.25em] ${
                    product.badge === "LIMITED" || product.badge === "LOW STOCK"
                      ? "bg-ember text-ink"
                      : "bg-paper text-ink"
                  }`}
                >
                  {product.badge}
                </span>
              )}
            </div>
          </Reveal>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {gallery.slice(1, 5).map((img, i) => (
                <div key={i} className="img-frame relative aspect-square">
                  <Image src={img} alt={`${product.name} view ${i + 2}`} fill sizes="12vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-6">
          <Reveal delay={120}>
            <p className="font-mono text-[10px] tracking-[0.3em] text-ember">
              {product.categoryName?.toUpperCase() ?? "FARES MASHOUR"} — {product.color.toUpperCase()}
            </p>
            <h1 className="display-tight pt-4 text-5xl md:text-7xl">{product.name}</h1>
            <div className="flex items-baseline gap-4 pt-5">
              <p className="font-display text-4xl">{formatPrice(product.priceCents)}</p>
              {product.compareAtCents && (
                <p className="font-mono text-lg text-smoke line-through">
                  {formatPrice(product.compareAtCents)}
                </p>
              )}
              {product.compareAtCents && (
                <span className="bg-ember px-2 py-1 font-mono text-[10px] font-bold tracking-widest text-ink">
                  SAVE {formatPrice(product.compareAtCents - product.priceCents)}
                </span>
              )}
            </div>
            <p className="max-w-xl pt-6 text-base leading-relaxed text-paper/70">
              {product.description}
            </p>
          </Reveal>

          <Reveal delay={200} className="pt-8">
            <PurchasePanel
              product={{
                slug: product.slug,
                name: product.name,
                image: product.image,
                priceCents: product.priceCents,
                sizes: product.sizes,
                inStock: product.inStock,
              }}
            />
          </Reveal>

          <Reveal delay={280} className="pt-8">
            <div className="divide-y divide-line border-y border-line">
              {[
                {
                  title: "FABRIC & FIT",
                  body: "Heavyweight 240–450 GSM fabric, 100% combed cotton. Boxy oversized cut with dropped shoulders. Pre-washed — fits the same on day 100 as day one. Model wears size L.",
                },
                {
                  title: "SHIPPING & DELIVERY",
                  body: "Worldwide shipping in 3–7 working days. Free over $150, flat $10 below. Cash on delivery available in Egypt and the GCC. Every order ships in the signature FM black mailer.",
                },
                {
                  title: "EXCHANGES & RETURNS",
                  body: "14-day exchange window, no questions asked. Piece must be unworn with tags on. Sale and limited items are final — that's the price of rarity.",
                },
              ].map((item) => (
                <details key={item.title} className="group py-4">
                  <summary className="flex items-center justify-between font-mono text-xs tracking-[0.25em] text-paper transition-colors hover:text-ember">
                    {item.title}
                    <Minus
                      size={14}
                      className="text-smoke transition-transform duration-300 group-open:rotate-90"
                    />
                  </summary>
                  <p className="max-w-xl pt-3 text-sm leading-relaxed text-paper/60">
                    {item.body}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="pt-24 md:pt-32">
          <Reveal>
            <div className="flex items-end justify-between border-b border-line pb-6">
              <h2 className="display-tight text-5xl md:text-7xl">
                COMPLETE THE <span className="text-stroke">FIT</span>
              </h2>
              <Link
                href="/catalog"
                className="link-sweep hidden font-mono text-[11px] tracking-[0.3em] text-smoke hover:text-ember md:block"
              >
                VIEW ALL
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 pt-12 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
