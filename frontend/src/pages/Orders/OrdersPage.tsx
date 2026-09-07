import { Link } from 'react-router-dom';
import { Package, ShoppingBag, ChevronRight, Clock, CheckCircle, Truck, XCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { useMyOrders } from '@/hooks/useOrders';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { formatCurrency, cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

// ─── Status helpers ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  processing: {
    label: 'Processing',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
    icon: <RefreshCw className="h-3.5 w-3.5" />,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    icon: <Truck className="h-3.5 w-3.5" />,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        cfg.color,
        cfg.bgColor,
        cfg.borderColor
      )}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Progress stepper ──────────────────────────────────────────────────────

const STEPS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function OrderProgress({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-xs text-red-400">
        <XCircle className="h-4 w-4" />
        This order was cancelled.
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {STEPS.map((step, idx) => {
        const cfg = STATUS_CONFIG[step];
        const done = idx <= currentIdx;
        return (
          <div key={step} className="flex items-center gap-1 flex-shrink-0">
            <div
              className={cn(
                'flex items-center justify-center rounded-full h-6 w-6 border text-[10px] font-bold transition-colors',
                done
                  ? `${cfg.bgColor} ${cfg.borderColor} ${cfg.color}`
                  : 'bg-white/5 border-border text-muted-foreground'
              )}
            >
              {idx + 1}
            </div>
            <span
              className={cn(
                'text-[10px] font-medium hidden sm:block',
                done ? cfg.color : 'text-muted-foreground'
              )}
            >
              {cfg.label}
            </span>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-px w-4 sm:w-8 mx-0.5 rounded transition-colors',
                  idx < currentIdx ? 'bg-primary/60' : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export function OrdersPage() {
  const { data, isLoading, isError, refetch } = useMyOrders();
  const orders = data?.data ?? [];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Account</p>
          <h1
            className="font-syne text-4xl font-bold text-foreground"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            My Orders
          </h1>
        </div>

        {/* States */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState onRetry={() => refetch()} message="Could not load your orders." />
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <EmptyState
            icon={<Package className="h-8 w-8" />}
            title="No orders yet"
            description="Once you place an order, it will appear here."
            action={
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Start Shopping
              </Link>
            }
          />
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                {/* Order header */}
                <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={order.status} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-muted-foreground truncate">
                      {order._id}
                    </p>
                  </div>
                  <span className="text-base font-bold text-foreground flex-shrink-0">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>

                {/* Progress */}
                <div className="px-5 py-3 border-b border-border bg-background/40">
                  <OrderProgress status={order.status} />
                </div>

                {/* Items */}
                <div className="px-5 py-4 space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-muted-foreground text-xs w-4 flex-shrink-0">
                          {item.quantity}×
                        </span>
                        <span className="text-foreground truncate">{item.name}</span>
                      </div>
                      <span className="text-muted-foreground flex-shrink-0">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping address */}
                <div className="px-5 pb-4">
                  <p className="text-xs text-muted-foreground">
                    Deliver to:{' '}
                    <span className="text-foreground">
                      {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.postalCode}
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
