import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../ui/Navbar';
import { Footer } from '../ui/Footer';
import { MobileTabBar } from '../navigation/MobileTabBar';
import { CartDrawer } from '../cart/CartDrawer';
import { AuthModal } from '../auth/AuthModal';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { navLinks } from '../../assets/assets';

/**
 * Master Application Layout
 * Provides persistent header, mobile bottom navigation, and global drawers
 */
export const Layout = ({
  children,
  activeTab = 'home',
  onTabChange,
  wishlistCount,
  onOpenAuthModal,
  onNavigateToDashboard,
  authModalState,
  onCloseAuthModal,
  onCheckout,
  onLogoClick,
  onNavLinkClick,
}) => {
  const navigate = useNavigate();
  const { items, isDrawerOpen, closeDrawer, openDrawer, updateQuantity, removeItem, getCartCount } = useCartStore();
  const { wishlist } = useAuthStore();
  const effectiveWishlistCount = wishlistCount !== undefined ? wishlistCount : (wishlist?.length || 0);

  const [internalAuthModal, setInternalAuthModal] = useState({ isOpen: false, mode: 'login' });
  const currentAuthModal = authModalState || internalAuthModal;

  const handleOpenAuth = (mode = 'login') => {
    if (onOpenAuthModal) onOpenAuthModal(mode);
    else setInternalAuthModal({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    if (onCloseAuthModal) onCloseAuthModal();
    else setInternalAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleCheckout = () => {
    closeDrawer();
    if (onCheckout) onCheckout();
    else navigate('/checkout');
  };

  const handleExploreCatalog = () => {
    closeDrawer();
    if (onTabChange) onTabChange('plp');
    else navigate('/shop');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-dark-bg text-neutral-900 dark:text-dark-text transition-colors duration-200">
      {/* Sticky Header */}
      <Navbar
        cartCount={getCartCount()}
        wishlistCount={effectiveWishlistCount}
        navLinks={navLinks}
        onCartClick={openDrawer}
        onWishlistClick={() => {
          if (onTabChange) onTabChange('wishlist');
          else navigate('/dashboard?tab=wishlist');
        }}
        onOpenAuthModal={handleOpenAuth}
        onNavigateToDashboard={onNavigateToDashboard}
        onSearch={(query) => {
          if (onTabChange) onTabChange('plp');
          else if (query?.trim()) navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
          else navigate('/shop');
        }}
        onLogoClick={onLogoClick}
        onNavLinkClick={onNavLinkClick}
      />

      {/* Main Content Area - pb-20 on mobile so bottom tab bar doesn't overlap */}
      <main className="flex-1 w-full pb-20 lg:pb-0">
        {children}
      </main>

      {/* Persistent Footer */}
      <Footer />

      {/* Native-App Mobile Bottom Tab Bar */}
      <MobileTabBar
        activeTab={activeTab}
        onTabChange={onTabChange}
        cartCount={getCartCount()}
        wishlistCount={effectiveWishlistCount}
        onOpenCart={openDrawer}
      />

      {/* Global Cart Drawer */}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        onExploreCatalog={handleExploreCatalog}
      />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={currentAuthModal.isOpen}
        initialTab={currentAuthModal.mode}
        onClose={handleCloseAuth}
      />
    </div>
  );
};

export default Layout;
