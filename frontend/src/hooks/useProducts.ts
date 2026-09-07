import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/services/api/products.api';
import type { CreateProductPayload, UpdateProductPayload } from '@/types';

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

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      productsApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY(variables.id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
  });
}

