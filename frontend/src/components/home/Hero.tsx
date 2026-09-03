import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Zap, Shield, Truck } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const features = [
  { icon: Truck, label: 'Fast Delivery' },
  { icon: Shield, label: 'Secure Checkout' },
  { icon: Zap, label: 'Premium Quality' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28 md:py-36">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0) 70%)',
          }}
        />
        <div
          className="absolute -top-20 right-0 h-[400px] w-[400px] rounded-full hidden lg:block"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0) 70%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="mb-6 inline-flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              Premium Digital Commerce
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="mb-5 font-syne text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <span className="text-foreground">Shop the</span>
            <br />
            <span className="text-gradient">Future</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mb-10 max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Curated premium products, seamless experience. NOVA Store brings you the finest selection with effortless style.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/products"
              id="hero-shop-now-btn"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all duration-200 hover:shadow-primary/40"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop Now
              <ArrowRight className="h-4 w-4 -mr-1" />
            </Link>
            <Link
              to="/categories"
              id="hero-categories-btn"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-white/8 hover:border-border/80 transition-all duration-200"
            >
              Browse Categories
            </Link>
          </motion.div>

          {/* Feature badges */}
          <motion.div
            variants={itemVariants}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-muted-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
