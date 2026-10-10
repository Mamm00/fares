import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductWithCategory } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export default function ProductCard({
  product,
  index = 0,
  priority = false,
}: {
  product: ProductWithCategory;
  index?: number;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
    >
      <div className="img-frame relative aspect-[4/5]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover ${product.inStock ? "" : "opacity-50 grayscale"}`}
        />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && (
            <span
              className={`px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.2em] ${
                product.badge === "LIMITED" || product.badge === "LOW STOCK"
                  ? "bg-ember text-ink"
                  : "bg-paper text-ink"
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.compareAtCents && (
            <span className="bg-ink px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-ember">
              SALE
            </span>
          )}
        </div>

        {!product.inStock && (
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-ink/80 py-2 text-center font-mono text-xs tracking-[0.35em] text-paper">
            SOLD OUT
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-ember py-3 text-center font-mono text-[10px] font-bold tracking-[0.3em] text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
          <span className="inline-flex items-center gap-2">
            VIEW PIECE <ArrowRight size={12} />
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 pt-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-smoke">
            {String(index + 1).padStart(2, "0")} —{" "}
            {product.categoryName?.toUpperCase() ?? "FARES MASHOUR"}
          </p>
          <h3 className="pt-1.5 text-sm font-semibold leading-snug transition-colors duration-300 group-hover:text-ember md:text-base">
            {product.name}
          </h3>
        </div>
        <div className="text-right font-mono text-sm">
          {product.compareAtCents && (
            <p className="text-xs text-smoke line-through">
              {formatPrice(product.compareAtCents)}
            </p>
          )}
          <p className={product.compareAtCents ? "text-ember" : "text-paper"}>
            {formatPrice(product.priceCents)}
          </p>
        </div>
      </div>
    </Link>
  );
}
