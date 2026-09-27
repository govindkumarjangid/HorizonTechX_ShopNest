export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) => {
  const variants = {
    sale: 'bg-semantic-sale text-white font-bold shadow-xs',
    new: 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold tracking-wider',
    outOfStock: 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40',
    error: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40',
    brand: 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/40 font-semibold',
    neutral: 'bg-neutral-100 dark:bg-dark-card text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-dark-border',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full select-none
        ${variants[variant] || variants.neutral}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
};
