import { createContext, useContext, useEffect, useRef, useMemo } from 'react';
import Lenis from 'lenis';

const SmoothScrollContext = createContext({
  getInstance: () => null,
  scrollTo: () => {},
  start: () => {},
  stop: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export const SmoothScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      smoothTouch: false, 
      infinite: false,
      prevent: (node) => {
        if (!node) return false;
        return Boolean(
          node.hasAttribute?.('data-lenis-prevent') ||
          node.closest?.('[data-lenis-prevent]') ||
          node.closest?.('.overflow-y-auto') ||
          node.closest?.('.overflow-auto') ||
          node.closest?.('.overflow-y-scroll')
        );
      },
    });

    lenisRef.current = lenis;

    // Expose lenis globally for debugging or external hooks if needed
    window.__lenis = lenis;

    // 2. Synchronized requestAnimationFrame loop
    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // 3. Sync scroll events (Lenis scrolls window directly, no recursive dispatch needed)
    const handleLenisScroll = () => {
      // Passive sync without recursive event loop
    };
    lenis.on('scroll', handleLenisScroll);

    // 4. Smooth Anchor Link Interceptor (#links)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#' && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -90, duration: 1.2 });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      lenis.off('scroll', handleLenisScroll);
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      getInstance: () => lenisRef.current,
      scrollTo: (...args) => lenisRef.current?.scrollTo?.(...args),
      start: () => lenisRef.current?.start?.(),
      stop: () => lenisRef.current?.stop?.(),
    }),
    []
  );

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider;
