import axios, { AxiosError } from 'axios';
import { AUTH_EXPIRED_EVENT, AUTH_TOKEN_KEY, clearAuthStorage } from '@/lib/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

function isCredentialAuthRequest(url?: string): boolean {
  if (!url) return false;
  return url.includes('/auth/login') || url.includes('/auth/register');
}

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    if (status === 401 && !isCredentialAuthRequest(requestUrl)) {
      clearAuthStorage();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }

    return Promise.reject(error);
  }
);

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (axios.isAxiosError(error) && error.response && error.response.status < 500) {
    return false;
  }
  return failureCount < 1;
}

/**
 * Extract a friendly error message from Axios errors.
 */
export function extractErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;

    if (!error.response || error.message === 'Network Error') {
      return 'Unable to connect. Please check your network.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }

    switch (error.response.status) {
      case 400:
        return 'Please check your input and try again.';
      case 401:
        return 'Please sign in to continue.';
      case 403:
        return 'You do not have permission to do that.';
      case 404:
        return 'The requested item could not be found.';
      case 409:
        return 'This conflicts with existing data.';
      case 422:
        return 'Some fields are invalid. Please review and try again.';
      default:
        if (error.response.status >= 500) {
          return 'Server error. Please try again later.';
        }
    }
  }
  return fallback;
}

export default apiClient;
