import React from 'react';
import { motion } from 'motion/react';
import { ProductCard } from '../ui/Card';
import { ProductCardSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { staggerContainer, staggerItem } from '../../styles/motion';

/**
 * Reusable Product Grid with Loading Skeleton & Empty State
 */
export const ProductGrid = ({
  products = [],
  isLoading = false,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onResetFilters,
  columns = 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4',
}) => {
  if (isLoading) {
    return (
      <div className={`grid ${columns} gap-3 sm:gap-4 lg:gap-6`}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No Curations Match Your Filters"
        description="Try adjusting your price range, clearing filters, or exploring other hardware categories."
        actionLabel="Reset All Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={`grid ${columns} gap-3 sm:gap-4 lg:gap-6`}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={staggerItem} className="h-full">
          <ProductCard
            {...product}
            onAddToCart={() => onAddToCart && onAddToCart(product)}
            onAddToWishlist={() => onAddToWishlist && onAddToWishlist(product)}
            onQuickView={() => onQuickView && onQuickView(product)}
            onClick={() => onQuickView && onQuickView(product)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;
