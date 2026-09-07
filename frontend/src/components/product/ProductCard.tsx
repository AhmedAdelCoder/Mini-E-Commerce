
import { Link } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useAddToCart } from '@/hooks/useCart';
import { extractErrorMessage } from '@/services/api/client';
import { formatCurrency, cn } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/productImage';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const PLACEHOLDER_COLORS = [
  'from-violet-900/40 to-indigo-900/40',
  'from-slate-800/60 to-zinc-900/60',
  'from-blue-900/40 to-cyan-900/30',
  'from-emerald-900/30 to-teal-900/40',
  'from-rose-900/30 to-pink-900/30',
];

function getPlaceholderColor(name: string) {
  const idx = name.charCodeAt(0) % PLACEHOLDER_COLORS.length;
  return PLACEHOLDER_COLORS[idx];
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const [quantity] = useState(1);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      return;
    }

    if (isOutOfStock) return;

    try {
      await addToCart.mutateAsync({ productId: product._id, quantity });
      toast.success(`${product.name} added to cart`, {
        description: `Qty: ${quantity}`,
        duration: 2500,
      });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const gradient = getPlaceholderColor(product.name);
  const [imgFailed, setImgFailed] = useState(false);
  const imgSrc = getProductImageUrl(product);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn('group', className)}
    >
      <Link
        to={`/products/${product._id}`}
        className="block rounded-xl border border-border bg-card overflow-hidden hover:border-border/80 hover:shadow-lg hover:shadow-black/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`View ${product.name}`}
      >
        {/* Image Area */}
        <div className="relative aspect-square overflow-hidden">
          {/* Gradient placeholder — always rendered as background/fallback */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br flex items-center justify-center',
              gradient
            )}
          >
            <Package className="h-14 w-14 text-white/15" />
          </div>

          {/* Actual image — sits above the gradient; hidden on error */}
          {!imgFailed && (
            <img
              src={imgSrc}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
            />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Stock badge */}
          {isOutOfStock && (
            <div className="absolute top-3 left-3 rounded-md bg-black/70 backdrop-blur-sm px-2 py-1 text-xs font-medium text-white/70">
              Out of stock
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-3 left-3 rounded-md bg-amber-500/20 border border-amber-500/30 px-2 py-1 text-xs font-medium text-amber-400">
              Only {product.stock} left
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="mb-1">
            <span className="text-[11px] font-medium uppercase tracking-widest text-primary/70">
              {product.category}
            </span>
          </div>
          <h3 className="mb-3 text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-bold text-foreground">
              {formatCurrency(product.price)}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCart.isPending}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200',
                isOutOfStock
                  ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                  : 'bg-primary/15 text-primary hover:bg-primary hover:text-white border border-primary/30 hover:border-transparent'
              )}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {addToCart.isPending ? 'Adding…' : 'Add'}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
