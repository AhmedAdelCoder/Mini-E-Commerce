import axios, { AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth expiry globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear local auth state
      localStorage.removeItem('nova_token');
      localStorage.removeItem('nova_user');
    }
    return Promise.reject(error);
  }
);

/**
 * Extract a friendly error message from Axios errors.
 */
export function extractErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.message === 'Network Error') return 'Unable to connect. Please check your network.';
    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export default apiClient;
