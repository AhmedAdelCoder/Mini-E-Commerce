import apiClient from './client';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types';

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials);
    return data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  getProfile: async (): Promise<AuthResponse> => {
    const { data } = await apiClient.get<AuthResponse>('/auth/customer');
    return data;
  },
};
