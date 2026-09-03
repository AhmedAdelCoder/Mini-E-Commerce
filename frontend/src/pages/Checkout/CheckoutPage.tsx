import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useCart, useCartTotal } from '@/hooks/useCart';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/lib/utils';
import { ProductImage } from '@/components/product/ProductImage';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  address: z.string().min(5, 'Enter your delivery address'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { data } = useCart();
  const total = useCartTotal();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const items = data?.cart?.items ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  });

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 py-20">
          <EmptyState
            title="Sign in required"
            description="Please sign in to proceed to checkout."
            action={
              <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                Sign in
              </Link>
            }
          />
        </div>
      </MainLayout>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 py-20">
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8" />}
            title="Your cart is empty"
            description="Add items to your cart before checking out."
            action={
              <Link to="/products" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                Shop now
              </Link>
            }
          />
        </div>
      </MainLayout>
    );
  }

  const onSubmit = async (_data: CheckoutFormData) => {
    // The backend has no Order/Payment API — this is a frontend-only order confirmation flow
    await new Promise((r) => setTimeout(r, 1200));
    setOrderPlaced(true);
    toast.success('Order placed successfully!');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {orderPlaced ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center py-20"
            >
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </div>
              </div>
              <h1 className="font-syne text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Thank you for your order. We'll have it ready for you soon.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-8 flex items-center gap-3">
                <button
                  onClick={() => navigate('/cart')}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Back to cart"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to cart
                </button>
              </div>

              <div className="mb-8">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Almost there</p>
                <h1 className="font-syne text-4xl font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Checkout
                </h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                {/* Checkout form */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Delivery Information</h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="checkout-name" className="mb-1.5 block text-sm font-medium text-foreground">Full name</label>
                          <input
                            id="checkout-name"
                            type="text"
                            {...register('name')}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          />
                          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label htmlFor="checkout-email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                          <input
                            id="checkout-email"
                            type="email"
                            {...register('email')}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          />
                          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="checkout-address" className="mb-1.5 block text-sm font-medium text-foreground">Street address</label>
                        <input
                          id="checkout-address"
                          type="text"
                          placeholder="123 Main St"
                          {...register('address')}
                          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address.message}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="checkout-city" className="mb-1.5 block text-sm font-medium text-foreground">City</label>
                          <input
                            id="checkout-city"
                            type="text"
                            placeholder="Cairo"
                            {...register('city')}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          />
                          {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city.message}</p>}
                        </div>
                        <div>
                          <label htmlFor="checkout-postal" className="mb-1.5 block text-sm font-medium text-foreground">Postal code</label>
                          <input
                            id="checkout-postal"
                            type="text"
                            placeholder="11511"
                            {...register('postalCode')}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          />
                          {errors.postalCode && <p className="mt-1 text-xs text-red-400">{errors.postalCode.message}</p>}
                        </div>
                      </div>
                    </div>

                    <button
                      id="place-order-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      {isSubmitting ? 'Placing order…' : `Place order — ${formatCurrency(total)}`}
                    </button>

                    <p className="text-center text-xs text-muted-foreground">
                      Note: Order management is not yet available in the backend. This is a frontend-only order flow.
                    </p>
                  </form>
                </div>

                {/* Summary */}
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4 sticky top-24">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Order Summary</h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3 text-sm">
                        <ProductImage
                          product={item.product}
                          width={120}
                          className="h-12 w-12 flex-shrink-0 rounded-md border border-border"
                        />
                        <span className="text-muted-foreground truncate flex-1">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="text-foreground flex-shrink-0">{formatCurrency(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground text-lg">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
