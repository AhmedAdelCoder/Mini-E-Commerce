import type { Product } from '@/types';

const UNSPLASH = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

type PhotoMap = { keys: string[]; id: string };

/** Keyword → curated product photography (Unsplash). */
const KEYWORD_PHOTOS: PhotoMap[] = [
  { keys: ['headphone', 'earbud', 'earphone', 'airpod'], id: '1505740420928-5e560c06d30e' },
  { keys: ['laptop', 'notebook', 'macbook'], id: '1496181133206-80ce9b88a853' },
  { keys: ['iphone', 'smartphone', 'mobile phone'], id: '1511707171634-5f897ff02aa9' },
  { keys: ['phone'], id: '1511707171634-5f897ff02aa9' },
  { keys: ['smartwatch', 'watch'], id: '1523275335684-37898b6baf30' },
  { keys: ['camera', 'dslr'], id: '1516035069371-29a1b244cc32' },
  { keys: ['keyboard'], id: '1587825140708-df876c12b44e' },
  { keys: ['mouse'], id: '1527864550417-7fd91c3c3876' },
  { keys: ['speaker', 'bluetooth speaker'], id: '1545454675-3531b202a4ef' },
  { keys: ['tablet', 'ipad'], id: '1544244015-0df4b3ffc6b0' },
  { keys: ['monitor', 'display', 'television', ' tv'], id: '1593359677879-a4bb92f829d1' },
  { keys: ['console', 'playstation', 'xbox', 'nintendo', 'gaming'], id: '1606144042614-b2417e99c4e3' },
  { keys: ['drone'], id: '1473968512647-3e447d1ed2b3' },
  { keys: ['sneaker', 'shoe', 'boot', 'trainer'], id: '1542291026-7eec264c27ff' },
  { keys: ['backpack', 'handbag', 'hand bag', 'tote'], id: '1553062407-98eeb64c6a62' },
  { keys: ['bag'], id: '1548036328-c9fa89d128fa' },
  { keys: ['t-shirt', 'tshirt', 'tee ', 'shirt'], id: '1521572163474-6864f9cf17ab' },
  { keys: ['jacket', 'coat', 'hoodie'], id: '1591047139829-d91aecb6caea' },
  { keys: ['jean', 'pant', 'trouser'], id: '1542272604-787c59506e2e' },
  { keys: ['dress'], id: '1496747611176-843222e1e57c' },
  { keys: ['sunglasses', 'glasses'], id: '1511497584788-876760111969' },
  { keys: ['chair', 'armchair'], id: '1506439773649-6e0eb8cfb237' },
  { keys: ['sofa', 'couch'], id: '1555041469-a586c61ea9bc' },
  { keys: ['lamp', 'light'], id: '1507473886605-2d186ef9f2f4' },
  { keys: ['table', 'desk'], id: '1493663284031-b7e3aefcae8e' },
  { keys: ['plant', 'vase'], id: '1485955900006-10f4d324d411' },
  { keys: ['book'], id: '1512820798883-c7ef3130fc2e' },
  { keys: ['coffee', 'mug'], id: '1495474472287-4d71bcdd2085' },
  { keys: ['bottle'], id: '1602143407151-7111542de6e8' },
  { keys: ['perfume', 'fragrance'], id: '1541643600913-05d4e2b8a27c' },
  { keys: ['makeup', 'cosmetic', 'lipstick'], id: '1522335786084-5973a1b6a7c6' },
  { keys: ['skincare', 'cream', 'serum'], id: '1556228720-195a672e8a03' },
  { keys: ['yoga', 'mat', 'fitness', 'dumbbell', 'gym'], id: '1517836357463-d25dfeac3438' },
  { keys: ['bicycle', 'bike'], id: '1485965120184-e220f721d03e' },
  { keys: ['ball', 'soccer', 'football'], id: '1579952363873-27f3bade9f55' },
];

const CATEGORY_PHOTOS: Record<string, string[]> = {
  electronics: [
    '1517336714731-489689fd1ca8',
    '1518770660439-4636190af475',
    '1550009158-9cfdcb053f07',
    '1498049794561-7780e7231661',
  ],
  fashion: [
    '1483985988355-763728e1935b',
    '1445205170230-053b83016050',
    '1490481651871-ab68de25d43d',
    '1469334031218-e382a71b716b',
  ],
  clothing: [
    '1483985988355-763728e1935b',
    '1523381210434-271e8be1f52b',
  ],
  beauty: [
    '1596462502278-27bfdc403348',
    '1522335786084-5973a1b6a7c6',
  ],
  home: [
    '1616486338812-3adda7dcb6d3',
    '1555041469-a586c61ea9bc',
    '1586023492125-27b2c045efd7',
  ],
  furniture: [
    '1555041469-a586c61ea9bc',
    '1506439773649-6e0eb8cfb237',
  ],
  sports: [
    '1517836357463-d25dfeac3438',
    '1571019614242-c5c5dee9f50b',
  ],
  food: [
    '1504674900247-0877df9cc836',
    '1540189549336-e6e99c3679fe',
  ],
  books: ['1512820798883-c7ef3130fc2e', '1524995997946-a1c2e315a42f'],
  accessories: [
    '1523275335684-37898b6baf30',
    '1511497584788-876760111969',
  ],
};

const FALLBACK_PHOTOS = [
  '1505740420928-5e560c06d30e',
  '1523275335684-37898b6baf30',
  '1496181133206-80ce9b88a853',
  '1542291026-7eec264c27ff',
  '1553062407-98eeb64c6a62',
  '1516035069371-29a1b244cc32',
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickFrom(ids: string[], seed: string, width: number): string {
  const id = ids[hashString(seed) % ids.length];
  return UNSPLASH(id, width);
}

function resolveCategoryPool(category: string): string[] | undefined {
  const key = category.trim().toLowerCase();
  if (CATEGORY_PHOTOS[key]) return CATEGORY_PHOTOS[key];
  const match = Object.entries(CATEGORY_PHOTOS).find(([name]) => key.includes(name));
  return match?.[1];
}

export function getProductImageUrl(
  product: Pick<Product, '_id' | 'name' | 'category'> & { image?: string },
  width = 800
): string {
  if (product.image?.trim()) return product.image.trim();

  const haystack = `${product.name} ${product.category}`.toLowerCase();

  for (const entry of KEYWORD_PHOTOS) {
    if (entry.keys.some((key) => haystack.includes(key))) {
      return UNSPLASH(entry.id, width);
    }
  }

  const categoryPool = resolveCategoryPool(product.category);
  if (categoryPool?.length) {
    return pickFrom(categoryPool, product._id || product.name, width);
  }

  return pickFrom(FALLBACK_PHOTOS, product._id || product.name, width);
}

export function getCategoryImageUrl(category: string, width = 600): string {
  const pool = resolveCategoryPool(category) ?? FALLBACK_PHOTOS;
  return pickFrom(pool, category, width);
}
