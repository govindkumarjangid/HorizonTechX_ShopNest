import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const Rating = ({
  rating = 0,
  maxStars = 5,
  reviewsCount,
  showScore = true,
  showValue,
  isInteractive = false,
  onChange,
  size = 'md',
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-medium',
  };

  const effectiveShowScore = showValue !== undefined ? showValue : showScore;

  const currentVal = hoverRating || rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starNumber = index + 1;
          const isFilled = currentVal >= starNumber;
          const isHalf = !isFilled && currentVal >= starNumber - 0.5;

          return (
            <button
              key={index}
              type="button"
              disabled={!isInteractive}
              onClick={() => isInteractive && onChange && onChange(starNumber)}
              onMouseEnter={() => isInteractive && setHoverRating(starNumber)}
              onMouseLeave={() => isInteractive && setHoverRating(0)}
              className={`
                relative p-0.5 transition-transform
                ${isInteractive ? 'cursor-pointer hover:scale-115' : 'cursor-default'}
              `}
            >
              {isHalf ? (
                <div className="relative">
                  <Star className={`${starSizes[size]} text-neutral-300 dark:text-neutral-700`} />
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className={`${starSizes[size]} text-accent-amber fill-accent-amber`} />
                  </div>
                </div>
              ) : (
                <Star
                  className={`
                    ${starSizes[size]}
                    ${isFilled
                      ? 'text-accent-amber fill-accent-amber'
                      : 'text-neutral-300 dark:text-neutral-700 fill-transparent'
                    }
                    transition-colors duration-150
                  `}
                />
              )}
            </button>
          );
        })}
      </div>

      {effectiveShowScore && rating > 0 && (
        <span className={`font-semibold text-neutral-900 dark:text-dark-text ${textSizes[size]}`}>
          {Number(rating).toFixed(1)}
        </span>
      )}

      {reviewsCount !== undefined && (
        <span className={`text-neutral-400 dark:text-neutral-500 ${textSizes[size]}`}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
