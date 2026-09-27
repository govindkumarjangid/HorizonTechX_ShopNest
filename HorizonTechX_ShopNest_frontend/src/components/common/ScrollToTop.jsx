import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from '../../providers/SmoothScrollProvider';

/**
 * Automatically scrolls to top on route changes
 * Compatible with Lenis smooth scroll and native fallback
 */
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
