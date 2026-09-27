import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

/**
 * Product Detail Image Gallery with mobile touch swipe & desktop thumbnail selector
 */
export const ProductGallery = ({ images = [], title = 'Product Image' }) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
      {/* Thumbnail Bar (Desktop) */}
      <div className="hidden lg:flex flex-col gap-3 shrink-0">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedImageIdx(idx)}
            className={`
              w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer p-0.5
              ${selectedImageIdx === idx
                ? 'border-brand-500 shadow-sm'
                : 'border-neutral-200/80 dark:border-dark-border opacity-70 hover:opacity-100'
              }
            `}
          >
            <img
              src={img}
              alt={`${title} thumb ${idx + 1}`}
              className="w-full h-full object-cover object-center rounded-xl"
            />
          </button>
        ))}
      </div>

      {/* Main Image Showcase (Desktop) */}
      <div className="hidden lg:block flex-1 rounded-3xl overflow-hidden bg-neutral-100 dark:bg-dark-surface border border-neutral-200/80 dark:border-dark-border relative aspect-square shadow-subtle group">
        <img
          src={displayImages[selectedImageIdx]}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-106"
        />
      </div>

      {/* Mobile Swipeable Gallery using Swiper */}
      <div className="lg:hidden w-full aspect-square rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-dark-border relative shadow-subtle">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {displayImages.map((img, idx) => (
            <SwiperSlide key={idx} className="w-full h-full">
              <img
                src={img}
                alt={`${title} ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductGallery;
