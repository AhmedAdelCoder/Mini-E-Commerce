import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getCategoryImageUrl } from '@/lib/productImage';

interface CategoryTileProps {
  category: string;
  selected?: boolean;
  className?: string;
}

export function CategoryTileVisual({ category, selected, className }: CategoryTileProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn('absolute inset-0', className)}>
      {!failed ? (
        <img
          src={getCategoryImageUrl(category, 640)}
          alt=""
          className={cn(
            'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
            selected ? 'scale-105' : ''
          )}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-violet-900/60 to-indigo-900/60" />
      )}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20',
          selected ? 'from-primary/50 via-black/40' : ''
        )}
      />
    </div>
  );
}
