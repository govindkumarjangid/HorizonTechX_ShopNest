import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { Badge } from './Badge';
import { Rating } from './Rating';
import { Skeleton } from './Skeleton';
import { cardHover, buttonTap } from '../../styles/motion';
import { formatPrice } from '../../utils/formatPrice';

/**
 * Base Bento / Surface Card
 */
export const Card = ({
  children,
  className = '',
  isHoverable = true,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      variants={isHoverable ? cardHover : undefined}
      initial={isHoverable ? 'rest' : undefined}
      whileHover={isHoverable ? 'hover' : undefined}
      onClick={onClick}
      className={`
        bg-white dark:bg-dark-card
        border border-neutral-200/80 dark:border-dark-border
        rounded-2xl overflow-hidden transition-colors duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Premium Modern Product Card Base Component
 * Zero CLS: Explicit aspect-ratio, skeleton image placeholder, lazy loading, and hardware-accelerated transforms
 */
export const ProductCard = ({
  id,
  title,
  price,
  originalPrice,
  category,
  image,
  rating = 0,
  reviewsCount = 0,
  badgeText,
  badgeVariant = 'sale',
  isOutOfStock = false,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  className = '',
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const discountPercentage = originalPrice && price < originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (onAddToWishlist) onAddToWishlist(id, !isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isOutOfStock && onAddToCart) onAddToCart(id);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(id);
  };

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className={`
        group relative flex flex-col bg-white dark:bg-dark-card
        border border-neutral-200/70 dark:border-dark-border
        rounded-2xl overflow-hidden cursor-pointer select-none
        transition-colors duration-200 h-full
        ${className}
      `}
    >
      {/* Product Image Container with strict Aspect Ratio (Zero Layout Shift) */}
      <div className="relative w-full aspect-square bg-neutral-100 dark:bg-dark-surface overflow-hidden">
        
        {/* Placeholder skeleton while image loads */}
        {!isImageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        )}

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {isOutOfStock ? (
            <Badge variant="outOfStock">Sold Out</Badge>
          ) : discountPercentage ? (
            <Badge variant="sale">-{discountPercentage}%</Badge>
          ) : badgeText ? (
            <Badge variant={badgeVariant}>{badgeText}</Badge>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <motion.button
          type="button"
          onClick={handleWishlist}
          whileTap={buttonTap}
          className="
            absolute top-3 right-3 z-10 w-9 h-9 rounded-full
            bg-white/85 dark:bg-dark-surface/85 backdrop-blur-md
            border border-neutral-200/50 dark:border-dark-border/50
            flex items-center justify-center text-neutral-600 dark:text-neutral-300
            hover:text-brand-500 hover:bg-white dark:hover:bg-dark-card
            transition-colors duration-150 shadow-xs cursor-pointer
          "
          aria-label="Save to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-brand-500 text-brand-500' : ''
            }`}
          />
        </motion.button>

        {/* Product Image with Zoom on Card Hover & Lazy Loading */}
        <img
          src={image}
          alt={title}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          className={`
            w-full h-full object-cover object-center
            transition-all duration-500 ease-out group-hover:scale-106
            ${isImageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Quick View & Quick Add Action Bar (Hover Overlay) */}
        {!isOutOfStock && (
          <div className="
            absolute inset-x-3 bottom-3 z-10 flex items-center gap-2
            translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-250 ease-out pointer-events-none group-hover:pointer-events-auto
          ">
            {onQuickView && (
              <motion.button
                type="button"
                onClick={handleQuickView}
                whileTap={buttonTap}
                className="
                  p-2.5 rounded-xl bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md
                  border border-neutral-200/60 dark:border-dark-border
                  text-neutral-700 dark:text-dark-text hover:text-brand-500
                  transition-colors shadow-subtle cursor-pointer
                "
                title="Quick View"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            )}

            <motion.button
              type="button"
              onClick={handleAddToCart}
              whileTap={buttonTap}
              className="
                flex-1 flex items-center justify-center gap-2
                py-2.5 px-4 rounded-xl font-medium text-xs tracking-wide
                bg-neutral-900 hover:bg-brand-500 text-white
                dark:bg-white dark:text-neutral-900 dark:hover:bg-brand-500 dark:hover:text-white
                transition-colors shadow-elevated cursor-pointer
              "
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Product Content Details (Reserved space to eliminate layout shifts) */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {category && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            {category}
          </span>
        )}

        <h3 className="font-display font-medium text-sm text-neutral-900 dark:text-dark-text line-clamp-2 leading-snug group-hover:text-brand-500 transition-colors min-h-[2.5rem]">
          {title}
        </h3>

        {/* Rating */}
        <div className="mt-auto pt-1">
          <Rating rating={rating} reviewsCount={reviewsCount} size="sm" />
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-lg text-neutral-900 dark:text-dark-text">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
