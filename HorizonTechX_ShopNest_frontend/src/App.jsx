import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Layout } from './components/layout/Layout';
import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';
import { Home } from './pages/Home';
import { ProductList } from './pages/product/ProductList';
import { ProductDetails } from './pages/product/ProductDetails';
import { Cart } from './pages/cart/Cart';
import { Checkout } from './pages/cart/Checkout';
import { Orders } from './pages/order/Orders';
import { OrderDetails } from './pages/order/OrderDetails';
import { Dashboard } from './pages/account/Dashboard';
import { Auth } from './pages/auth/Auth';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';


export default function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    initAuth();
    fetchCart();
  }, [initAuth, fetchCart]);

  return (
    <>
      {/* Route-Change Smooth Scroll Restoration */}
      <ScrollToTop />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            borderRadius: '12px',
            border: '1px solid var(--toast-border)',
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: '500',
            boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.12)',
            fontFamily: 'inherit',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Application Routes */}
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <Layout activeTab="home">
              <Home />
            </Layout>
          }
        />

        {/* Product Catalog / PLP */}
        <Route
          path="/shop"
          element={
            <Layout activeTab="plp">
              <ProductList />
            </Layout>
          }
        />
        <Route path="/products" element={<Navigate to="/shop" replace />} />

        {/* Product Details / PDP */}
        <Route
          path="/product/:id"
          element={
            <Layout activeTab="plp">
              <ProductDetails />
            </Layout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Layout activeTab="plp">
              <ProductDetails />
            </Layout>
          }
        />

        {/* Full Cart Page */}
        <Route
          path="/cart"
          element={
            <Layout activeTab="cart">
              <Cart />
            </Layout>
          }
        />

        {/* Distraction-Free Production Checkout */}
        <Route path="/checkout" element={<Checkout />} />

        {/* Orders Listing (Protected) */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Layout activeTab="dashboard">
                <Orders />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Single Order Details & Tracking (Protected) */}
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <Layout activeTab="dashboard">
                <OrderDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Account Dashboard (Protected: Unauthenticated users are redirected to login) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout activeTab="dashboard">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/account" element={<Navigate to="/dashboard" replace />} />

        {/* Full Page Standalone Authentication */}
        <Route path="/auth" element={<Auth />} />

        {/* Catch-all 404 Not Found */}
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}
