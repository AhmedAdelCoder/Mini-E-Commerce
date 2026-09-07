import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, ChevronRight, Package, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NovaLogo } from '@/components/common/NovaLogo';
import { useAuth } from '@/context/AuthContext';
import { useCartItemCount } from '@/hooks/useCart';
import { useQueryClient } from '@tanstack/react-query';
import { CART_QUERY_KEY } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Shop', to: '/products' },
  { label: 'Categories', to: '/categories' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = useCartItemCount();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-border/60 glass-panel">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="NOVA Store — Home">
            <NovaLogo size="md" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'text-foreground bg-white/8'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              aria-label={`Cart${cartCount > 0 ? ` — ${cartCount} items` : ''}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {isAuthenticated && cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-xs">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card shadow-xl shadow-black/30 py-1.5"
                    >
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-xs text-muted-foreground">Signed in as</p>
                        <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        My Account
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-indigo-400 font-medium hover:bg-indigo-500/10 transition-colors"
                        >
                          <Shield className="h-4 w-4 text-indigo-400" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Click-away */}
                {userMenuOpen && (
                  <div className="fixed inset-0 z-[-1]" onClick={() => setUserMenuOpen(false)} />
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-72 border-l border-border bg-card flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <NovaLogo size="sm" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'text-foreground bg-white/8'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                      )
                    }
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </NavLink>
                ))}

                <NavLink
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive ? 'text-foreground bg-white/8' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    )
                  }
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Cart
                  </div>
                  {cartCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white px-1">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </nav>

              <div className="px-3 py-4 border-t border-border">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2">
                      <p className="text-xs text-muted-foreground">Signed in as</p>
                      <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      My Account
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-indigo-400 font-medium hover:bg-indigo-500/10 transition-colors"
                      >
                        <Shield className="h-4 w-4 text-indigo-400" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
