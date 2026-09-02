/** Default image when a product or service has no uploaded photo. */
export const FALLBACK_PRODUCT_IMAGE = 'assets/images/knowles-knives-logo.svg';

/** Returns the provided image URL or the site fallback logo. */
export function resolveProductImage(url: string | null | undefined): string {
  const trimmed = url?.trim();
  return trimmed || FALLBACK_PRODUCT_IMAGE;
}
