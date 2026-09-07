import { useState } from 'react';
import {
  ShoppingBag, PackageCheck, Clock, Truck, XCircle,
  CheckCircle, RefreshCw, ChevronDown, Search,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAllOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { Skeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/EmptyState';
import { formatCurrency, cn } from '@/lib/utils';
import { extractErrorMessage } from '@/services/api/client';
import type { Order, OrderStatus } from '@/types';

// ─── Status config ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }
> = {
  pending:    { label: 'Pending',    color: 'text-amber-400',  bgColor: 'bg-amber-500/10',  borderColor: 'border-amber-500/20',  icon: <Clock       className="h-3 w-3" /> },
  confirmed:  { label: 'Confirmed',  color: 'text-blue-400',   bgColor: 'bg-blue-500/10',   borderColor: 'border-blue-500/20',   icon: <CheckCircle className="h-3 w-3" /> },
  processing: { label: 'Processing', color: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/20', icon: <RefreshCw   className="h-3 w-3" /> },
  shipped:    { label: 'Shipped',    color: 'text-cyan-400',   bgColor: 'bg-cyan-500/10',   borderColor: 'border-cyan-500/20',   icon: <Truck       className="h-3 w-3" /> },
  delivered:  { label: 'Delivered',  color: 'text-emerald-400',bgColor: 'bg-emerald-500/10',borderColor: 'border-emerald-500/20',icon: <PackageCheck className="h-3 w-3" /> },
  cancelled:  { label: 'Cancelled',  color: 'text-red-400',    bgColor: 'bg-red-500/10',    borderColor: 'border-red-500/20',    icon: <XCircle     className="h-3 w-3" /> },
};

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold', cfg.color, cfg.bgColor, cfg.borderColor)}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

// ─── Status selector dropdown ─────────────────────────────────────────────

function StatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: OrderStatus;
}) {
  const { mutateAsync, isPending } = useUpdateOrderStatus();
  const [open, setOpen] = useState(false);

  const handleSelect = async (status: OrderStatus) => {
    if (status === current) { setOpen(false); return; }
    setOpen(false);
    try {
      await mutateAsync({ orderId, status });
      toast.success(`Order status updated to "${STATUS_CONFIG[status].label}"`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Failed to update order status'));
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-white/5 disabled:opacity-50 transition-colors"
      >
        <StatusBadge status={current} />
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-40 rounded-xl border border-border bg-card shadow-xl shadow-black/30 py-1 overflow-hidden">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/5',
                  s === current ? 'bg-white/5' : ''
                )}
              >
                <StatusBadge status={s} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Helper: get user display from populated or id-only field ─────────────
function getUserDisplay(user: Order['user']) {
  if (typeof user === 'object' && user !== null && 'name' in user) {
    return { name: user.name, email: user.email };
  }
  return { name: String(user), email: '' };
}

// ─── Page ─────────────────────────────────────────────────────────────────

export function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useAllOrders(statusFilter || undefined, page);

  const orders: Order[] = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  // Client-side search by order ID or customer name/email
  const filtered = search.trim()
    ? orders.filter((o) => {
        const q = search.toLowerCase();
        const { name, email } = getUserDisplay(o.user);
        return (
          o._id.toLowerCase().includes(q) ||
          name.toLowerCase().includes(q) ||
          email.toLowerCase().includes(q)
        );
      })
    : orders;

  // KPI counts derived from current page data (full stats would need a separate endpoint)
  const pending   = orders.filter((o) => o.status === 'pending').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const revenue   = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Sales & Fulfilment</p>
            <h1 className="font-syne text-3xl font-bold text-foreground">Order Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading ? 'Loading…' : `${total} total orders`}
            </p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Pending',   value: pending,                        color: 'text-amber-400',   icon: <Clock        className="h-5 w-5" /> },
            { label: 'Delivered', value: delivered,                       color: 'text-emerald-400', icon: <PackageCheck className="h-5 w-5" /> },
            { label: 'Revenue',   value: formatCurrency(revenue),         color: 'text-primary',     icon: <ShoppingBag  className="h-5 w-5" /> },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-muted-foreground">
                {card.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className={cn('text-xl font-bold', card.color)}>{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by order ID or customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <option value="">All statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} message="Failed to load orders." />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
            <PackageCheck className="h-10 w-10 mx-auto opacity-30 text-muted-foreground" />
            <h3 className="text-base font-bold text-foreground">No orders found</h3>
            <p className="text-sm text-muted-foreground">Try changing the filter or search term.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-white/3">
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Customer</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((order, idx) => {
                    const { name, email } = getUserDisplay(order.user);
                    return (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="hover:bg-white/2 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs text-muted-foreground">
                            {order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <p className="font-medium text-foreground truncate max-w-[140px]">{name}</p>
                          {email && <p className="text-xs text-muted-foreground truncate max-w-[140px]">{email}</p>}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-3 px-4">
                          <StatusSelect orderId={order._id} current={order.status} />
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white/5 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white/5 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
