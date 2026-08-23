import { Good } from '../../core/models/good.model';
import { GoodImage } from '../../core/models/good-image.model';

/** Returns the primary display image URL or null if none */
export function getGoodPrimaryImage(good: Good): string | null {
  return good.primaryImage?.imageUrl ?? good.images?.[0]?.imageUrl ?? null;
}

/** All gallery images for detail view, sorted by sortOrder */
export function getGoodImages(good: Good): GoodImage[] {
  return [...(good.images ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

/** Build images array from up to 4 form fields, omitting empty optional entries */
export function buildGoodImagesFromFields(
  image1: string,
  image2?: string,
  image3?: string,
  image4?: string,
  altText?: string,
): { imageUrl: string; altText?: string }[] {
  return [image1, image2, image3, image4]
    .map((url) => url?.trim())
    .filter((url): url is string => !!url)
    .slice(0, 4)
    .map((imageUrl, index) => ({
      imageUrl,
      altText: index === 0 ? altText?.trim() || undefined : undefined,
    }));
}

export function parseGoodPrice(price: number | string | null | undefined): number | null {
  if (price === null || price === undefined || price === '') {
    return null;
  }
  const num = typeof price === 'number' ? price : parseFloat(price);
  return Number.isNaN(num) ? null : num;
}
