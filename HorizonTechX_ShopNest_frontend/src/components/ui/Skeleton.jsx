
export const Skeleton = ({
  className = '',
  variant = 'rectangular',
  ...props
}) => {
  const variantStyles = {
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    rounded: 'rounded-2xl',
  };

  return (
    <div
      className={`
        relative overflow-hidden bg-neutral-200/70 dark:bg-dark-card
        before:absolute before:inset-0 before:-translate-x-full
        before:animate-[shimmer_1.8s_infinite]
        before:bg-linear-to-r before:from-transparent before:via-white/30 dark:before:via-white/5 before:to-transparent
        ${variantStyles[variant] || variantStyles.rectangular}
        ${className}
      `}
      {...props}
    />
  );
};


export const ProductCardSkeleton = ({ className = '' }) => {
  return (
    <div className={`p-4 rounded-2xl bg-white dark:bg-dark-card border border-neutral-200/70 dark:border-dark-border flex flex-col gap-3.5 shadow-subtle ${className}`}>
      {/* Image placeholder */}
      <Skeleton className="w-full aspect-square rounded-xl" />

      {/* Category / Badge */}
      <Skeleton className="w-16 h-4 rounded-md" />

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="w-full h-4 rounded-md" />
        <Skeleton className="w-3/4 h-4 rounded-md" />
      </div>

      {/* Rating & Price */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="w-20 h-5 rounded-md" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
};

/**
 * Typography lines skeleton
 */
export const TextSkeleton = ({ lines = 3, className = '' }) => {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 rounded-md ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
};
