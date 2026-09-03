import { useState } from 'react';
import { Package } from 'lucide-react';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/productImage';

interface ProductImageProps {
  product: Pick<Product, '_id' | 'name' | 'category'> & { image?: string };
  alt?: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  eager?: boolean;
}

export function ProductImage({
  product,
  alt,
  className,
  imgClassName,
  width = 800,
  eager = false,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const src = getProductImageUrl(product, width);

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {!failed ? (
        <img
          src={src}
          alt={alt ?? product.name}
          className={cn(
            'h-full w-full object-cover object-center',
            imgClassName
          )}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-zinc-900">
          <Package className="h-10 w-10 text-white/20" aria-hidden />
        </div>
      )}
    </div>
  );
}
