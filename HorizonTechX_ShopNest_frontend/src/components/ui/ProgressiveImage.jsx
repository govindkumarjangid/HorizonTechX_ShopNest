import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { getCloudinaryUrl } from '../../utils/cloudinary';

/**
 * ProgressiveImage - Cloudinary Blur-Up Progressive Loading
 * - Immediately renders heavily blurred placeholder (filter: blur(15px), scale(1.1))
 * - Preloads full resolution image in background
 * - Seamlessly crossfades blur(15px) -> blur(0px) with scale/opacity
 * - Guarantees full-div image coverage and zero layout shift
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
  const [displaySrc, setDisplaySrc] = useState(fullUrl || rawUrl || '');
  const [displayBlurSrc, setDisplayBlurSrc] = useState(blurUrl || rawUrl || '');
  const containerRef = useRef(null);

  // Sync state whenever image source changes
  useEffect(() => {
    const urls = getCloudinaryUrl(publicId || src, { width, height, crop });
    setDisplaySrc(urls.fullUrl || urls.rawUrl || '');
    setDisplayBlurSrc(urls.blurUrl || urls.rawUrl || '');
    setIsLoaded(false);
  }, [src, publicId, width, height, crop]);

  // Preload full quality image in memory
  useEffect(() => {
    if (!displaySrc) return;

    let isMounted = true;
    const img = new Image();
    img.src = displaySrc;

    img.onload = () => {
      if (isMounted) {
        setIsLoaded(true);
        if (onLoad) onLoad();
      }
    };

    img.onerror = () => {
      // Graceful fallback to original URL if fetch fails
      if (rawUrl && rawUrl !== displaySrc) {
        setDisplaySrc(rawUrl);
        setDisplayBlurSrc(rawUrl);
        const fallbackImg = new Image();
        fallbackImg.src = rawUrl;
        fallbackImg.onload = () => {
          if (isMounted) {
            setIsLoaded(true);
            if (onLoad) onLoad();
          }
        };
        fallbackImg.onerror = () => {
          if (isMounted) {
            setIsLoaded(true);
            if (onLoad) onLoad();
          }
        };
      } else {
        if (isMounted) {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }
      }
    };

    return () => {
      isMounted = false;
    };
  }, [displaySrc, rawUrl, onLoad]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative overflow-hidden bg-neutral-100 dark:bg-dark-surface ${aspectRatio} ${className}`}
    >
      {/* 1. Low-Quality Heavily Blurred Placeholder */}
      {displayBlurSrc && (
        <img
          src={displayBlurSrc}
          alt=""
          aria-hidden="true"
          onError={() => {
            if (rawUrl && displayBlurSrc !== rawUrl) {
              setDisplayBlurSrc(rawUrl);
            }
          }}
          className={`
            absolute inset-0 w-full h-full object-cover object-center
            filter blur-[15px] scale-110 transition-opacity duration-500 pointer-events-none
            ${isLoaded ? 'opacity-0' : 'opacity-100'}
            ${imgClassName}
          `}
        />
      )}

      {/* 2. Full-Quality Image with Motion Crossfade */}
      {displaySrc && (
        <motion.img
          src={displaySrc}
          alt={alt}
          loading={loading}
          onLoad={handleImageLoad}
          onError={() => {
            if (rawUrl && displaySrc !== rawUrl) {
              setDisplaySrc(rawUrl);
              setDisplayBlurSrc(rawUrl);
            }
            setIsLoaded(true);
            if (onLoad) onLoad();
          }}
          initial={{ opacity: 0, filter: 'blur(6px)', scale: 1.02 }}
          animate={isLoaded ? { opacity: 1, filter: 'blur(0px)', scale: 1 } : { opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`
            absolute inset-0 w-full h-full object-cover object-center
            ${imgClassName}
          `}
        />
      )}
    </div>
  );
};

export default ProgressiveImage;
