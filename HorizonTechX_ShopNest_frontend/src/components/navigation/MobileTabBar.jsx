import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';

export const MobileTabBar = ({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');

    if (path === '/') return 'home';
    if (path.startsWith('/shop') || path.startsWith('/product')) return 'plp';
    if (path.startsWith('/cart')) return 'cart';
    if (path.startsWith('/dashboard') && tabParam === 'wishlist') return 'wishlist';
    if (path.startsWith('/dashboard') || path.startsWith('/orders') || path.startsWith('/account')) return 'dashboard';
    return 'home';
  };

  const activeTab = getActiveTab();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'plp', label: 'Catalog', icon: Compass, path: '/shop' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistCount, path: '/dashboard?tab=wishlist' },
    { id: 'cart', label: 'Bag', icon: ShoppingBag, count: cartCount, path: '/cart' },
    { id: 'dashboard', label: 'Account', icon: User, path: '/dashboard' },
  ];

  const handleTabClick = (tab) => {
    if (tab.id === 'cart' && onOpenCart) {
      onOpenCart();
    } else {
      navigate(tab.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-40 lg:hidden select-none m-0 p-0 pointer-events-none">
      {/* Frosted Glass Container with Safe Area Inset Support */}
      <nav
        aria-label="Mobile Navigation"
        className="
          pointer-events-auto relative w-full
          bg-white/98 dark:bg-[#12141A] backdrop-blur-2xl
          border-t border-neutral-200/80 dark:border-dark-border
          shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.5)]
          px-1.5 pt-1 pb-[max(env(safe-area-inset-bottom,0px),0.35rem)]
        "
      >
        {/* Extended solid bottom filler to ensure zero gap on any device notch, chin, or bounce */}
        <div className="absolute top-full left-0 right-0 h-32 bg-white dark:bg-[#12141A] pointer-events-none" />
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => handleTabClick(tab)}
                className="
                  relative flex flex-col items-center justify-center
                  min-w-12 min-h-10.5 py-0.5 px-1.5 rounded-xl
                  transition-colors cursor-pointer group
                "
              >
                {/* Active Sliding Motion Indicator Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeMobileTab"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute inset-0 bg-brand-50/80 dark:bg-brand-950/40 rounded-xl -z-10"
                  />
                )}

                {/* Tab Icon with Dynamic Badge */}
                <div className="relative">
                  <Icon
                    className={`
                      w-4 h-4 transition-colors
                      ${
                        isActive
                          ? 'text-brand-500'
                          : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
                      }
                    `}
                  />

                  {/* Badge Counter */}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`
                        absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full
                        text-[8px] font-bold font-mono flex items-center justify-center leading-none
                        ${
                          tab.id === 'cart'
                            ? 'bg-brand-500 text-white'
                            : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        }
                      `}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>

                {/* Tab Text Label */}
                <span
                  className={`
                    text-[9px] font-medium tracking-tight mt-0.5 transition-colors
                    ${
                      isActive
                        ? 'text-brand-600 dark:text-brand-400 font-semibold'
                        : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
                    }
                  `}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileTabBar;
