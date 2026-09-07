import apiClient from './client';
import type { UsersResponse } from '@/types';

export const usersApi = {
  /** Admin: list all users */
  getAll: async (params?: { page?: number; limit?: number }): Promise<UsersResponse> => {
    const { data } = await apiClient.get('/users', { params });
    return data;
  },
};
