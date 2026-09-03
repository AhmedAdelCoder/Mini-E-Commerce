import { Hero } from '@/components/home/Hero';
import { FeaturedProducts, CategoryHighlights } from '@/components/home/FeaturedProducts';
import { MainLayout } from '@/components/layout/MainLayout';

export function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <div className="border-t border-border">
        <FeaturedProducts />
      </div>
      <CategoryHighlights />
    </MainLayout>
  );
}
