import { Check, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AVAILABLE_IMAGES, saveCategoryImage } from '@/lib/categoryImages';
import { cn } from '@/lib/utils';

interface Props {
  category: string;
  currentImage: string;
  onChanged: (newImage: string) => void;
}

function Popover({
  category,
  currentImage,
  onSelect,
  onClose,
}: {
  category: string;
  currentImage: string;
  onSelect: (img: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -6 }}
        transition={{ duration: 0.15 }}
        className="absolute top-9 right-0 z-50 w-64 rounded-2xl border border-border bg-card shadow-2xl shadow-black/50 p-3"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-0.5">
          Image for <span className="text-foreground capitalize">{category}</span>
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {AVAILABLE_IMAGES.map((img) => {
            const active = currentImage === img;
            return (
              <button
                key={img}
                type="button"
                onClick={() => { onSelect(img); onClose(); }}
                className={cn(
                  'relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  active ? 'border-primary' : 'border-transparent hover:border-primary/40'
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                {active && (
                  <div className="absolute inset-0 bg-primary/25 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white drop-shadow" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

/**
 * A small "Change Image" button that opens a popover letting the admin
 * pick one of the available placeholder images for a category.
 * Saves to localStorage and calls onChanged so the parent can re-render.
 */
export function CategoryImagePicker({ category, currentImage, onChanged }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (img: string) => {
    saveCategoryImage(category, img);
    onChanged(img);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-sm px-2 py-1 text-[11px] font-semibold text-white hover:bg-black/80 transition-colors"
        aria-label={`Change image for ${category}`}
      >
        <ImageIcon className="h-3 w-3" />
        Change Image
      </button>
      <AnimatePresence>
        {open && (
          <Popover
            category={category}
            currentImage={currentImage}
            onSelect={handleSelect}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
