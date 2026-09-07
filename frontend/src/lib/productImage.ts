import type { Product } from '@/types';

/**
 * Base URL of the backend server (without /api/v1).
 * Used to turn relative paths like /uploads/file.jpg into full URLs.
 */
const BACKEND_ORIGIN =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace('/api/v1', '') ??
  'http://localhost:5000';

/**
 * Local laptop placeholder images served from Vite's public directory.
 * Used as fallback when a product has no uploaded image.
 */
const PLACEHOLDER_IMAGES: string[] = [
  '/image/images.jpg',
  '/image/images (1).jpg',
  '/image/images (2).jpg',
  '/image/images (3).jpg',
  '/image/images (4).jpg',
  '/image/images (5).jpg',
  '/image/images (6).jpg',
];

/** Deterministic hash: same seed always picks the same placeholder. */
function pickPlaceholder(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash += seed.charCodeAt(i);
  }
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length];
}

/**
 * Resolve a stored image path to a full URL.
 * - Relative path  (/uploads/…) → prepend backend origin
 * - Absolute URL   (http/https)  → return as-is
 */
function resolveUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BACKEND_ORIGIN}${path}`;
}

/**
 * Returns the display URL for a product image.
 *
 * Priority:
 *  1. product.image set by the backend (uploaded file) → full backend URL
 *  2. Deterministic placeholder from /public/image/    → local Vite path
 */
export function getProductImageUrl(
  product: Pick<Product, '_id' | 'name' | 'category'> & { image?: string | null },
  _width?: number
): string {
  if (product.image) return resolveUrl(product.image);
  return pickPlaceholder(product._id || product.name);
}

import { getSavedCategoryImage } from './categoryImages';

/**
 * Returns a display URL for a category tile image.
 * Priority:
 *  1. Admin-chosen image saved in localStorage
 *  2. Deterministic placeholder from /public/image/
 */
export function getCategoryImageUrl(category: string, _width?: number): string {
  const saved = getSavedCategoryImage(category);
  if (saved) return saved;
  return pickPlaceholder(category);
}
