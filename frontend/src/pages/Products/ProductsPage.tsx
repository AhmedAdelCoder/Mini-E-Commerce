import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/common/Skeleton';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
  { value: 'name-desc', label: 'Name: Z → A' },
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catFromUrl = searchParams.get('cat');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(catFromUrl);
  const [sort, setSort] = useState<SortOption>('default');
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    setSelectedCategory(catFromUrl);
  }, [catFromUrl]);

  const { data, isLoading, isError, refetch } = useProducts();
  const { categories } = useCategories();

  const filtered = useMemo(() => {
    let products = data?.products ?? [];

    if (selectedCategory) {
      products = products.filter((p) => p.category === selectedCategory);
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-asc': return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...products].sort((a, b) => b.price - a.price);
      case 'name-asc': return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return [...products].sort((a, b) => b.name.localeCompare(a.name));
      default: return products;
    }
  }, [data?.products, selectedCategory, debouncedSearch, sort]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory(null);
    setSort('default');
    setSearchParams({});
  };

  const hasActiveFilters = !!search || !!selectedCategory || sort !== 'default';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">NOVA Store</p>
          <h1 className="font-syne text-4xl font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
            All Products
          </h1>
          {!isLoading && data && (
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              {hasActiveFilters ? ' found' : ''}
            </p>
          )}
        </div>

        {/* Search + Filter bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              id="product-search"
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Sort */}
          <select
            id="product-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer min-w-[180px]"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              'sm:hidden flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
              showFilters
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground'
            )}
            aria-label="Toggle category filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Categories row */}
        {categories.length > 0 && (
          <div className={cn('mb-8 flex flex-wrap gap-2', !showFilters && 'hidden sm:flex')}>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchParams({});
              }}
              className={cn(
                'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                !selectedCategory
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80'
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  if (cat === selectedCategory) {
                    setSelectedCategory(null);
                    setSearchParams({});
                  } else {
                    setSelectedCategory(cat);
                    setSearchParams({ cat });
                  }
                }}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-all',
                  cat === selectedCategory
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Clear filters */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {isLoading && <ProductGridSkeleton count={8} />}

        {isError && (
          <ErrorState
            message="Unable to load products. Please try again."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            title="No products found"
            description={
              hasActiveFilters
                ? "No products match your current filters. Try adjusting or clearing them."
                : "No products are available yet."
            }
            action={
              hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                >
                  Clear filters
                </button>
              ) : undefined
            }
          />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
