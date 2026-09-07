import apiClient from './client';
import type { ProductsResponse, ProductResponse, CreateProductPayload, UpdateProductPayload } from '@/types';

export const productsApi = {
  getAll: async (): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>('/products');
    return data;
  },

  getById: async (id: string): Promise<ProductResponse> => {
    const { data } = await apiClient.get<ProductResponse>(`/products/${id}`);
    return data;
  },

  create: async (payload: CreateProductPayload): Promise<ProductResponse> => {
    const { data } = await apiClient.post<ProductResponse>('/products', payload);
    return data;
  },

  update: async (id: string, payload: UpdateProductPayload): Promise<ProductResponse> => {
    const { data } = await apiClient.put<ProductResponse>(`/products/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<ProductResponse> => {
    const { data } = await apiClient.delete<ProductResponse>(`/products/${id}`);
    return data;
  },
};

