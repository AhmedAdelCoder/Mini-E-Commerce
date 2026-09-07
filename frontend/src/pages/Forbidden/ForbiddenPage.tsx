import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';

export function ForbiddenPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 py-20 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md text-center rounded-2xl border border-red-500/20 bg-card p-8 shadow-2xl shadow-red-500/5"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400">403 Access Denied</p>
          <h1 className="mt-1 font-syne text-2xl font-bold text-foreground">Admin Access Required</h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            You do not have permission to view the NOVA Admin Panel. This area is restricted to authorized administrators.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
