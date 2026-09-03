import { Link } from 'react-router-dom';
import { NovaLogo } from '@/components/common/NovaLogo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <NovaLogo size="md" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              Premium digital commerce. Curated products for a modern lifestyle.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'All Products', to: '/products' },
                { label: 'Categories', to: '/categories' },
                { label: 'Cart', to: '/cart' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-widest">Account</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Sign In', to: '/login' },
                { label: 'Create Account', to: '/register' },
                { label: 'My Profile', to: '/profile' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} NOVA Store. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Premium Digital Commerce
          </p>
        </div>
      </div>
    </footer>
  );
}
