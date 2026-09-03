import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/services/api/cart.api';
import { useAuth } from '@/context/AuthContext';
import type { CartItem } from '@/types';
import { isPopulatedProduct } from '@/lib/auth';

export const CART_QUERY_KEY = ['cart'];

export function getPopulatedCartItems(items: CartItem[] | undefined): CartItem[] {
  return (items ?? []).filter((item) => isPopulatedProduct(item.product));
}

export function useCart() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
    retry: false,
  });
}

export function useCartItemCount() {
  const { data } = useCart();
  return getPopulatedCartItems(data?.cart?.items).reduce((acc, item) => acc + item.quantity, 0);
}

export function useCartTotal() {
  const { data } = useCart();
  return getPopulatedCartItems(data?.cart?.items).reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      // Backend add/update/remove responses are not populated — refetch GET /cart.
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateItem(productId, quantity),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartApi.removeItem(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
