import { slugify } from "./format";

function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v).trim()).filter(Boolean);
}

export function parseProductPayload(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  if (!name) throw new Error("Name is required");

  const slug = slugify(String(body.slug ?? "") || name);
  if (!slug) throw new Error("Valid slug is required");

  const priceCents =
    body.priceCents !== undefined && body.priceCents !== null && body.priceCents !== ""
      ? Math.round(Number(body.priceCents))
      : Math.round(Number(body.price ?? NaN) * 100);
  if (!Number.isFinite(priceCents) || priceCents < 0)
    throw new Error("Price must be a positive number");

  let compareAtCents: number | null = null;
  if (
    body.compareAtCents !== undefined &&
    body.compareAtCents !== null &&
    body.compareAtCents !== ""
  ) {
    compareAtCents = Math.round(Number(body.compareAtCents));
  } else if (
    body.compareAt !== undefined &&
    body.compareAt !== null &&
    body.compareAt !== ""
  ) {
    compareAtCents = Math.round(Number(body.compareAt) * 100);
  }
  if (compareAtCents !== null && !Number.isFinite(compareAtCents)) {
    compareAtCents = null;
  }

  const images = cleanStringArray(body.images);
  const image =
    String(body.image ?? "").trim() || images[0] || "/images/tee-black.jpg";
  const sizes = cleanStringArray(body.sizes);

  return {
    name,
    slug,
    description: String(body.description ?? ""),
    priceCents,
    compareAtCents,
    categoryId: body.categoryId ? Number(body.categoryId) : null,
    image,
    images: images.length > 0 ? images : [image],
    sizes: sizes.length > 0 ? sizes : ["ONE SIZE"],
    color: String(body.color ?? ""),
    badge: body.badge ? String(body.badge) : null,
    featured: Boolean(body.featured),
    inStock: body.inStock === undefined ? true : Boolean(body.inStock),
  };
}

export function parseCategoryPayload(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  if (!name) throw new Error("Name is required");
  const slug = slugify(String(body.slug ?? "") || name);
  if (!slug) throw new Error("Valid slug is required");
  return {
    name,
    slug,
    description: String(body.description ?? ""),
    image: String(body.image ?? "").trim() || "/images/tee-black.jpg",
  };
}
