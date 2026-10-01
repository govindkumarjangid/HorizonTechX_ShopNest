import { PackageOpen, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';


export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No records found',
  description = 'There are currently no items matching your criteria.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white dark:bg-dark-card border border-neutral-200/80 dark:border-dark-border shadow-xs ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-dark-surface text-neutral-400 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white mb-1.5">
        {title}
      </h3>
      <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="md" rightIcon={ArrowRight} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
