import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  AlertTriangle,
  Boxes,
  TrendingUp,
  Plus,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useProducts } from '@/hooks/useProducts';
import { formatCurrency } from '@/lib/utils';
import { ProductImage } from '@/components/product/ProductImage';
import { Skeleton } from '@/components/common/Skeleton';

export function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useProducts();
  const products = data?.products ?? [];

  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const categories = new Set(products.map((p) => p.category)).size;
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockCount = products.filter((p) => p.stock <= 5).length;
    const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

    const lowStockItems = products.filter((p) => p.stock <= 5).slice(0, 5);
    const recentProducts = [...products].reverse().slice(0, 6);

    return {
      totalProducts,
      categories,
      totalStock,
      lowStockCount,
      totalInventoryValue,
      lowStockItems,
      recentProducts,
    };
  }, [products]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Overview</p>
            <h1 className="font-syne text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Live inventory insights and catalogue management
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-white/5 transition-colors"
            >
              <BarChart3 className="h-4 w-4 text-primary" />
              Reports
            </Link>
            <Link
              to="/admin/products?action=new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Products</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Package className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{metrics.totalProducts}</p>
              <p className="text-xs text-muted-foreground">Catalog items listed</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl border border-border bg-card p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Layers className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{metrics.categories}</p>
              <p className="text-xs text-muted-foreground">Active product lines</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Inventory Value</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(metrics.totalInventoryValue)}</p>
              <p className="text-xs text-muted-foreground">{metrics.totalStock} total stock units</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-border bg-card p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Low Stock Alert</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-red-400">{metrics.lowStockCount}</p>
              <p className="text-xs text-muted-foreground">Items with stock ≤ 5</p>
            </motion.div>
          </div>
        )}

        {/* Content Section: Low Stock + Recent Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Low stock alerts */}
          <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Low Stock Alerts
              </h2>
              <Link to="/admin/products" className="text-xs text-primary hover:underline font-medium">
                View all
              </Link>
            </div>

            {isLoading && <Skeleton className="h-40 rounded-xl" />}

            {!isLoading && metrics.lowStockItems.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Boxes className="h-8 w-8 mx-auto mb-2 opacity-40 text-emerald-400" />
                All products have healthy stock levels.
              </div>
            )}

            {!isLoading && metrics.lowStockItems.length > 0 && (
              <div className="space-y-3">
                {metrics.lowStockItems.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-background/50 hover:border-border/80 transition-colors"
                  >
                    <ProductImage
                      product={product}
                      width={100}
                      className="h-12 w-12 rounded-lg border border-border object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{product.name}</p>
                      <p className="text-[11px] text-muted-foreground capitalize">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[11px] font-bold text-red-400">
                        {product.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Recent Catalog Products</h2>
              <Link to="/admin/products" className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                Manage Products
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {isLoading && <Skeleton className="h-48 rounded-xl" />}

            {isError && (
              <div className="py-8 text-center text-sm text-red-400">
                Failed to load product statistics.{' '}
                <button onClick={() => refetch()} className="underline font-medium">Retry</button>
              </div>
            )}

            {!isLoading && !isError && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 font-semibold">Product</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Price</th>
                      <th className="pb-3 font-semibold">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {metrics.recentProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <ProductImage
                              product={product}
                              width={80}
                              className="h-9 w-9 rounded-lg border border-border object-cover flex-shrink-0"
                            />
                            <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-xs text-muted-foreground capitalize">{product.category}</td>
                        <td className="py-3 px-2 font-medium text-foreground">{formatCurrency(product.price)}</td>
                        <td className="py-3 pl-2">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md border ${
                              product.stock === 0
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : product.stock <= 5
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
