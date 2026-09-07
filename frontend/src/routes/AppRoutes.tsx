import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminProtectedRoute } from './AdminProtectedRoute';

const HomePage = lazy(() => import('@/pages/Home/HomePage').then(m => ({ default: m.HomePage })));
const ProductsPage = lazy(() => import('@/pages/Products/ProductsPage').then(m => ({ default: m.ProductsPage })));
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetails/ProductDetailsPage').then(m => ({ default: m.ProductDetailsPage })));
const CategoriesPage = lazy(() => import('@/pages/Categories/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const CartPage = lazy(() => import('@/pages/Cart/CartPage').then(m => ({ default: m.CartPage })));
const LoginPage = lazy(() => import('@/pages/Login/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/Register/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const CheckoutPage = lazy(() => import('@/pages/Checkout/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrdersPage = lazy(() => import('@/pages/Orders/OrdersPage').then(m => ({ default: m.OrdersPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Admin Pages
const AdminDashboardPage = lazy(() => import('@/pages/Admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminProductsPage = lazy(() => import('@/pages/Admin/AdminProductsPage').then(m => ({ default: m.AdminProductsPage })));
const AdminCategoriesPage = lazy(() => import('@/pages/Admin/AdminCategoriesPage').then(m => ({ default: m.AdminCategoriesPage })));
const AdminUsersPage = lazy(() => import('@/pages/Admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminOrdersPage = lazy(() => import('@/pages/Admin/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })));
const AdminReportsPage = lazy(() => import('@/pages/Admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminProtectedRoute>
                <AdminProductsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminProtectedRoute>
                <AdminCategoriesPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminUsersPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminProtectedRoute>
                <AdminOrdersPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminProtectedRoute>
                <AdminReportsPage />
              </AdminProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

