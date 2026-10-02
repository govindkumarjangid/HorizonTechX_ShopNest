import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  // If session is still initializing from localStorage JWT on initial mount
  if (!isInitialized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?redirect=${returnPath}`} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
