import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ShieldCheck, LogOut, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { CART_QUERY_KEY } from '@/hooks/useCart';
import { EmptyState } from '@/components/common/EmptyState';

export function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 py-20">
          <EmptyState
            icon={<User className="h-8 w-8" />}
            title="Not signed in"
            description="Please sign in to view your account."
            action={
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Sign in
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
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">My Account</p>
          <h1 className="font-syne text-4xl font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
            Profile
          </h1>
        </div>

        <div className="max-w-2xl space-y-5">
          {/* Avatar + name */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-2xl">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5 capitalize">{user?.role} account</p>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-border bg-card p-6 space-y-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Account Details</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="text-sm font-medium text-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium text-foreground capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <Link
              to="/cart"
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 hover:border-border/80 hover:bg-white/5 transition-all"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">My Cart</p>
                <p className="text-xs text-muted-foreground">View cart items</p>
              </div>
            </Link>

            <button
              id="profile-logout-btn"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 hover:border-red-500/30 hover:bg-red-500/5 transition-all text-left"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
                <LogOut className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-400">Sign Out</p>
                <p className="text-xs text-muted-foreground">End your session</p>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
