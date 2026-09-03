import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products.api';

export const PRODUCTS_QUERY_KEY = ['products'];
export const PRODUCT_QUERY_KEY = (id: string) => ['products', id];

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: productsApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEY(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategories() {
  const { data, isLoading, isError } = useProducts();

  const categories = data?.products
    ? [...new Set(data.products.map((p) => p.category))].sort()
    : [];

  return { categories, isLoading, isError };
}
