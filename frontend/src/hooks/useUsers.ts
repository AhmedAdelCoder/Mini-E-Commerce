import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/services/api/users.api';

export const USERS_QUERY_KEY = ['users'];

export function useUsers(page = 1, limit = 50) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, page],
    queryFn: () => usersApi.getAll({ page, limit }),
    staleTime: 1000 * 60, // 1 min
    retry: false,
  });
}
