import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NovaLogo } from '@/components/common/NovaLogo';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-background text-center">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="mb-8 flex justify-center">
          <Link to="/" aria-label="NOVA Store Home">
            <NovaLogo size="lg" />
          </Link>
        </div>

        <div className="mb-4 text-[120px] font-bold leading-none text-foreground/5 select-none font-syne">
          404
        </div>

        <h1 className="font-syne text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
          Page not found
        </h1>
        <p className="mb-8 max-w-sm text-muted-foreground leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            id="not-found-home-btn"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            Go home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-7 py-3 text-sm font-semibold text-foreground hover:bg-white/8 transition-colors"
          >
            Browse products
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
