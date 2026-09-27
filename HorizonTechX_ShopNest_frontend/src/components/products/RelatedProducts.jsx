import React from 'react';
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
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}) => {
  const related = products.filter((p) => p.id !== currentProductId).slice(0, 6);

  if (related.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 w-full pt-12 border-t border-neutral-200/80 dark:border-dark-border">
      <div>
        <H3>Complementary Hardware</H3>
        <Subtitle className="text-sm">Curated tools engineered to integrate seamlessly into your setup.</Subtitle>
      </div>

      <div className="w-full relative pb-10">
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1.15}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2.15, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="w-full !overflow-visible"
        >
          {related.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <ProductCard
                {...product}
                onAddToCart={() => onAddToCart && onAddToCart(product)}
                onAddToWishlist={() => onAddToWishlist && onAddToWishlist(product)}
                onQuickView={() => onQuickView && onQuickView(product)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RelatedProducts;
