import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/services/api/cart.api';
import { useAuth } from '@/context/AuthContext';
import type { Cart, CartResponse } from '@/types';


export const CART_QUERY_KEY = ['cart'];

export function useCart() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1 min
    retry: false,
  });
}

export function useCartItemCount() {
  const { data } = useCart();
  if (!data?.cart?.items) return 0;
  return data.cart.items.reduce((acc, item) => acc + item.quantity, 0);
}

export function useCartTotal() {
  const { data } = useCart();
  if (!data?.cart?.items) return 0;
  return data.cart.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: (data: CartResponse) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateItem(productId, quantity),
    onSuccess: (data: CartResponse) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartApi.removeItem(productId),
    onSuccess: (data: CartResponse) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
    },
  });
}
