import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { SearchBar } from './Input';
import { drawerSlide, backdropFade, buttonTap } from '../../styles/motion';
import { AccountPopup } from '../auth/AccountPopup';
import { useAuthStore } from '../../store/useAuthStore';

/**
 * Premium Sticky Navbar with Glassmorphism, Animated Mobile Drawer & Account Popup
 */
export const Navbar = ({
  cartCount = 0,
  wishlistCount = 0,
  navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Featured', href: '/shop' },
    { label: 'New Arrivals', href: '/shop' },
    { label: 'Collections', href: '/shop' },
  ],
  onSearch,
  onCartClick,
  onWishlistClick,
  onOpenAuthModal,
  onNavigateToDashboard,
  onLogoClick,
  onNavLinkClick,
}) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { isAuthenticated, user, logout, wishlist } = useAuthStore();
  const effectiveWishlistCount = wishlistCount || wishlist?.length || 0;

  const handleLogoClick = () => {
    if (onLogoClick) onLogoClick();
    else navigate('/');
  };

  const handleNavLinkClick = (link) => {
    if (onNavLinkClick) onNavLinkClick(link);
    else if (link.href && link.href !== '#') navigate(link.href);
    else navigate('/shop');
  };

  const handleSearch = (query) => {
    if (onSearch) onSearch(query);
    else if (query && query.trim()) navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    else navigate('/shop');
  };

  const handleWishlistClick = () => {
    if (onWishlistClick) onWishlistClick();
    else navigate('/dashboard?tab=wishlist');
  };

  const handleNavigateToDashboard = (tab = 'profile') => {
    if (onNavigateToDashboard) onNavigateToDashboard(tab);
    else navigate(`/dashboard?tab=${tab}`);
  };

  // Handle scroll state for dynamic glass blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme toggle helper
  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'GJ';

  return (
    <>
      <header
        className={`
          sticky top-0 z-40 w-full transition-all duration-300
          ${isScrolled
            ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-neutral-200/70 dark:border-dark-border shadow-xs'
            : 'bg-white/95 dark:bg-dark-bg/95 border-b border-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-4">

            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-neutral-700 dark:text-neutral-200 hover:text-brand-500 rounded-lg cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleLogoClick}
                className="flex items-center gap-2 group cursor-pointer text-left bg-transparent border-none p-0"
              >
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg tracking-tight text-neutral-900 dark:text-white leading-none">
                    <span className="text-brand-500">ShopNest</span>
                  </span>
                  <span className="text-[9px] font-sans tracking-widest text-neutral-400 uppercase">
                    Curated Commerce
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleNavLinkClick(link)}
                  className="text-sm font-sans font-medium text-neutral-600 dark:text-neutral-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Middle: Integrated Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-sm mx-4">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                onSearch={handleSearch}
              />
            </div>

            {/* Right: Actions (Theme, Wishlist, Cart, Account Dropdown) */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Theme Toggle */}
              <motion.button
                type="button"
                whileTap={buttonTap}
                onClick={toggleTheme}
                className="p-2.5 text-neutral-600 dark:text-neutral-300 hover:text-brand-500 dark:hover:text-brand-400 rounded-full hover:bg-neutral-100 dark:hover:bg-dark-card transition-colors cursor-pointer"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-accent-amber" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* Wishlist */}
              <motion.button
                type="button"
                whileTap={buttonTap}
                onClick={handleWishlistClick}
                className="relative p-2.5 text-neutral-600 dark:text-neutral-300 hover:text-brand-500 dark:hover:text-brand-400 rounded-full hover:bg-neutral-100 dark:hover:bg-dark-card transition-colors cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {effectiveWishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-bold flex items-center justify-center">
                    {effectiveWishlistCount}
                  </span>
                )}
              </motion.button>

              {/* Shopping Bag / Cart */}
              <motion.button
                type="button"
                whileTap={buttonTap}
                onClick={onCartClick}
                className="relative p-2.5 text-neutral-600 dark:text-neutral-300 hover:text-brand-500 dark:hover:text-brand-400 rounded-full hover:bg-neutral-100 dark:hover:bg-dark-card transition-colors cursor-pointer"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </motion.button>

              {/* User Profile Button with Anchored Account Popup */}
              <div className="relative">
                <motion.button
                  type="button"
                  whileTap={buttonTap}
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className={`
                    p-1.5 sm:p-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5
                    ${isAccountOpen
                      ? 'bg-brand-50 dark:bg-brand-950/60 ring-2 ring-brand-500/20'
                      : 'hover:bg-neutral-100 dark:hover:bg-dark-card text-neutral-600 dark:text-neutral-300'
                    }
                  `}
                  aria-label="User Account"
                >
                  {isAuthenticated && user?.name ? (
                    <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {userInitials}
                    </div>
                  ) : (
                    <div className="p-1">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </motion.button>

                {/* The Account Dropdown / Popup */}
                <AccountPopup
                  isOpen={isAccountOpen}
                  onClose={() => setIsAccountOpen(false)}
                  onOpenAuthModal={onOpenAuthModal}
                  onNavigateToDashboard={handleNavigateToDashboard}
                  wishlistCount={effectiveWishlistCount}
                />
              </div>

            </div>
          </div>

          {/* Mobile Search Bar Row */}
          <div className="md:hidden pb-3">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </header>

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              variants={backdropFade}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
            />

            {/* Drawer Content */}
            <motion.div
              variants={drawerSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                absolute right-0 top-0 bottom-0 w-full max-w-xs
                bg-white dark:bg-dark-surface
                border-l border-neutral-200 dark:border-dark-border
                flex flex-col shadow-2xl p-6
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100 dark:border-dark-border">
                <span className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1 py-6 flex-1 overflow-y-auto">
                {navLinks.map((link, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleNavLinkClick(link);
                    }}
                    className="
                      w-full flex items-center justify-between py-3 px-3 rounded-xl
                      text-base font-medium text-neutral-800 dark:text-neutral-200
                      hover:bg-neutral-100 dark:hover:bg-dark-card hover:text-brand-500
                      transition-colors cursor-pointer text-left
                    "
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                ))}
              </div>

              {/* Account Quick Action in Drawer */}
              <div className="pt-4 border-t border-neutral-100 dark:border-dark-border flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleNavigateToDashboard('profile');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-neutral-100 dark:bg-dark-card text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-500 text-white font-bold text-xs flex items-center justify-center">
                          {userInitials}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-neutral-900 dark:text-white">{user?.name}</h4>
                          <span className="text-[10px] text-neutral-500">{user?.email}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-semantic-error"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onOpenAuthModal) onOpenAuthModal('login');
                      else navigate('/auth');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 text-white font-medium text-sm shadow-subtle"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In / Create Account</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
