import React from 'react';
import { CheckCircle2, Quote } from 'lucide-react';
import { Rating } from './Rating';

/**
 * Editorial Customer Testimonial Card
 */
export const TestimonialCard = ({
  name,
  role,
  avatar,
  rating = 5,
  title,
  quote,
  className = '',
}) => {
  return (
    <div
      className={`
        relative flex flex-col justify-between p-6 sm:p-8
        bg-white dark:bg-dark-card
        border border-neutral-200/80 dark:border-dark-border
        rounded-3xl shadow-subtle hover:shadow-elevated
        transition-all duration-300 h-full min-h-[320px] select-none
        ${className}
      `}
    >
      <div className="flex flex-col gap-4">
        {/* Top Header: Rating & Quote Icon */}
        <div className="flex items-center justify-between">
          <Rating rating={rating} showScore={false} size="sm" />
          <Quote className="w-6 h-6 text-neutral-300 dark:text-neutral-700 shrink-0" />
        </div>

        {/* Title (Equal 2-line height) */}
        {title && (
          <h4 className="font-display font-bold text-base sm:text-lg text-neutral-900 dark:text-dark-text leading-snug line-clamp-2 min-h-[3rem]">
            &ldquo;{title}&rdquo;
          </h4>
        )}

        {/* Quote body (Equal 4-line height) */}
        <p className="font-sans text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed italic line-clamp-4 min-h-[5.5rem]">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {/* Footer: User Details without any bottom badges */}
      <div className="flex items-center gap-3.5 pt-5 mt-4 border-t border-neutral-100 dark:border-dark-border/60">
        <img
          src={avatar}
          alt={name}
          className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-200/70 dark:ring-neutral-700 shrink-0"
        />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-semibold text-sm text-neutral-900 dark:text-white truncate">
              {name}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
};
