import { ShoppingBag, AlertCircle, PackageCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminOrdersPage() {
  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Sales & Fulfilment</p>
          <h1 className="font-syne text-3xl font-bold text-foreground">Order Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Order pipeline and fulfilment status
          </p>
        </div>

        {/* Backend limitation notice */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5 flex items-start gap-4 text-blue-300">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-400" />
          <div className="text-xs space-y-1 leading-relaxed">
            <p className="font-bold text-blue-200">Backend API Notice</p>
            <p>
              The backend service currently handles shopping cart persistence (`/api/v1/cart`) without an explicit backend Order schema or API endpoints.
              Front-end checkout flow processes cart orders directly with real cart item data.
            </p>
          </div>
        </div>

        {/* Status Pipeline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-5 space-y-2"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Orders</span>
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground">Orders awaiting processing</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-border bg-card p-5 space-y-2"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fulfilled Orders</span>
            <p className="text-2xl font-bold text-emerald-400">0</p>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-5 space-y-2"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Revenue</span>
            <p className="text-2xl font-bold text-primary">$0.00</p>
            <p className="text-xs text-muted-foreground">Calculated from order history</p>
          </motion.div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
          <PackageCheck className="h-10 w-10 mx-auto opacity-30 text-muted-foreground" />
          <h3 className="text-base font-bold text-foreground">No Orders Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            When customer orders are placed, order receipts and status updates will be displayed here.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
