import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { useCart, useUpdateCartItem, useRemoveFromCart, useCartTotal } from '@/hooks/useCart';
import { extractErrorMessage } from '@/services/api/client';
import { formatCurrency } from '@/lib/utils';
import { ProductImage } from '@/components/product/ProductImage';

export function CartPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  const total = useCartTotal();

  const cart = data?.cart;
  const items = cart?.items ?? [];

  const handleUpdate = async (productId: string, quantity: number) => {
    try {
      await updateItem.mutateAsync({ productId, quantity });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleRemove = async (productId: string, productName: string) => {
    try {
      await removeItem.mutateAsync(productId);
      toast.success(`${productName} removed from cart`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 py-20">
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8" />}
            title="Sign in to view your cart"
            description="You need to be signed in to access your shopping cart."
            action={
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="mb-8">
            <Skeleton className="h-9 w-40" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-8 w-32 mt-auto" />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Skeleton className="h-56 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <ErrorState
            message="Unable to load your cart. Please try again."
            onRetry={() => refetch()}
          />
        </div>
      </MainLayout>
    );
  }

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 py-20">
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8" />}
            title="Your cart is empty"
            description="Add some products to get started."
            action={
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Start shopping
              </Link>
            }
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Checkout</p>
          <h1 className="font-syne text-4xl font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
            Your Cart
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4 items-center"
                >
                  <ProductImage
                    product={item.product}
                    width={200}
                    className="h-20 w-20 flex-shrink-0 rounded-lg border border-border"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product._id}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.product.category}</p>
                    <p className="text-sm font-bold text-foreground mt-2">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1 rounded-xl border border-border bg-background overflow-hidden">
                    <button
                      onClick={() => handleUpdate(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updateItem.isPending}
                      className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-40 transition-colors"
                      aria-label={`Decrease quantity of ${item.product.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span
                      className="flex h-9 w-10 items-center justify-center text-sm font-semibold text-foreground border-x border-border"
                      aria-live="polite"
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdate(item.product._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock || updateItem.isPending}
                      className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-40 transition-colors"
                      aria-label={`Increase quantity of ${item.product.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.product._id, item.product.name)}
                    disabled={removeItem.isPending}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-colors flex-shrink-0"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Continue shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-foreground">Order Summary</h2>

            <div className="space-y-3 text-sm">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-muted-foreground">
                  <span className="truncate mr-2 max-w-[150px]">{item.product.name} × {item.quantity}</span>
                  <span className="flex-shrink-0">{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">{formatCurrency(total)}</span>
            </div>

            <button
              id="proceed-checkout-btn"
              onClick={() => navigate('/checkout')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Secure checkout powered by NOVA Store
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
