import axios from 'axios';
import apiClient from './client';
import type { CartResponse, AddToCartPayload } from '@/types';

export const cartApi = {
  getCart: async (): Promise<CartResponse | null> => {
    try {
      const { data } = await apiClient.get<CartResponse>('/cart');
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  addToCart: async (payload: AddToCartPayload): Promise<CartResponse> => {
    const { data } = await apiClient.post<CartResponse>('/cart', payload);
    return data;
  },

  updateItem: async (productId: string, quantity: number): Promise<CartResponse> => {
    const { data } = await apiClient.put<CartResponse>(`/cart/${productId}`, { quantity });
    return data;
  },

  removeItem: async (productId: string): Promise<CartResponse> => {
    const { data } = await apiClient.delete<CartResponse>(`/cart/${productId}`);
    return data;
  },
};
