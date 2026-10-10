import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Marquee from "@/components/Marquee";
import NewsletterForm from "@/components/NewsletterForm";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { listCategories, listProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured, all] = await Promise.all([
    listCategories(),
    listProducts({ featured: true }),
    listProducts({ sort: "new" }),
  ]);

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-stroke display-tight select-none text-[42vw] opacity-[0.35]">
            FM
          </span>
        </div>

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-end gap-10 px-5 pb-16 pt-28 md:px-10 lg:min-h-screen lg:grid-cols-12 lg:pt-32">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-mono text-[10px] tracking-[0.35em] text-ember md:text-xs">
                EST. 2025 — CAIRO / WORLDWIDE — HEAVYWEIGHT STREETWEAR
              </p>
            </Reveal>
            <h1 className="display-tight pt-6 text-[19vw] md:text-[15vw] lg:text-[9.5vw]">
              <Reveal delay={80}>
                <span className="block">FARES</span>
              </Reveal>
              <Reveal delay={180}>
                <span className="block">
                  <span className="text-stroke">MASHOUR</span>
                  <span className="text-ember">.</span>
                </span>
              </Reveal>
            </h1>
            <Reveal delay={300}>
              <p className="max-w-md pt-8 text-base leading-relaxed text-paper/70 md:text-lg">
                Not fast fashion. 240 GSM heavyweight cotton, armourweight fleece
                and cuts that outlast trends. Uniform of the unapologetic.
              </p>
            </Reveal>
            <Reveal delay={400}>
              <div className="flex flex-wrap items-center gap-4 pt-10">
                <Link
                  href="/catalog"
                  className="btn-press group flex items-center gap-3 bg-ember px-8 py-4 font-mono text-xs font-bold tracking-[0.3em] text-ink hover:bg-paper"
                >
                  SHOP THE DROP
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/category/t-shirts"
                  className="btn-press border border-paper/30 px-8 py-4 font-mono text-xs tracking-[0.3em] text-paper hover:border-ember hover:text-ember"
                >
                  EXPLORE T-SHIRTS
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5">
            <Reveal delay={250}>
              <div className="img-frame relative aspect-[3/4]">
                <Image
                  src="/images/hero.jpg"
                  alt="Fares Mashour heavyweight tee worn by model"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -left-4 -top-4 hidden rotate-[-6deg] bg-ember px-4 py-2 font-mono text-[10px] font-bold tracking-[0.25em] text-ink lg:block">
                DROP 002 — LIVE NOW
              </div>
              <div className="flex items-center justify-between border border-line border-t-0 px-4 py-3">
                <span className="font-mono text-[10px] tracking-[0.25em] text-smoke">
                  FIG. 01 — SIGNATURE TEE, JET BLACK
                </span>
                <Link href="/product/signature-tee-black" className="btn-press text-ember">
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[10px] tracking-[0.35em] text-smoke lg:flex">
          SCROLL <ArrowDown size={12} className="animate-bounce" />
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <Marquee
        className="border-y border-line bg-ember py-3 text-ink"
        speed={24}
        items={[
          "FARES MASHOUR",
          "HEAVYWEIGHT ONLY",
          "FREE SHIPPING OVER $150",
          "NEW DROP 002",
          "BUILT TO OUTLAST TRENDS",
          "CASH ON DELIVERY",
        ]}
      />

      {/* ============ FEATURED ============ */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.35em] text-ember">
                001 — SELECTED WORKS
              </p>
              <h2 className="display-tight pt-4 text-6xl md:text-8xl">
                THE HEAVY
                <br />
                HITTERS
              </h2>
            </div>
            <Link
              href="/catalog"
              className="btn-press group flex items-center gap-3 border border-line px-6 py-3.5 font-mono text-[11px] tracking-[0.3em] text-smoke hover:border-ember hover:text-ember"
            >
              FULL CATALOG
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 pt-14 lg:grid-cols-4">
          {featured.slice(0, 4).map((product, i) => (
            <Reveal key={product.id} delay={i * 100} className={i % 2 === 1 ? "lg:mt-16" : ""}>
              <ProductCard product={product} index={i} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section id="manifesto" className="relative overflow-hidden border-y border-line bg-coal">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-0 lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-20 md:px-16 md:py-32">
            <Reveal>
              <p className="font-mono text-[10px] tracking-[0.35em] text-ember">
                002 — THE MANIFESTO
              </p>
            </Reveal>
            {[
              "NOT FAST",
              "FASHION.",
              "HEAVYWEIGHT",
              "ONLY.",
            ].map((line, i) => (
              <Reveal key={line + i} delay={100 + i * 120}>
                <p
                  className={`display-tight text-6xl md:text-8xl ${
                    i % 2 === 1 ? "text-stroke" : ""
                  }`}
                >
                  {line}
                </p>
              </Reveal>
            ))}
            <Reveal delay={600}>
              <p className="max-w-md pt-8 text-base leading-relaxed text-paper/70">
                Every Fares Mashour piece starts as 240+ GSM fabric and a stubborn
                idea: make it heavy, make it honest, put the name on the chest in
                capital letters. No seasonal churn. No shrinking logos. Built in
                small batches, worn everywhere.
              </p>
            </Reveal>
            <Reveal delay={700}>
              <div className="grid grid-cols-3 gap-6 pt-12 font-mono">
                {[
                  ["240+", "GSM MINIMUM"],
                  ["100%", "COTTON"],
                  ["002", "DROPS / YEAR"],
                ].map(([num, label]) => (
                  <div key={label} className="border-l border-line pl-4">
                    <p className="font-display text-3xl text-ember md:text-4xl">{num}</p>
                    <p className="pt-1 text-[10px] tracking-[0.25em] text-smoke">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="img-frame relative min-h-[70vh]">
            <Image
              src="/images/editorial.jpg"
              alt="Fares Mashour editorial campaign — two models in signature tees"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-ink/80 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-paper backdrop-blur">
              CAMPAIGN 002 — &quot;UNIFORM OF THE UNAPOLOGETIC&quot;
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section id="categories" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.35em] text-ember">
                003 — SHOP BY CATEGORY
              </p>
              <h2 className="display-tight pt-4 text-6xl md:text-8xl">PICK YOUR ARMOUR</h2>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 pt-14 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 110}>
              <Link href={`/category/${cat.slug}`} className="group block">
                <div className="img-frame relative aspect-[3/4]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.3em] text-paper/70">
                    CAT.{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-paper/30 text-paper transition-all duration-500 group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
                    <ArrowUpRight size={15} />
                  </span>
                  <div className="absolute inset-x-4 bottom-4">
                    <h3 className="display-tight text-4xl md:text-5xl">{cat.name}</h3>
                    <p className="pt-2 font-mono text-[10px] tracking-[0.25em] text-smoke">
                      {cat.productCount} PIECES — SHOP NOW
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FULL CATALOG RAIL ============ */}
      <section className="border-t border-line py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="display-tight text-5xl md:text-7xl">
                THE FULL <span className="text-stroke">RACK</span>
              </h2>
              <p className="hidden font-mono text-[10px] tracking-[0.3em] text-smoke md:block">
                DRAG / SCROLL — {all.length} PIECES
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <div className="rail mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-10">
            {all.map((product, i) => (
              <div key={product.id} className="w-[70vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[22vw]">
                <ProductCard product={product} index={i} />
              </div>
            ))}
            <Link
              href="/catalog"
              className="group flex w-[60vw] shrink-0 snap-start items-center justify-center border border-line sm:w-[30vw] lg:w-[22vw]"
            >
              <span className="flex flex-col items-center gap-3 font-mono text-xs tracking-[0.3em] text-smoke transition-colors group-hover:text-ember">
                VIEW ALL
                <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
              </span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ============ CTA ============ */}
      <section className="border-t border-line bg-coal px-5 py-24 text-center md:py-36">
        <Reveal>
          <p className="font-mono text-[10px] tracking-[0.35em] text-ember">
            004 — THE LIST
          </p>
          <h2 className="display-tight mx-auto max-w-4xl pt-6 text-6xl md:text-8xl">
            GET THE NEXT DROP <span className="text-ember">FIRST</span>
          </h2>
          <p className="mx-auto max-w-md pt-6 text-paper/60">
            Drops are small-batch by design. The list hears 48 hours before anyone
            else — then it&apos;s first come, first served.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="pt-10">
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
