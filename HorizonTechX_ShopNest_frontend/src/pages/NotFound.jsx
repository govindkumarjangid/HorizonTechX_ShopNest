import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import { H1, Subtitle, Button } from '../components/ui';

/**
 * 404 Not Found Page
 */
export const NotFound = ({ onNavigateHome, onExploreCatalog }) => {
  const navigate = useNavigate();
  const handleHome = () => {
    if (onNavigateHome) onNavigateHome();
    else navigate('/');
  };
  const handleCatalog = () => {
    if (onExploreCatalog) onExploreCatalog();
    else navigate('/shop');
  };
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <div className="relative mb-6">
          <span className="font-mono text-7xl sm:text-9xl font-extrabold text-neutral-200 dark:text-dark-surface tracking-tighter select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shadow-subtle">
              <Compass className="w-8 h-8 animate-pulse" />
            </div>
          </div>
        </div>

        <H1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
          Page Not Found
        </H1>
        <Subtitle className="text-xs sm:text-sm max-w-sm mt-2 text-neutral-500 dark:text-neutral-400">
          The page or product collection you requested does not exist or has been moved.
        </Subtitle>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            leftIcon={Home}
            onClick={handleHome}
            className="w-full sm:w-auto shadow-subtle"
          >
            Return to Store
          </Button>
          <Button
            variant="outline"
            size="md"
            leftIcon={Search}
            onClick={handleCatalog}
            className="w-full sm:w-auto"
          >
            Explore Catalog
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
