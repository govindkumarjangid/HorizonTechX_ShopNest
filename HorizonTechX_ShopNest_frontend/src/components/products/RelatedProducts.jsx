import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { ProductCard } from '../ui/Card';
import { H3, Subtitle } from '../ui/Typography';

/**
 * Related / Recommended Products Swiper Carousel
 */
export const RelatedProducts = ({
  products = [],
  currentProductId,
  category,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onSelectProduct,
  onClick,
}) => {
  const navigate = useNavigate();
  const related = products.filter((p) => (p._id || p.id) !== currentProductId).slice(0, 8);

  if (related.length === 0) return null;

  const handleProductNavigate = (product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
      return;
    }
    if (onQuickView) {
      onQuickView(product);
      return;
    }
    if (onClick) {
      onClick(product);
      return;
    }
    const targetId = product._id || product.id;
    if (targetId) {
      navigate(`/product/${targetId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pt-12 border-t border-neutral-200/80 dark:border-dark-border">
      <div>
        <H3>Recommended Products</H3>
        <Subtitle className="text-sm">Customers who viewed this item also explored these recommendations.</Subtitle>
      </div>

      <div className="w-full relative">
        <Swiper
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1.15}
          pagination={{ 
            clickable: true,
            el: '.related-pagination'
          }}
          breakpoints={{
            640: { slidesPerView: 2.15, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="w-full !overflow-visible"
        >
          {related.map((product) => (
            <SwiperSlide key={product._id || product.id} className="h-auto">
              <ProductCard
                {...product}
                onAddToCart={() => onAddToCart && onAddToCart(product)}
                onAddToWishlist={() => onAddToWishlist && onAddToWishlist(product)}
                onQuickView={() => handleProductNavigate(product)}
                onClick={() => handleProductNavigate(product)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Custom pagination container safely placed below cards */}
        <div className="related-pagination flex items-center justify-center gap-2 pt-5 pb-2" />
      </div>
    </div>
  );
};

export default RelatedProducts;
