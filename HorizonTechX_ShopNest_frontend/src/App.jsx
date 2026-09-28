import React, { useEffect } from 'react';
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

/**
 * HorizonTechX ShopNest - Master Application Root
 * Fully powered by React Router v7 with zero layout shift,
 * automatic scroll restoration, and obsidian toast notification architecture.
 */
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

      {/* Global Toast Notification System (Theme-Adaptive, Compact Padding, Small Text, Zero Icons) */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          icon: null,
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
          }
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

        {/* Orders Listing */}
        <Route
          path="/orders"
          element={
            <Layout activeTab="dashboard">
              <Orders />
            </Layout>
          }
        />

        {/* Single Order Details & Tracking */}
        <Route
          path="/orders/:id"
          element={
            <Layout activeTab="dashboard">
              <OrderDetails />
            </Layout>
          }
        />

        {/* Account Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout activeTab="dashboard">
              <Dashboard />
            </Layout>
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
