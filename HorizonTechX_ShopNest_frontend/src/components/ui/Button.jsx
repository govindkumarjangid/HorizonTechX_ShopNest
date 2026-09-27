import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { buttonTap } from '../../styles/motion';


export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const disabled = isDisabled || isLoading;

  const baseStyles = 'relative inline-flex items-center justify-center font-sans font-medium select-none transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg cursor-pointer disabled:cursor-not-allowed disabled:opacity-55';

  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-subtle hover:shadow-elevated rounded-xl',
    secondary: 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 shadow-subtle rounded-xl',
    outline: 'border border-neutral-300 dark:border-dark-border text-neutral-800 dark:text-dark-text hover:bg-neutral-100 dark:hover:bg-dark-card rounded-xl',
    ghost: 'text-neutral-700 dark:text-dark-text hover:bg-neutral-100 dark:hover:bg-dark-card hover:text-brand-500 dark:hover:text-brand-400 rounded-xl',
    danger: 'bg-semantic-error hover:bg-red-600 text-white shadow-subtle rounded-xl',
    icon: 'p-2.5 text-neutral-700 dark:text-dark-text hover:bg-neutral-100 dark:hover:bg-dark-card hover:text-brand-500 rounded-full',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 tracking-wide',
    md: 'text-sm px-5 py-2.5 gap-2 tracking-normal',
    lg: 'text-base px-6 py-3.5 gap-2.5 tracking-normal',
    icon: 'w-10 h-10 p-0',
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileTap={!disabled ? buttonTap : undefined}
      whileHover={!disabled ? { scale: 1.015 } : undefined}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${variant !== 'icon' ? (sizes[size] || sizes.md) : sizes.icon}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" />}
          {children}
          {RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
