import { Knife } from '../../core/models/knife.model';
import { KnifeImage } from '../../core/models/knife-image.model';

/** Returns the primary display image URL or null if none */
export function getKnifePrimaryImage(knife: Knife): string | null {
  return knife.primaryImage?.imageUrl ?? knife.images?.[0]?.imageUrl ?? null;
}

/** All gallery images for detail view, sorted by sortOrder */
export function getKnifeImages(knife: Knife): KnifeImage[] {
  return [...(knife.images ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

/** Build images array from up to 4 form fields, omitting empty optional entries */
export function buildKnifeImagesFromFields(
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

export function parseKnifePrice(price: number | string | null | undefined): number | null {
  if (price === null || price === undefined || price === '') {
    return null;
  }
  const num = typeof price === 'number' ? price : parseFloat(price);
  return Number.isNaN(num) ? null : num;
}
