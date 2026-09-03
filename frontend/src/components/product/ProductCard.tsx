
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useAddToCart } from '@/hooks/useCart';
import { extractErrorMessage } from '@/services/api/client';
import { formatCurrency, cn } from '@/lib/utils';
import { useState } from 'react';
import { ProductImage } from '@/components/product/ProductImage';

interface ProductCardProps {
  product: Product;
  className?: string;
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
        <div className="relative aspect-square overflow-hidden bg-muted">
          <ProductImage
            product={product}
            className="absolute inset-0"
            imgClassName="transition-transform duration-500 group-hover:scale-105"
            width={640}
          />
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
