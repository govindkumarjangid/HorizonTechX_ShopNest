import { useEffect, useState, useRef } from 'react';

/**
 * High-performance smooth Count-Up number component
 * Triggers when scrolled into view using IntersectionObserver and requestAnimationFrame.
 */
export const StatCounter = ({
  end = 0,
  duration = 1800,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [value, setValue] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime = null;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out cubic curve for natural deceleration
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = easeOutCubic * end;

            setValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setValue(end);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    const currentEl = elementRef.current;
    if (currentEl) observer.observe(currentEl);

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, [end, duration]);

  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toString();

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default StatCounter;
