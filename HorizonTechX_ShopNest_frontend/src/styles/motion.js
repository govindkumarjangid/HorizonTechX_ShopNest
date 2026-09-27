
export const transitions = {
  snappy: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  smooth: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  gentle: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
  spring: { type: 'spring', stiffness: 400, damping: 25 },
};

// Fade In Up Entrance
export const fadeInUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.snappy
  },
};

// Subtle Fade
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.smooth
  },
  exit: {
    opacity: 0,
    transition: transitions.snappy
  },
};

// Staggered Container for Lists / Grids
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

// Item inside Staggered Container
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

// Button & Interactive Tap/Hover
export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.1 },
};

export const hoverScale = {
  scale: 1.025,
  transition: transitions.snappy,
};

// Card Hover Lift
export const cardHover = {
  rest: {
    y: 0,
    boxShadow: '0 2px 8px -2px rgba(16, 24, 40, 0.05)',
    transition: transitions.smooth,
  },
  hover: {
    y: -4,
    boxShadow: '0 16px 32px -4px rgba(16, 24, 40, 0.12)',
    transition: transitions.smooth,
  },
};

// Page Transition
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: transitions.smooth },
  exit: { opacity: 0, y: -8, transition: transitions.snappy },
};

// Mobile Drawer Slide
export const drawerSlide = {
  hidden: { x: '100%', opacity: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    x: '100%',
    opacity: 0.5,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
  },
};

// Backdrop Fade
export const backdropFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
