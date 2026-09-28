import React from 'react';

/**
 * Universal Brand Logo component
 * Dynamically switches between light and dark mode SVG logos
 */
export const Logo = ({
  className = 'h-8 sm:h-9 w-auto',
  alt = 'ShopNest',
  ...props
}) => {
  return (
    <span className="inline-flex items-center select-none" {...props}>
      <img
        src="/logo.svg"
        alt={alt}
        className={`${className} object-contain dark:hidden`}
      />
      <img
        src="/logo-dark.svg"
        alt={alt}
        className={`${className} object-contain hidden dark:block`}
      />
    </span>
  );
};

export default Logo;
