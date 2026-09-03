import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Minus, Plus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/EmptyState';
import { useProduct } from '@/hooks/useProducts';
import { useAuth } from '@/context/AuthContext';
import { useAddToCart } from '@/hooks/useCart';
import { extractErrorMessage } from '@/services/api/client';
import { formatCurrency } from '@/lib/utils';
import { ProductImage } from '@/components/product/ProductImage';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, isError, error, refetch } = useProduct(id!);
  const product = data?.product;

  const isOutOfStock = product?.stock === 0;
  const maxQty = product?.stock ?? 1;

  const adjustQty = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(maxQty, prev + delta)));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }
    if (!product || isOutOfStock) return;

    try {
      await addToCart.mutateAsync({ productId: product._id, quantity });
      toast.success(`${product.name} added to cart`, {
        description: `Quantity: ${quantity}`,
        action: {
          label: 'View Cart',
          onClick: () => navigate('/cart'),
        },
      });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-4">
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="pt-2">
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const errMsg = extractErrorMessage(error, 'Product could not be loaded.');

  if (isError || !product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <ErrorState message={errMsg} onRetry={() => refetch()} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span className="text-border">/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span className="text-border">/</span>
          <span className="text-foreground truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductImage
              product={product}
              eager
              width={1200}
              className="aspect-square w-full rounded-2xl border border-border"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="space-y-6"
          >
            {/* Category & Stock */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                {product.category}
              </span>
              {isOutOfStock ? (
                <span className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Out of stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="text-xs text-amber-400">
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="text-xs text-emerald-400">
                  In stock ({product.stock})
                </span>
              )}
            </div>

            {/* Name */}
            <h1
              className="font-syne text-3xl sm:text-4xl font-bold text-foreground leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-4xl font-bold text-foreground">
              {formatCurrency(product.price)}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <hr className="border-border" />

            {/* Quantity + Add to Cart */}
            {!isOutOfStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                  <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden">
                    <button
                      onClick={() => adjustQty(-1)}
                      disabled={quantity <= 1}
                      className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-40 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span
                      className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-foreground border-x border-border"
                      aria-live="polite"
                      aria-label={`Quantity: ${quantity}`}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => adjustQty(1)}
                      disabled={quantity >= maxQty}
                      className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-40 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {addToCart.isPending ? 'Adding to cart…' : 'Add to Cart'}
                </button>

                {!isAuthenticated && (
                  <p className="text-center text-xs text-muted-foreground">
                    <Link to="/login" className="text-primary hover:underline">Sign in</Link> to add items to your cart.
                  </p>
                )}
              </div>
            )}

            {isOutOfStock && (
              <div className="rounded-xl border border-border bg-card/50 px-5 py-4 text-sm text-muted-foreground">
                This product is currently unavailable. Check back later.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
