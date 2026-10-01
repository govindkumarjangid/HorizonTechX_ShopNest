import { Loader2 } from 'lucide-react';

export const Loader = ({ label = 'Loading...', size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 text-neutral-500 dark:text-neutral-400 ${className}`}>
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-brand-500`} />
      {label && <span className="text-xs font-semibold tracking-wider uppercase">{label}</span>}
    </div>
  );
};

export default Loader;
