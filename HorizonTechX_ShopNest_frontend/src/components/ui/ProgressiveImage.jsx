import { useState, useEffect, useRef } from 'react';
import { getCloudinaryUrl } from '../../utils/cloudinary';
import { ShoppingBag } from 'lucide-react';

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
  onError,
  onClick,
}) => {

  const targetId = publicId || src;
  const { fullUrl, rawUrl } = getCloudinaryUrl(targetId, { width, height, crop });
  const initialUrl = fullUrl || rawUrl || '';

  const [imgSrc, setImgSrc] = useState(initialUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(!initialUrl);
  const imgRef = useRef(null);

  useEffect(() => {
    const newUrl = fullUrl || rawUrl || '';
    setImgSrc(newUrl);
    setIsLoaded(false);
    const isErr = !newUrl;
    setHasError(isErr);
    if (isErr && onError) onError();
  }, [fullUrl, rawUrl]);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0)
      handleImageLoad();
  }, [imgSrc]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    if (imgSrc !== rawUrl && rawUrl) {
      setImgSrc(rawUrl);
    } else {
      setHasError(true);
      if (onError) onError();
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-neutral-100 dark:bg-dark-surface ${aspectRatio} ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      )}

      {!hasError && imgSrc && (
        <img
          ref={imgRef}
          src={imgSrc}
          alt={alt}
          loading={priority ? 'eager' : loading}
          fetchpriority={priority ? 'high' : 'auto'}
          decoding="async" // Prevents UI blocking
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`
            absolute inset-0 w-full h-full object-cover object-center
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${imgClassName}
          `}
        />
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-300 dark:text-neutral-600">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;