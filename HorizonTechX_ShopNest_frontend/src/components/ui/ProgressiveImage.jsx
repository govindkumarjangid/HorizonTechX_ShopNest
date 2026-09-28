import React, { useState, useEffect, useRef } from 'react';
import { getCloudinaryUrl } from '../../utils/cloudinary';
import { ShoppingBag } from 'lucide-react';

/**
 * ProgressiveImage - Cloudinary & CDN Progressive Image Loader
 * - Renders blurred placeholder when available (Cloudinary/Unsplash)
 * - Detects cached images immediately to prevent flashing/blank states
 * - Renders full-quality image with smooth CSS opacity transition
 * - Graceful fallback icon if image fails to load
 */
export const ProgressiveImage = ({
  src,
  publicId,
  alt = 'Product image',
  width = 800,
  height,
  crop = 'scale',
  aspectRatio = 'aspect-square',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  priority = false,
  onLoad,
  onClick,
}) => {
  const targetId = publicId || src;
  const { blurUrl, fullUrl, rawUrl } = getCloudinaryUrl(targetId, { width, height, crop });

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [displaySrc, setDisplaySrc] = useState(fullUrl || rawUrl || '');
  const [displayBlurSrc, setDisplayBlurSrc] = useState(blurUrl || '');
  const imgRef = useRef(null);

  useEffect(() => {
    const urls = getCloudinaryUrl(publicId || src, { width, height, crop });
    setDisplaySrc(urls.fullUrl || urls.rawUrl || '');
    setDisplayBlurSrc(urls.blurUrl || '');
    setHasError(false);
    setIsLoaded(false);
  }, [src, publicId, width, height, crop]);

  // Check if image is already completed in DOM cache
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  }, [displaySrc, onLoad]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    if (rawUrl && displaySrc !== rawUrl) {
      setDisplaySrc(rawUrl);
    } else {
      setHasError(true);
      setIsLoaded(true);
      if (onLoad) onLoad();
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-neutral-100 dark:bg-dark-surface ${aspectRatio} ${className}`}
    >
      {/* 1. Low-Quality Heavily Blurred Placeholder (Only if distinct from fullUrl) */}
      {displayBlurSrc && displayBlurSrc !== displaySrc && !isLoaded && (
        <img
          src={displayBlurSrc}
          alt=""
          aria-hidden="true"
          className={`
            absolute inset-0 w-full h-full object-cover object-center
            filter blur-[12px] scale-105 pointer-events-none transition-opacity duration-300
            ${imgClassName}
          `}
        />
      )}

      {/* 2. Full-Quality Image */}
      {displaySrc && !hasError && (
        <img
          ref={imgRef}
          src={displaySrc}
          alt={alt}
          loading={priority ? 'eager' : loading}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`
            absolute inset-0 w-full h-full object-cover object-center
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : (displayBlurSrc && displayBlurSrc !== displaySrc ? 'opacity-0' : 'opacity-100')}
            ${imgClassName}
          `}
        />
      )}

      {/* 3. Graceful Fallback if image fails to load or empty */}
      {(!displaySrc || hasError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-dark-surface text-neutral-300 dark:text-neutral-600">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;
