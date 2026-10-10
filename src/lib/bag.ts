export type BagItem = {
  slug: string;
  name: string;
  size: string;
  qty: number;
  priceCents: number;
  image: string;
};

const KEY = "fm-bag";
export const BAG_EVENT = "fm-bag-updated";

export function readBag(): BagItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BagItem[]) : [];
  } catch {
    return [];
  }
}

export function writeBag(items: BagItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(BAG_EVENT));
}

export function addToBag(item: BagItem): BagItem[] {
  const items = readBag();
  const existing = items.find(
    (i) => i.slug === item.slug && i.size === item.size,
  );
  if (existing) {
    existing.qty = Math.min(99, existing.qty + item.qty);
    writeBag([...items]);
  } else {
    writeBag([...items, item]);
  }
  return readBag();
}

export function bagCount(): number {
  return readBag().reduce((sum, i) => sum + i.qty, 0);
}

export function bagSubtotalCents(): number {
  return readBag().reduce((sum, i) => sum + i.qty * i.priceCents, 0);
}
