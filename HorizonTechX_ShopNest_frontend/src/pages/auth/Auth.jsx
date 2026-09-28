import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import { H1, Subtitle, Button, Input } from '../../components/ui';
import { Logo } from '../../components/ui/Logo';
import { useAuthStore } from '../../store/useAuthStore';
import { notify } from '../../utils/notify';

/**
 * Dedicated Full-Page Authentication View
 */
export const Auth = ({
  initialMode = 'login',
  onSuccess,
  onNavigateHome,
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuthStore();

  const handleReturnHome = () => {
    if (onNavigateHome) onNavigateHome();
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register' && !name.trim()) {
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
      if (mode === 'register') {
        await register({ name, email, password });
        notify.success('Account created successfully! Welcome to ShopNest.');
      } else {
        await login({ email, password });
        notify.success('Signed in successfully! Welcome back.');
      }
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      notify.error(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-dvh bg-neutral-50 dark:bg-dark-bg flex flex-col justify-center py-10 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden pb-20 lg:pb-12">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Back Home Bar */}
      <div className="max-w-md mx-auto w-full px-4 mb-6">
        <button
          type="button"
          onClick={handleReturnHome}
          className="text-xs font-semibold text-neutral-500 hover:text-brand-500 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Store</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Card */}
        <div className="bg-white dark:bg-dark-card py-8 px-6 sm:px-10 rounded-3xl border border-neutral-200/80 dark:border-dark-border shadow-elevated relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <Logo className="h-10 w-auto" />
            </div>
            <H1 className="text-xl sm:text-2xl font-bold mt-2">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </H1>
            <Subtitle className="text-xs sm:text-sm mt-1">
              {mode === 'login'
                ? 'Sign in to access your orders, saved addresses and telemetry'
                : 'Join our hardware archive for bespoke acoustics and gear'}
            </Subtitle>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {mode === 'register' && (
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={User}
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={Mail}
            />

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-base sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              loadingText={mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              className="w-full mt-4 cursor-pointer"
              rightIcon={ArrowRight}
            >
              {mode === 'login' ? 'Sign In to Account' : 'Create My Account'}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center text-xs text-neutral-500">
            {mode === 'login' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-brand-500 hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-brand-500 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
