import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { useAuthStore } from '../../store/useAuthStore';
import { notify } from '../../utils/notify';

/**
 * Animated Account Dropdown / Popup
 * Switches dynamically between Logged In and Guest/Logged Out states
 */
export const AccountPopup = ({
  isOpen,
  onClose,
  onOpenAuthModal,
  onNavigateToDashboard,
  wishlistCount = 3,
}) => {
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const { isAuthenticated, user, orders, savedAddresses, logout } = useAuthStore();

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  const handleNavigate = (tab) => {
    onClose();
    if (tab === 'orders') {
      navigate('/orders');
    } else {
      navigate(`/dashboard?tab=${tab}`);
    }
    if (onNavigateToDashboard) {
      onNavigateToDashboard(tab);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    notify.info('You have signed out successfully.');
    navigate('/');
  };



  const handleTrackOrderGuest = () => {
    onClose();
    notify.info('Directing to live order tracking...');
    navigate('/orders');
  };

  const handleConciergeHelp = () => {
    onClose();
    notify.success('ShopNest concierge is active 24/7. An advisor is on standby.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="
            absolute right-0 top-full mt-3 w-80 sm:w-88
            bg-white dark:bg-dark-card
            border border-neutral-200/90 dark:border-dark-border
            rounded-3xl shadow-floating z-50 overflow-hidden
          "
        >
          {/* ====================================================
              STATE 1: USER IS LOGGED IN
             ==================================================== */}
          {isAuthenticated ? (
            <div className="flex flex-col">
              {/* Profile Card Header */}
              <div className="p-5 bg-neutral-50/80 dark:bg-dark-surface/80 border-b border-neutral-100 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-bold text-base flex items-center justify-center shadow-xs">
                    {user?.name
                      ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                      : 'U'}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white truncate">
                        {user?.name || 'User'}
                      </h4>
                      <Badge variant="brand" size="sm">
                        {user?.role || 'User'}
                      </Badge>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {user?.email || ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Options matching Dashboard items */}
              <div className="p-2 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleNavigate('profile')}
                  className="
                    w-full flex items-center justify-between p-2.5 rounded-xl
                    text-xs font-semibold text-neutral-700 dark:text-neutral-200
                    hover:bg-neutral-100 dark:hover:bg-dark-surface hover:text-brand-500
                    transition-colors cursor-pointer
                  "
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-neutral-400" />
                    <span>Profile & Settings</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('orders')}
                  className="
                    w-full flex items-center justify-between p-2.5 rounded-xl
                    text-xs font-semibold text-neutral-700 dark:text-neutral-200
                    hover:bg-neutral-100 dark:hover:bg-dark-surface hover:text-brand-500
                    transition-colors cursor-pointer
                  "
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-neutral-400" />
                    <span>Order History & Tracking</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 text-[10px] font-bold">
                    {orders?.length || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('wishlist')}
                  className="
                    w-full flex items-center justify-between p-2.5 rounded-xl
                    text-xs font-semibold text-neutral-700 dark:text-neutral-200
                    hover:bg-neutral-100 dark:hover:bg-dark-surface hover:text-brand-500
                    transition-colors cursor-pointer
                  "
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-neutral-400" />
                    <span>My Wishlist</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-300 text-[10px] font-bold">
                    {wishlistCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('addresses')}
                  className="
                    w-full flex items-center justify-between p-2.5 rounded-xl
                    text-xs font-semibold text-neutral-700 dark:text-neutral-200
                    hover:bg-neutral-100 dark:hover:bg-dark-surface hover:text-brand-500
                    transition-colors cursor-pointer
                  "
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <span>Saved Addresses</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-300 text-[10px] font-bold">
                    {savedAddresses?.length || 0}
                  </span>
                </button>
              </div>

              {/* Log Out Action */}
              <div className="p-2 border-t border-neutral-100 dark:border-dark-border">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    w-full flex items-center gap-2.5 p-2.5 rounded-xl
                    text-xs font-semibold text-semantic-error
                    hover:bg-rose-50 dark:hover:bg-rose-950/40
                    transition-colors cursor-pointer
                  "
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* ====================================================
                STATE 2: USER IS GUEST / NOT LOGGED IN
               ==================================================== */
            <div className="flex flex-col p-6 gap-5">
              <div className="flex flex-col gap-2">
                <div className="mb-1">
                  <Logo className="h-6 w-auto" />
                </div>
                <h4 className="font-display font-bold text-base text-neutral-900 dark:text-white leading-tight">
                  Welcome to ShopNest
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Sign in to access your orders, track shipments, and view your private collection.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <Button
                  size="md"
                  onClick={() => {
                    onClose();
                    if (onOpenAuthModal) onOpenAuthModal('login');
                  }}
                  className="w-full shadow-subtle"
                >
                  Sign In
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    onClose();
                    if (onOpenAuthModal) onOpenAuthModal('register');
                  }}
                  className="w-full"
                >
                  Create Account
                </Button>
              </div>

              {/* Quick Helper Links for Guests */}
              <div className="pt-3 border-t border-neutral-100 dark:border-dark-border flex flex-col gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleTrackOrderGuest}
                  className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 hover:text-brand-500 transition-colors cursor-pointer text-left w-full"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-neutral-400" /> Track an Order
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                <button
                  type="button"
                  onClick={handleConciergeHelp}
                  className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 hover:text-brand-500 transition-colors cursor-pointer text-left w-full"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> Help & Concierge
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
