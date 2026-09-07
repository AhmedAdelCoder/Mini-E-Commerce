import type { Product } from '@/types';

/**
 * All laptop images served from public/image/.
 * Vite serves the public directory at /, so browser paths are /image/...
 * Filenames must match exactly (spaces included).
 */
const PRODUCT_IMAGES: string[] = [
  '/image/images.jpg',
  '/image/images (1).jpg',
  '/image/images (2).jpg',
  '/image/images (3).jpg',
  '/image/images (4).jpg',
  '/image/images (5).jpg',
  '/image/images (6).jpg',
];

/**
 * Deterministic hash: sum of char codes mod array length.
 * Same seed always returns the same image; different seeds spread across images.
 */
function pickImage(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash += seed.charCodeAt(i);
  }
  return PRODUCT_IMAGES[hash % PRODUCT_IMAGES.length];
}

/**
 * Returns a URL for a product image.
 * Uses product._id as the hash seed so the same product always gets
 * the same image. Falls back to name if _id is unavailable.
 */
export function getProductImageUrl(
  product: Pick<Product, '_id' | 'name' | 'category'> & { image?: string },
  _width?: number
): string {
  if (product.image) return product.image;
  return pickImage(product._id || product.name);
}

/**
 * Returns a URL for a category image.
 * Uses the category string as the seed so every category gets a consistent,
 * distinct image.
 */
export function getCategoryImageUrl(category: string, _width?: number): string {
  return pickImage(category);
}
