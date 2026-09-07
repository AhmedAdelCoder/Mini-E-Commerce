// API Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  product: Product;
}

// Cart Types
export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  cart: Cart;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartPayload {
  quantity: number;
}

// Product mutation payloads
export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

// Error Types
export interface ApiError {
  success: false;
  message: string;
}
