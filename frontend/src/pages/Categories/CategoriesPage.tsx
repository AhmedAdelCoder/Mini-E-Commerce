import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/common/Skeleton';
import { ErrorState, EmptyState } from '@/components/common/EmptyState';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';
import { CategoryTileVisual } from '@/components/category/CategoryTile';

export function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCat = searchParams.get('cat');

  const { categories, isLoading: catLoading } = useCategories();
  const { data, isLoading: prodLoading, isError, refetch } = useProducts();

  const categoryProducts = selectedCat
    ? (data?.products ?? []).filter((p) => p.category === selectedCat)
    : [];

  const handleSelectCategory = (cat: string) => {
    if (cat === selectedCat) {
      setSearchParams({});
    } else {
      setSearchParams({ cat });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Browse</p>
          <h1 className="font-syne text-4xl font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
            Categories
          </h1>
        </div>

        {/* Category grid */}
        {catLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  'group relative flex flex-col items-center justify-center rounded-xl border aspect-square transition-all duration-200 overflow-hidden',
                  cat === selectedCat
                    ? 'border-primary ring-2 ring-primary/40'
                    : 'border-border hover:border-primary/40'
                )}
                aria-pressed={cat === selectedCat}
                aria-label={`Filter by ${cat}`}
              >
                <CategoryTileVisual category={cat} selected={cat === selectedCat} />
                <span className="relative text-sm font-semibold text-white text-center px-2 capitalize drop-shadow-md">
                  {cat}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Category products */}
        {selectedCat && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground capitalize">
                {selectedCat}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({categoryProducts.length})
                </span>
              </h2>
              <Link
                to={`/products?cat=${encodeURIComponent(selectedCat)}`}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View all in shop
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {prodLoading && <ProductGridSkeleton count={4} />}
            {isError && <ErrorState onRetry={() => refetch()} />}

            {!prodLoading && !isError && categoryProducts.length === 0 && (
              <EmptyState
                title="No products in this category"
                description="This category doesn't have any products yet."
              />
            )}

            {!prodLoading && !isError && categoryProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {categoryProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedCat && !catLoading && categories.length === 0 && (
          <EmptyState title="No categories found" description="Products haven't been added yet." />
        )}
      </div>
    </MainLayout>
  );
}
