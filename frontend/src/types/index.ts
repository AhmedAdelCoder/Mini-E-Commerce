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
  image?: string | null;   // URL like /uploads/filename.jpg — null when not set
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
  image?: File | null;   // optional file for upload
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

// Order Types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderItem {
  product: string; // ObjectId ref — not populated in list views
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  data: Order;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
}

// User management (admin)
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error Types
export interface ApiError {
  success: false;
  message: string;
}
