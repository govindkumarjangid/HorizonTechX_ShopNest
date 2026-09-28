import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { AutocompleteSearch } from '../navigation/AutocompleteSearch';
import { drawerSlide, backdropFade, buttonTap } from '../../styles/motion';
import { AccountPopup } from '../auth/AccountPopup';
import { useAuthStore } from '../../store/useAuthStore';
import { useProductStore } from '../../store/useProductStore';
import { Logo } from './Logo';

/**
 * Premium Sticky Navbar with Centered Search, Collapsible Header on Scroll & Sticky Category Sub-Bar
 */
export const Navbar = ({
  cartCount = 0,
  wishlistCount = 0,
  navLinks = [],
  onSearch,
  onCartClick,
  onWishlistClick,
  onOpenAuthModal,
  onNavigateToDashboard,
  onLogoClick,
  onNavLinkClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const categoryBarRef = useRef(null);
  const lastScrollY = useRef(0);
  const isSearchActiveRef = useRef(false);
  const isAccountOpenRef = useRef(false);

  useEffect(() => {
    isSearchActiveRef.current = isSearchActive;
  }, [isSearchActive]);

  useEffect(() => {
    isAccountOpenRef.current = isAccountOpen;
  }, [isAccountOpen]);

  const { isAuthenticated, user, logout, wishlist } = useAuthStore();
  const { categories, fetchCategories } = useProductStore();
  const effectiveWishlistCount = wishlistCount || wishlist?.length || 0;

  useEffect(() => {
    if (!categories || categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);

  const handleLogoClick = () => {
    if (onLogoClick) onLogoClick();
    else navigate('/');
  };

  const handleNavLinkClick = (link) => {
    if (onNavLinkClick) onNavLinkClick(link);
    else if (link.href && link.href !== '#') navigate(link.href);
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

  // Scroll detection: hides main header on scroll down, reveals on scroll up or top, keeps category bar sticky
  useEffect(() => {
    const handleScroll = () => {
      // Do not hide header if user is actively searching or account popup is open
      if (isSearchActiveRef.current || isAccountOpenRef.current) return;

      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 15);

      if (currentScrollY > 70) {
        if (currentScrollY > lastScrollY.current + 8) {
          // Scrolling DOWN: hide top header, keep category sub-bar sticky
          setIsHeaderHidden(true);
        } else if (currentScrollY < lastScrollY.current - 8) {
          // Scrolling UP: reveal top header
          setIsHeaderHidden(false);
        }
      } else {
        // At or near top: always show top header
        setIsHeaderHidden(false);
      }

      lastScrollY.current = currentScrollY;
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

  // Allow horizontal scroll on category bar with mouse wheel
  const handleCategoryWheel = (e) => {
    if (e.deltaY !== 0 && categoryBarRef.current) {
      e.preventDefault();
      categoryBarRef.current.scrollLeft += e.deltaY;
    }
  };

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  // Category links from props or product store
  const allCategoryLinks = navLinks && navLinks.length > 0
    ? navLinks
    : [
        { label: 'All Products', href: '/shop', slug: 'all' },
        ...(categories || []).map((c) => ({
          label: c.name,
          href: `/shop?category=${encodeURIComponent(c.slug)}`,
          slug: c.slug,
        })),
      ];

  const searchParams = new URLSearchParams(location.search);
  const activeCategoryParam = searchParams.get('category');
  const isShopAllActive = location.pathname === '/shop' && !activeCategoryParam;

  return (
    <>
      <header
        className={`
          sticky top-0 z-50 w-full transition-all duration-300
          ${isScrolled
            ? 'bg-white/85 dark:bg-dark-bg/85 backdrop-blur-xl shadow-xs'
            : 'bg-white/95 dark:bg-dark-bg/95'
          }
        `}
      >
        {/* =========================================================
            1. MAIN HEADER: LOGO | CENTERED SEARCH | ACTIONS
            Hides on scroll down, reveals on scroll up
           ========================================================= */}
        <div
          className={`relative z-30 transition-all duration-300 ease-in-out ${
            isHeaderHidden
              ? '-translate-y-full max-h-0 opacity-0 pointer-events-none overflow-hidden'
              : 'translate-y-0 opacity-100 overflow-visible'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-[70px] gap-3 sm:gap-6">

              {/* Left: Mobile Menu Toggle & Brand Logo */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
                  className="flex items-center group cursor-pointer text-left bg-transparent border-none p-0 focus:outline-none"
                  aria-label="ShopNest Home"
                >
                  <Logo className="h-8 sm:h-9 w-auto" />
                </button>
              </div>

              {/* Center: Autocomplete Search Box (Centrally Placed) */}
              <div className="hidden sm:flex flex-1 max-w-xl mx-2 md:mx-6 lg:mx-8 items-center justify-center min-w-0">
                <div className="w-full">
                  <AutocompleteSearch
                    placeholder="Search products, laptops, accessories..."
                    onActiveChange={setIsSearchActive}
                  />
                </div>
              </div>

              {/* Right: Actions (Theme, Wishlist, Cart, Account Dropdown) */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
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

                  {/* Account Popup */}
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

            {/* Mobile Search Row (Only on screens < sm) */}
            <div className="sm:hidden pb-3">
              <AutocompleteSearch
                placeholder="Search products, laptops, accessories..."
                onActiveChange={setIsSearchActive}
              />
            </div>
          </div>
        </div>

        {/* =========================================================
            2. SECONDARY SUB-NAVBAR: CATEGORY PRODUCTS MENU BAR
            Sticky at top when main header hides on scroll
           ========================================================= */}
        <div className="relative z-10 w-full border-t border-b border-neutral-200/70 dark:border-dark-border/70 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <nav
              ref={categoryBarRef}
              onWheel={handleCategoryWheel}
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2 scroll-smooth"
              aria-label="Product Categories Navigation"
            >
              {allCategoryLinks.map((cat, idx) => {
                const isSelected =
                  (cat.slug === 'all' && isShopAllActive) ||
                  (activeCategoryParam && activeCategoryParam.toLowerCase() === cat.slug?.toLowerCase());

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleNavLinkClick(cat)}
                    className={`
                      px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0
                      ${isSelected
                        ? 'bg-brand-500 text-white shadow-subtle font-bold'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-dark-surface'
                      }
                    `}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </nav>
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
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogoClick();
                  }}
                  className="flex items-center bg-transparent border-none p-0 cursor-pointer"
                  aria-label="ShopNest Home"
                >
                  <Logo className="h-7 w-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1 py-6 flex-1 overflow-y-auto no-scrollbar">
                {allCategoryLinks.map((link, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleNavLinkClick(link);
                    }}
                    className="
                      w-full flex items-center justify-between py-2.5 px-3 rounded-xl
                      text-sm font-medium text-neutral-800 dark:text-neutral-200
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

export default Navbar;
