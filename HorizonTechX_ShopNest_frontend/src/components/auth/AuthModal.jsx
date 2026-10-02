import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { backdropFade } from '../../styles/motion';
import { useAuthStore } from '../../store/useAuthStore';
import { notify } from '../../utils/notify';

export const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');

  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuthStore();

  const redirectUrl = searchParams.get('redirect');

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen && isAuthenticated && redirectUrl) {
      navigate(redirectUrl, { replace: true });
      if (onClose) onClose();
    }
  }, [isOpen, isAuthenticated, redirectUrl, navigate, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tab === 'register' && !name.trim()) {
      notify.error('Please enter your full name');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      notify.error('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      notify.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      if (tab === 'register') {
        await register({ name, email, password });
        notify.success('Account created successfully! Welcome to ShopNest.');
      } else {
        await login({ email, password });
        notify.success('Signed in successfully! Welcome back.');
      }

      if (redirectUrl) {
        navigate(redirectUrl, { replace: true });
      }
      if (onClose) onClose();
    } catch (err) {
      notify.error(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="
              relative w-full h-full sm:h-auto sm:max-h-[92dvh] sm:max-w-md
              bg-white dark:bg-dark-card border-0 sm:border border-neutral-200/80 dark:border-dark-border
              rounded-none sm:rounded-3xl p-5 sm:p-7 shadow-2xl z-10
              overflow-y-auto no-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden
              flex flex-col justify-center sm:justify-start
              pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pb-7
            "
          >
            {/* Top Right Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="
                absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl
                text-neutral-400 hover:text-neutral-900 dark:hover:text-white
                hover:bg-neutral-100 dark:hover:bg-dark-surface
                transition-colors cursor-pointer z-30 flex items-center justify-center
              "
              aria-label="Close auth modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header  */}
            <div className="flex flex-col gap-1 mb-4 sm:mb-5 pr-8">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-neutral-900 dark:text-white tracking-tight">
                {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {tab === 'login'
                  ? 'Access your orders, saved addresses and private collection wishlist.'
                  : 'Join 28,000+ creators and collectors with personalized privileges.'}
              </p>
            </div>

            {/* Tab Switcher with Brand Color Sliding Pill */}
            <div className="relative flex rounded-xl bg-neutral-100 dark:bg-dark-surface p-1 mb-4 border border-neutral-200/60 dark:border-dark-border">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`
                  relative z-10 flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center
                  ${tab === 'login' ? 'text-white' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}
                `}
              >
                {tab === 'login' && (
                  <motion.div
                    layoutId="activeAuthTab"
                    className="absolute inset-0 bg-brand-500 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => setTab('register')}
                className={`
                  relative z-10 flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center
                  ${tab === 'register' ? 'text-white' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}
                `}
              >
                {tab === 'register' && (
                  <motion.div
                    layoutId="activeAuthTab"
                    className="absolute inset-0 bg-brand-500 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Create Account</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
              {tab === 'register' && (
                <>
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftIcon={User}
                  />
                  <Input
                    label="Delivery City / Pincode"
                    placeholder="New Delhi • 110001"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    leftIcon={MapPin}
                  />
                </>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={Mail}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={Lock}
              />

              {tab === 'login' && (
                <div className="flex items-center justify-between text-xs text-neutral-500 pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" defaultChecked className="rounded text-brand-500 accent-brand-500" />
                    <span>Remember this device</span>
                  </label>
                  <a href="#" className="text-brand-500 hover:underline">Forgot password?</a>
                </div>
              )}

              <Button
                type="submit"
                size="md"
                isLoading={loading}
                loadingText={tab === 'login' ? 'Signing In...' : 'Registering...'}
                className="w-full mt-1.5 cursor-pointer"
                rightIcon={ArrowRight}
              >
                {tab === 'login' ? 'Sign In to Account' : 'Complete Registration'}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
