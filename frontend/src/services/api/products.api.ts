import apiClient from './client';
import type {
  ProductsResponse,
  ProductResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from '@/types';

/**
 * Build a FormData body when the payload contains a File image,
 * otherwise return plain JSON-serialisable object.
 */
function toFormDataOrJson(
  payload: CreateProductPayload | UpdateProductPayload
): FormData | Record<string, unknown> {
  if (payload.image instanceof File) {
    const fd = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        fd.append('image', value);
      } else if (value !== undefined && value !== null) {
        fd.append(key, String(value));
      }
    });
    return fd;
  }
  // No file — send as JSON (Content-Type: application/json)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { image: _image, ...rest } = payload as CreateProductPayload;
  return rest as Record<string, unknown>;
}

export const productsApi = {
  getAll: async (): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ProductsResponse>('/products');
    return data;
  },

  getById: async (id: string): Promise<ProductResponse> => {
    const { data } = await apiClient.get<ProductResponse>(`/products/${id}`);
    return data;
  },

  create: async (payload: CreateProductPayload): Promise<ProductResponse> => {
    const body = toFormDataOrJson(payload);
    const isFormData = body instanceof FormData;
    const { data } = await apiClient.post<ProductResponse>('/products', body, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return data;
  },

  update: async (id: string, payload: UpdateProductPayload): Promise<ProductResponse> => {
    const body = toFormDataOrJson(payload);
    const isFormData = body instanceof FormData;
    const { data } = await apiClient.put<ProductResponse>(`/products/${id}`, body, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return data;
  },

  delete: async (id: string): Promise<ProductResponse> => {
    const { data } = await apiClient.delete<ProductResponse>(`/products/${id}`);
    return data;
  },
};
