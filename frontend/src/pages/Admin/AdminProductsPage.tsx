import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  useProducts,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { formatCurrency } from '@/lib/utils';
import { extractErrorMessage } from '@/services/api/client';
import { ProductImage } from '@/components/product/ProductImage';
import { Skeleton } from '@/components/common/Skeleton';
import type { Product } from '@/types';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  category: z.string().min(2, 'Category is required'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
});

type ProductFormData = z.infer<typeof productSchema>;

export function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isCreatingFromUrl = searchParams.get('action') === 'new';

  const { data, isLoading, isError, refetch } = useProducts();
  const { categories } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'lowstock' | 'outofstock'>('all');
  const debouncedSearch = useDebounce(search, 200);

  // Modals state
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(
    isCreatingFromUrl ? 'create' : null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteProductTarget, setDeleteProductTarget] = useState<Product | null>(null);

  const products = data?.products ?? [];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (stockFilter === 'instock' && p.stock <= 0) return false;
      if (stockFilter === 'lowstock' && (p.stock > 5 || p.stock === 0)) return false;
      if (stockFilter === 'outofstock' && p.stock > 0) return false;
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, categoryFilter, stockFilter, debouncedSearch]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const openCreateModal = () => {
    setSelectedProduct(null);
    reset({
      name: '',
      description: '',
      price: 0,
      category: categories[0] || 'electronics',
      stock: 10,
    });
    setModalMode('create');
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedProduct(null);
    if (isCreatingFromUrl) {
      setSearchParams({});
    }
  };

  const onFormSubmit = async (values: ProductFormData) => {
    try {
      if (modalMode === 'create') {
        await createMutation.mutateAsync(values);
        toast.success(`Product "${values.name}" created successfully`);
      } else if (modalMode === 'edit' && selectedProduct) {
        await updateMutation.mutateAsync({ id: selectedProduct._id, payload: values });
        toast.success(`Product "${values.name}" updated successfully`);
      }
      closeModal();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProductTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteProductTarget._id);
      toast.success(`Product "${deleteProductTarget.name}" deleted successfully`);
      setDeleteProductTarget(null);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    if (isCreatingFromUrl) {
      openCreateModal();
    }
  }, [isCreatingFromUrl]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Management</p>
            <h1 className="font-syne text-3xl font-bold text-foreground">Products Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create, edit, search, and update catalogue inventory
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search products by name, description, or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all capitalize"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <option value="all">All Stock Statuses</option>
            <option value="instock">In Stock</option>
            <option value="lowstock">Low Stock (≤ 5)</option>
            <option value="outofstock">Out of Stock</option>
          </select>
        </div>

        {/* Table / Content */}
        {isLoading ? (
          <Skeleton className="h-96 w-full rounded-2xl" />
        ) : isError ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-red-400 font-medium mb-3">Failed to load product catalogue.</p>
            <button
              onClick={() => refetch()}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
            >
              Retry Loading
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
            <Package className="h-10 w-10 mx-auto opacity-30 text-muted-foreground" />
            <h3 className="text-base font-bold text-foreground">No Products Found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              No products match your search or filter parameters. Try clearing your filters or adding a new product.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl shadow-black/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-background/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4 font-semibold">Product</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Price</th>
                    <th className="py-3.5 px-4 font-semibold">Stock</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <ProductImage
                            product={product}
                            width={100}
                            className="h-11 w-11 rounded-lg border border-border object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-foreground line-clamp-1">{product.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 capitalize">
                        <span className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          {product.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-foreground">{formatCurrency(product.price)}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md border ${
                            product.stock === 0
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : product.stock <= 5
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(product)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteProductTarget(product)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create / Edit Modal */}
        <AnimatePresence>
          {modalMode && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                onClick={closeModal}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
                  <h2 className="font-syne text-xl font-bold text-foreground">
                    {modalMode === 'create' ? 'Create New Product' : 'Edit Product'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ultra Wireless Headphones"
                      {...register('name')}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. electronics, fashion, footwear"
                      {...register('category')}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {errors.category && (
                      <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  {/* Price & Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="99.99"
                        {...register('price')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="25"
                        {...register('stock')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      {errors.stock && <p className="text-xs text-red-400 mt-1">{errors.stock.message}</p>}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detailed features and specification..."
                      {...register('description')}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="pt-3 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-60 transition-all"
                    >
                      {(createMutation.isPending || updateMutation.isPending) && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Confirm Modal */}
        <AnimatePresence>
          {deleteProductTarget && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                onClick={() => setDeleteProductTarget(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl border border-red-500/20 bg-card p-6 shadow-2xl"
              >
                <div className="flex items-center gap-3 text-red-400 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3 className="font-syne text-lg font-bold text-foreground">Confirm Deletion</h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Are you sure you want to delete <strong className="text-foreground">{deleteProductTarget.name}</strong>? This action cannot be undone.
                </p>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setDeleteProductTarget(null)}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleteMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-60 transition-all"
                  >
                    {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Delete Product
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
