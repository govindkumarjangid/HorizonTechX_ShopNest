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
  productPurchased,
  className = '',
}) => {
  return (
    <div
      className={`
        relative flex flex-col justify-between p-6 sm:p-8
        bg-white dark:bg-dark-card
        border border-neutral-200/80 dark:border-dark-border
        rounded-3xl shadow-subtle hover:shadow-elevated
        transition-all duration-300
        ${className}
      `}
    >
      <div className="flex flex-col gap-4">
        {/* Top Header: Rating & Quote Icon */}
        <div className="flex items-center justify-between">
          <Rating rating={rating} showScore={false} size="sm" />
          <Quote className="w-6 h-6 text-neutral-200 dark:text-neutral-800" />
        </div>

        {/* Title */}
        {title && (
          <h4 className="font-display font-semibold text-lg text-neutral-900 dark:text-dark-text leading-snug">
            "{title}"
          </h4>
        )}

        {/* Quote body */}
        <p className="font-sans text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed italic">
          "{quote}"
        </p>
      </div>

      {/* Footer: User Details & Purchased Product */}
      <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-neutral-100 dark:border-dark-border/60">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={name}
            className="w-11 h-11 rounded-full object-cover border border-neutral-200 dark:border-dark-border"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-semibold text-sm text-neutral-900 dark:text-white">
                {name}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {role}
            </span>
          </div>
        </div>

        {productPurchased && (
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-dark-surface px-3 py-1 rounded-lg border border-neutral-100 dark:border-dark-border/40">
            Verified Acquisition: <span className="font-medium text-neutral-700 dark:text-neutral-300">{productPurchased}</span>
          </div>
        )}
      </div>
    </div>
  );
};
