import React, { useState } from 'react';
import { Search, X, Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'text',
  isClearable = false,
  onClear,
  value,
  className = '',
  wrapperClassName = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const isPassword = type === 'password';
  const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3.5 text-neutral-400 dark:text-neutral-500 pointer-events-none flex items-center justify-center">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={computedType}
          value={value}
          className={`
            w-full bg-white dark:bg-dark-surface
            border text-neutral-900 dark:text-dark-text
            text-sm rounded-xl px-4 py-2.5 transition-all duration-200 outline-none
            placeholder:text-neutral-400 dark:placeholder:text-neutral-500
            ${LeftIcon ? 'pl-10' : 'pl-4'}
            ${(RightIcon || isClearable || isPassword) ? 'pr-11' : 'pr-4'}
            ${error
              ? 'border-semantic-error focus:ring-2 focus:ring-semantic-error/20 focus:border-semantic-error'
              : 'border-neutral-200 dark:border-dark-border focus:border-brand-500 dark:focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
            }
            ${className}
          `}
          {...props}
        />

        <div className="absolute right-3 flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500">
          {isClearable && value && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {RightIcon && !isPassword && <RightIcon className="w-4 h-4" />}
        </div>
      </div>

      {error ? (
        <span className="text-xs text-semantic-error font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';


export const SearchBar = React.forwardRef(({
  placeholder = 'Search premium products, brands, or collections...',
  value,
  onChange,
  onClear,
  onSearch,
  className = '',
  ...props
}, ref) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative flex items-center w-full max-w-xl group ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 group-focus-within:text-brand-500 transition-colors pointer-events-none" />

      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="
          w-full bg-neutral-100 dark:bg-dark-card
          border border-transparent dark:border-dark-border
          focus:border-brand-500/50 focus:bg-white dark:focus:bg-dark-surface
          text-neutral-900 dark:text-dark-text
          text-sm rounded-2xl pl-10 pr-20 py-2.5 outline-none
          placeholder:text-neutral-400 dark:placeholder:text-neutral-500
          transition-all duration-200 shadow-sm focus:shadow-subtle focus:ring-2 focus:ring-brand-500/10
        "
        {...props}
      />

      <div className="absolute right-3 flex items-center gap-1.5">
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-500 bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border rounded-md shadow-xs pointer-events-none">
          ⌘K
        </kbd>
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
