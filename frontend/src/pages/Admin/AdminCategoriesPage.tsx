import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Package, Plus, ImageIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useProducts } from '@/hooks/useProducts';
import { getCategoryImageUrl } from '@/lib/productImage';
import { AVAILABLE_IMAGES, saveCategoryImage } from '@/lib/categoryImages';
import { formatCurrency, cn } from '@/lib/utils';
import { Skeleton } from '@/components/common/Skeleton';

// ─── Image Picker Popover ─────────────────────────────────────────────────────

function CategoryImagePicker({
  category,
  current,
  onSelect,
  onClose,
}: {
  category: string;
  current: string;
  onSelect: (img: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -6 }}
        transition={{ duration: 0.15 }}
        className="absolute top-10 right-0 z-50 w-72 rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 p-3"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
          Choose image for <span className="text-foreground capitalize">{category}</span>
        </p>
        <div className="grid grid-cols-4 gap-2">
          {AVAILABLE_IMAGES.map((img) => (
            <button
              key={img}
              type="button"
              onClick={() => { onSelect(img); onClose(); }}
              className={cn(
                'relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105',
                current === img ? 'border-primary' : 'border-transparent hover:border-primary/40'
              )}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
              {current === img && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white drop-shadow" />
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminCategoriesPage() {
  const { data, isLoading, isError, refetch } = useProducts();
  const products = data?.products ?? [];

  // Track which category's picker is open + force re-render on save
  const [openPicker, setOpenPicker] = useState<string | null>(null);
  const [, setTick] = useState(0); // triggers re-render after save

  const categoryStats = useMemo(() => {
    const map: Record<
      string,
      { count: number; totalStock: number; totalPrice: number; value: number }
    > = {};

    products.forEach((p) => {
      const cat = p.category;
      if (!map[cat]) map[cat] = { count: 0, totalStock: 0, totalPrice: 0, value: 0 };
      map[cat].count      += 1;
      map[cat].totalStock += p.stock;
      map[cat].totalPrice += p.price;
      map[cat].value      += p.price * p.stock;
    });

    return Object.entries(map).map(([name, stats]) => ({
      name,
      count:      stats.count,
      totalStock: stats.totalStock,
      avgPrice:   stats.count > 0 ? stats.totalPrice / stats.count : 0,
      value:      stats.value,
      imageUrl:   getCategoryImageUrl(name, 800),
    }));
  // re-run when tick changes (after user picks an image)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, openPicker]);

  const handleSelectImage = (category: string, img: string) => {
    saveCategoryImage(category, img);
    setTick((t) => t + 1); // force re-render so imageUrl updates
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Catalog</p>
            <h1 className="font-syne text-3xl font-bold text-foreground">Category Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Category lines extracted from live products catalog
            </p>
          </div>
          <Link
            to="/admin/products?action=new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add Product to Category
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-red-400 font-medium mb-3">Failed to load categories catalog.</p>
            <button onClick={() => refetch()} className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white">Retry</button>
          </div>
        ) : categoryStats.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
            <Layers className="h-10 w-10 mx-auto opacity-30 text-muted-foreground" />
            <h3 className="text-base font-bold text-foreground">No Categories Found</h3>
            <p className="text-sm text-muted-foreground">Add products to automatically generate categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryStats.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-border/80 transition-all shadow-lg shadow-black/10 flex flex-col"
              >
                {/* Image header */}
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <img
                    key={cat.imageUrl}
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

                  {/* Category name + count */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <h3 className="font-syne text-xl font-bold text-white capitalize drop-shadow-md">
                      {cat.name}
                    </h3>
                    <span className="rounded-full bg-primary/80 backdrop-blur-md px-3 py-0.5 text-xs font-bold text-white">
                      {cat.count} {cat.count === 1 ? 'product' : 'products'}
                    </span>
                  </div>

                  {/* Change image button */}
                  <div className="absolute top-2 right-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenPicker(openPicker === cat.name ? null : cat.name)}
                        className="flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-black/80 transition-colors"
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                        Change Image
                      </button>

                      <AnimatePresence>
                        {openPicker === cat.name && (
                          <CategoryImagePicker
                            category={cat.name}
                            current={cat.imageUrl}
                            onSelect={(img) => handleSelectImage(cat.name, img)}
                            onClose={() => setOpenPicker(null)}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-border bg-background/50 p-3">
                      <p className="text-muted-foreground">Avg Price</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(cat.avgPrice)}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/50 p-3">
                      <p className="text-muted-foreground">Total Units</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{cat.totalStock} units</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-background/80 p-3.5 flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Category Inventory Value</span>
                    <span className="text-sm font-extrabold text-primary">{formatCurrency(cat.value)}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex gap-2">
                    <Link
                      to={`/admin/products?cat=${cat.name}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-white/5 transition-colors"
                    >
                      <Package className="h-3.5 w-3.5" />
                      Manage
                    </Link>
                    <Link
                      to={`/products?cat=${cat.name}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                    >
                      Storefront
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
