import { useSearchParams, Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/common/Skeleton';
import { ErrorState, EmptyState } from '@/components/common/EmptyState';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useAuth } from '@/context/AuthContext';
import { getCategoryImageUrl } from '@/lib/productImage';
import { CategoryImagePicker } from '@/components/category/CategoryImagePicker';
import { cn } from '@/lib/utils';

export function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCat = searchParams.get('cat');
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { categories, isLoading: catLoading } = useCategories();
  const { data, isLoading: prodLoading, isError, refetch } = useProducts();

  // Local image overrides — updated immediately when admin picks a new image
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});

  const getImage = useCallback(
    (cat: string) => imageOverrides[cat] ?? getCategoryImageUrl(cat),
    [imageOverrides]
  );

  const handleImageChange = (cat: string, img: string) => {
    setImageOverrides((prev) => ({ ...prev, [cat]: img }));
  };

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
          <h1
            className="font-syne text-4xl font-bold text-foreground"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
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
            {categories.map((cat, i) => {
              const imgUrl = getImage(cat);
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative"
                >
                  {/* The tile button */}
                  <button
                    onClick={() => handleSelectCategory(cat)}
                    className={cn(
                      'group relative flex flex-col items-center justify-center rounded-xl border aspect-square transition-all duration-200 overflow-hidden w-full',
                      cat === selectedCat
                        ? 'border-primary ring-2 ring-primary/40'
                        : 'border-border hover:border-primary/40'
                    )}
                    aria-pressed={cat === selectedCat}
                    aria-label={`Filter by ${cat}`}
                  >
                    {/* Background image */}
                    <div className="absolute inset-0">
                      <img
                        key={imgUrl}
                        src={imgUrl}
                        alt=""
                        className={cn(
                          'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
                          cat === selectedCat ? 'scale-105' : ''
                        )}
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className={cn(
                          'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20',
                          cat === selectedCat ? 'from-primary/50 via-black/40' : ''
                        )}
                      />
                    </div>

                    <span className="relative text-sm font-semibold text-white text-center px-2 capitalize drop-shadow-md">
                      {cat}
                    </span>
                  </button>

                  {/* Admin "Change Image" button — floats above the tile */}
                  {isAdmin && (
                    <div className="absolute top-1.5 right-1.5 z-10">
                      <CategoryImagePicker
                        category={cat}
                        currentImage={imgUrl}
                        onChanged={(img) => handleImageChange(cat, img)}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
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
