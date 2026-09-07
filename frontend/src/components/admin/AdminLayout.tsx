import { useState, type ReactNode } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  BarChart3,
  Store,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NovaLogo } from '@/components/common/NovaLogo';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { CART_QUERY_KEY } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNavItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: Layers },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/60 backdrop-blur-xl fixed inset-y-0 z-30">
        {/* Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border">
          <Link to="/" aria-label="Return to Storefront">
            <NovaLogo size="sm" />
          </Link>
          <span className="flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/20 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          <div className="pt-1 flex flex-col gap-1">
            <Link
              to="/products"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <Store className="h-3.5 w-3.5" />
              Storefront View
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-left"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground"
            aria-label="Open Admin Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <NovaLogo size="sm" />
        </div>
        <span className="flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
          <Shield className="h-3 w-3" />
          Admin
        </span>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card flex flex-col md:hidden"
            >
              <div className="h-16 px-5 flex items-center justify-between border-b border-border">
                <NovaLogo size="sm" />
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {adminNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary/15 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-border space-y-2">
                <Link
                  to="/products"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
                >
                  <Store className="h-4 w-4 text-primary" />
                  Storefront View
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
