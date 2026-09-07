import apiClient from './client';
import type {
  CreateOrderPayload,
  Order,
  OrdersResponse,
  OrderResponse,
} from '@/types';

export const ordersApi = {
  /** Customer: place a new order from current cart */
  create: async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    const { data } = await apiClient.post('/orders', payload);
    return data;
  },

  /** Customer: list their own orders */
  getMyOrders: async (): Promise<{ success: boolean; data: Order[] }> => {
    const { data } = await apiClient.get('/orders/my');
    return data;
  },

  /** Admin: list all orders with optional filters */
  getAll: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<OrdersResponse> => {
    const { data } = await apiClient.get('/orders', { params });
    return data;
  },

  /** Admin: update an order's status */
  updateStatus: async (
    orderId: string,
    status: string
  ): Promise<OrderResponse> => {
    const { data } = await apiClient.patch(`/orders/${orderId}/status`, { status });
    return data;
  },
};
