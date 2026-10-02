import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthModal } from '../../components/auth/AuthModal';
import { useAuthStore } from '../../store/useAuthStore';

export const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  return (
    <AuthModal
      isOpen={true}
      initialTab={mode}
      onClose={() => navigate('/')}
    />
  );
};

export default Auth;
