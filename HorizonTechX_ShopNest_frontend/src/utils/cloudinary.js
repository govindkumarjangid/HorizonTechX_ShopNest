import { Cloudinary } from '@cloudinary/url-gen';
import { scale, fill } from '@cloudinary/url-gen/actions/resize';
import { blur } from '@cloudinary/url-gen/actions/effect';
import { format, quality, dpr } from '@cloudinary/url-gen/actions/delivery';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dlv1enrt0';

export const cld = new Cloudinary({
  cloud: {
    cloudName,
  },
});

/**
 * Extracts publicId if an existing Cloudinary URL is provided
 */
export function extractPublicId(urlOrId) {
  if (!urlOrId) return '';
  if (!urlOrId.startsWith('http')) return urlOrId;

  const match = urlOrId.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  if (match && match[1]) {
    return match[1];
  }

  return urlOrId;
}

/**
 * Generate full and blurred placeholder Cloudinary URLs programmatically using @cloudinary/url-gen
 * For external URLs (like Unsplash), returns direct optimized URLs with fast blur placeholder
 * @param {string} publicId - Cloudinary Public ID or external URL
 * @param {object} options - width, height, crop ('scale' | 'fill')
 */
export function getCloudinaryUrl(publicId, options = {}) {
  if (!publicId) return { blurUrl: '', fullUrl: '', rawUrl: '' };

  const isExternalUrl = typeof publicId === 'string' && publicId.startsWith('http') && !publicId.includes('cloudinary.com');

  if (isExternalUrl) {
    // Unsplash direct URL optimization with fast progressive blur placeholder
    if (publicId.includes('unsplash.com')) {
      const targetWidth = options.width || 800;
      const fullUrl = publicId.includes('?')
        ? publicId.replace(/w=\d+/, `w=${targetWidth}`).replace(/q=\d+/, 'q=85')
        : `${publicId}?w=${targetWidth}&auto=format&fit=crop&q=85`;
      const blurUrl = publicId.includes('?')
        ? publicId.replace(/w=\d+/, 'w=30').replace(/q=\d+/, 'q=15')
        : `${publicId}?w=30&auto=format&fit=crop&q=15`;

      return { blurUrl, fullUrl, rawUrl: publicId };
    }

    // Direct external CDN URL (DummyJSON, Pexels, AWS S3, etc.)
    return { blurUrl: '', fullUrl: publicId, rawUrl: publicId };
  }

  // Cloudinary managed assets
  try {
    const cleanId = extractPublicId(publicId);

    // 1. Blur Placeholder URL (tiny width 30, heavy blur, q_1, f_auto)
    const blurImg = cld.image(cleanId)
      .resize(scale().width(30))
      .effect(blur().strength(1000))
      .delivery(quality(1))
      .delivery(format('auto'));

    // 2. Full-Quality Image URL (responsive width, q_auto, f_auto, dpr_auto)
    const width = options.width || 800;
    const fullImg = cld.image(cleanId)
      .resize(options.crop === 'fill' && options.height ? fill().width(width).height(options.height) : scale().width(width))
      .delivery(quality('auto'))
      .delivery(format('auto'))
      .delivery(dpr('auto'));

    return {
      blurUrl: blurImg.toURL(),
      fullUrl: fullImg.toURL(),
      rawUrl: publicId,
    };
  } catch (err) {
    console.warn('[Cloudinary] Failed to transform URL:', err);
    return { blurUrl: publicId, fullUrl: publicId, rawUrl: publicId };
  }
}

export default {
  cld,
  getCloudinaryUrl,
  extractPublicId,
};
