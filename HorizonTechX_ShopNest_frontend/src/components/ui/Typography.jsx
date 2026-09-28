export const H1 = ({ children, className = '', ...props }) => (
  <h1
    className={`font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-dark-text leading-[1.2] ${className}`}
    {...props}
  >
    {children}
  </h1>
);

export const H2 = ({ children, className = '', ...props }) => (
  <h2
    className={`font-display text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-neutral-900 dark:text-dark-text leading-tight ${className}`}
    {...props}
  >
    {children}
  </h2>
);

export const H3 = ({ children, className = '', ...props }) => (
  <h3
    className={`font-display text-base sm:text-lg lg:text-xl font-semibold tracking-tight text-neutral-900 dark:text-dark-text leading-snug ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const H4 = ({ children, className = '', ...props }) => (
  <h4
    className={`font-display text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-dark-text ${className}`}
    {...props}
  >
    {children}
  </h4>
);

export const H5 = ({ children, className = '', ...props }) => (
  <h5
    className={`font-display text-sm sm:text-base font-semibold tracking-tight text-neutral-900 dark:text-dark-text ${className}`}
    {...props}
  >
    {children}
  </h5>
);

export const H6 = ({ children, className = '', ...props }) => (
  <h6
    className={`font-display text-xs sm:text-sm font-semibold tracking-wide uppercase text-neutral-700 dark:text-neutral-300 ${className}`}
    {...props}
  >
    {children}
  </h6>
);

export const Subtitle = ({ children, className = '', ...props }) => (
  <p
    className={`font-sans text-xs sm:text-sm text-neutral-600 dark:text-dark-textMuted leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const Body = ({ children, className = '', size = 'md', ...props }) => {
  const sizeClasses = {
    sm: 'text-sm leading-normal',
    md: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
  };

  return (
    <p
      className={`font-sans text-neutral-700 dark:text-dark-textMuted ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

export const Caption = ({ children, className = '', ...props }) => (
  <span
    className={`font-sans text-xs tracking-wider uppercase font-medium text-neutral-500 dark:text-neutral-400 ${className}`}
    {...props}
  >
    {children}
  </span>
);
