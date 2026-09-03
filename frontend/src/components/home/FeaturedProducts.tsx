import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/EmptyState';
import { CategoryTileVisual } from '@/components/category/CategoryTile';

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function FeaturedProducts() {
  const { data, isLoading, isError, refetch } = useProducts();
  const featured = data?.products?.slice(0, 4) ?? [];

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-primary">Curated Picks</p>
            <h2 className="font-syne text-3xl font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading && <ProductGridSkeleton count={4} />}
        {isError && <ErrorState onRetry={() => refetch()} message="Could not load products." />}

        {!isLoading && !isError && featured.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {featured.map((product) => (
              <motion.div key={product._id} variants={cardVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-8 sm:hidden text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CategoryHighlights() {
  const { categories, isLoading } = useCategories();

  if (isLoading) return null;
  if (categories.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-primary">Browse By</p>
          <h2 className="font-syne text-3xl font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
            Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.slice(0, 6).map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link
                to={`/categories?cat=${encodeURIComponent(cat)}`}
                className="group flex flex-col items-center justify-center rounded-xl border border-border aspect-square hover:border-primary/40 transition-all duration-300 overflow-hidden relative"
              >
                <CategoryTileVisual category={cat} />
                <span className="relative text-sm font-semibold text-white text-center px-2 leading-snug capitalize drop-shadow-md">
                  {cat}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {categories.length > 6 && (
          <div className="mt-6 text-center">
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View all categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
