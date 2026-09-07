import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/services/api/orders.api';
import { useAuth } from '@/context/AuthContext';

export const MY_ORDERS_QUERY_KEY = ['orders', 'my'];
export const ALL_ORDERS_QUERY_KEY = (status?: string) =>
  status ? ['orders', 'all', status] : ['orders', 'all'];

/** Customer: fetch their own orders */
export function useMyOrders() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: MY_ORDERS_QUERY_KEY,
    queryFn: () => ordersApi.getMyOrders(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1 min
    retry: false,
  });
}

/** Admin: fetch all orders, optionally filtered by status */
export function useAllOrders(status?: string, page = 1) {
  return useQuery({
    queryKey: [...ALL_ORDERS_QUERY_KEY(status), page],
    queryFn: () => ordersApi.getAll({ status, page, limit: 20 }),
    staleTime: 1000 * 30, // 30 sec
    retry: false,
  });
}

/** Admin: update an order's status */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      ordersApi.updateStatus(orderId, status),
    onSuccess: () => {
      // Invalidate all orders queries so the table refreshes
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
