import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { backdropFade } from '../../styles/motion';
import { useAuthStore } from '../../store/useAuthStore';
import { notify } from '../../utils/notify';

/**
 * Authentication Modal for Login & Registration
 */
export const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');

  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);

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
      onClose();
    } catch (err) {
      notify.error(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm"
          />

          {/* Modal / Bottom Sheet Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="
              relative w-full max-w-md bg-white dark:bg-dark-card
              border-t sm:border border-neutral-200/80 dark:border-dark-border
              rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden
              max-h-[92vh] overflow-y-auto
            "
          >
            {/* Mobile Drag Handle */}
            <div className="sm:hidden -mt-2 mb-4 flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-dark-border" />
            </div>
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-white tracking-tight">
                {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {tab === 'login'
                  ? 'Access your orders, saved addresses and private collection wishlist.'
                  : 'Join 28,000+ creators and collectors with personalized privileges.'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex rounded-xl bg-neutral-100 dark:bg-dark-surface p-1 mb-6 border border-neutral-200/60 dark:border-dark-border">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`
                  flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer
                  ${tab === 'login'
                    ? 'bg-white dark:bg-dark-card text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }
                `}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`
                  flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer
                  ${tab === 'register'
                    ? 'bg-white dark:bg-dark-card text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }
                `}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                    <span>Remember this device</span>
                  </label>
                  <a href="#" className="text-brand-500 hover:underline">Forgot password?</a>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                isLoading={loading}
                loadingText={tab === 'login' ? 'Signing In...' : 'Registering...'}
                className="w-full mt-2 cursor-pointer"
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
