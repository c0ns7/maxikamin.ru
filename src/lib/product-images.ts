import type { Product } from "@/lib/types";

export const MAX_PRODUCT_IMAGES = 10;

/** Normalize and cap product image list (cover first). */
export function normalizeProductImages(
  images: string[] | undefined,
  cover?: string,
): string[] {
  const raw = [
    ...(images ?? []),
    ...(cover ? [cover] : []),
  ]
    .map((u) => u.trim())
    .filter(Boolean);

  const unique: string[] = [];
  for (const url of raw) {
    if (!unique.includes(url)) unique.push(url);
    if (unique.length >= MAX_PRODUCT_IMAGES) break;
  }
  return unique;
}

export function getProductImages(product: Pick<Product, "image" | "images">): string[] {
  const list = normalizeProductImages(product.images, product.image);
  return list.length ? list : product.image ? [product.image] : [];
}

export function isRemoteImage(src: string) {
  return /^https?:\/\//i.test(src);
}
