import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from '../../providers/SmoothScrollProvider';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useSmoothScroll();

  useEffect(() => {
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;
