import { Cloudinary } from '@cloudinary/url-gen';
import { scale, fill } from '@cloudinary/url-gen/actions/resize';
import { blur } from '@cloudinary/url-gen/actions/effect';
import { format, quality, dpr } from '@cloudinary/url-gen/actions/delivery';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dlv1enrt0';

export const cld = new Cloudinary({
  cloud: { cloudName },
  url: { secure: true }
});

export function extractPublicId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return '';
  if (!urlOrId.startsWith('http')) return urlOrId;
  const match = urlOrId.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return match ? match[1] : urlOrId;
}

export function getCloudinaryUrl(publicId, options = {}) {
  if (!publicId) return { blurUrl: '', fullUrl: '', rawUrl: '' };

  const {
    width = 800,
    height,
    crop = 'scale',
    getBlur = false
  } = options;

  const isExternalUrl = publicId.startsWith('http') && !publicId.includes('cloudinary.com');

  if (isExternalUrl) {
    if (publicId.includes('unsplash.com')) {
      try {
        const url = new URL(publicId);
        url.searchParams.set('w', width.toString());
        url.searchParams.set('auto', 'format');
        url.searchParams.set('fit', 'crop');
        url.searchParams.set('q', '85');

        let blurUrl = '';
        if (getBlur) {
          const bUrl = new URL(publicId);
          bUrl.searchParams.set('w', '30');
          bUrl.searchParams.set('q', '15');
          bUrl.searchParams.set('auto', 'format');
          bUrl.searchParams.set('fit', 'crop');
          blurUrl = bUrl.toString();
        }

        return { blurUrl, fullUrl: url.toString(), rawUrl: publicId };
      } catch (e) {
        return { blurUrl: '', fullUrl: publicId, rawUrl: publicId };
      }
    }
    return { blurUrl: '', fullUrl: publicId, rawUrl: publicId };
  }

  try {
    const cleanId = extractPublicId(publicId);
    let blurUrl = '';
    if (getBlur) {
      blurUrl = cld.image(cleanId)
        .resize(scale().width(30))
        .effect(blur().strength(1000))
        .delivery(quality(1))
        .delivery(format('auto'))
        .toURL();
    }

    const fullImg = cld.image(cleanId);

    if (crop === 'fill' && height)
      fullImg.resize(fill().width(width).height(height));
    else
      fullImg.resize(scale().width(width));

    fullImg
      .delivery(quality('auto'))
      .delivery(format('auto'))
      .delivery(dpr('auto'));

    return {
      blurUrl,
      fullUrl: fullImg.toURL(),
      rawUrl: publicId,
    };
  } catch (err) {
    console.error('[Cloudinary URL Gen Error]:', err);
    return { blurUrl: '', fullUrl: publicId, rawUrl: publicId };
  }
}

export default {
  cld,
  getCloudinaryUrl,
  extractPublicId,
};