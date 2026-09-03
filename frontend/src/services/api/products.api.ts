import apiClient from './client';
import type { ProductsResponse, ProductResponse } from '@/types';

export const productsApi = {
  getAll: async (): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>('/products');
    return data;
  },

  getById: async (id: string): Promise<ProductResponse> => {
    const { data } = await apiClient.get<ProductResponse>(`/products/${id}`);
    return data;
  },
};
