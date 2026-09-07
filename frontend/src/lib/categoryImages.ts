/**
 * Persists admin-chosen category images in localStorage.
 * Key: "category_img::<categoryName>"
 * Value: one of the AVAILABLE_IMAGES paths
 */

export const AVAILABLE_IMAGES = [
  '/image/images.jpg',
  '/image/images (1).jpg',
  '/image/images (7).jpg',
  '/image/images (13).jpg'

];

const key = (category: string) =>
  `category_img::${category.toLowerCase().trim()}`;

export function getSavedCategoryImage(category: string): string | null {
  try {
    return localStorage.getItem(key(category));
  } catch {
    return null;
  }
}

export function saveCategoryImage(category: string, imagePath: string): void {
  try {
    localStorage.setItem(key(category), imagePath);
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}
