import { environment } from '../../../environments/environment';
import {
  absoluteSiteUrl,
  buildOrganizationJsonLd,
  buildProductJsonLd,
  defaultOgImageUrl,
  normalizeCanonicalPath,
  truncateDescription,
} from './seo.util';

describe('seo.util', () => {
  const siteOrigin = environment.siteUrl.replace(/\/$/, '');

  it('normalizes canonical paths without query strings or trailing slashes', () => {
    expect(normalizeCanonicalPath('/contact?knifeId=1')).toBe('/contact');
    expect(normalizeCanonicalPath('/knives/')).toBe('/knives');
    expect(normalizeCanonicalPath('//knives//star-lord//')).toBe('/knives/star-lord');
  });

  it('builds absolute site URLs', () => {
    expect(absoluteSiteUrl('/knives')).toBe(`${siteOrigin}/knives`);
    expect(absoluteSiteUrl('assets/images/knife-hero-1920.jpg')).toBe(
      `${siteOrigin}/assets/images/knife-hero-1920.jpg`,
    );
  });

  it('uses the default OG image fallback', () => {
    expect(defaultOgImageUrl()).toBe(`${siteOrigin}/assets/images/knife-hero-1920.jpg`);
  });

  it('uses the raster brand logo in organization JSON-LD', () => {
    const graph = (buildOrganizationJsonLd()['@graph'] as Array<Record<string, unknown>>)[0];
    expect(graph['logo']).toBe(`${siteOrigin}/assets/images/knowles-knives-logo.png`);
  });

  it('truncates long descriptions safely', () => {
    const longText = 'A'.repeat(200);
    expect(truncateDescription(longText).endsWith('...')).toBeTrue();
    expect(truncateDescription(longText).length).toBeLessThanOrEqual(155);
  });

  it('includes offer data only when a price is present', () => {
    const withPrice = buildProductJsonLd({
      name: 'Chef Utility',
      description: 'Handmade chef knife.',
      path: '/knives/chefs-utility',
      category: 'Kitchen',
      price: 750,
      availability: 'Available',
    });
    const withoutPrice = buildProductJsonLd({
      name: 'Custom Blade',
      description: 'Made to order.',
      path: '/knives/custom-blade',
      category: 'Custom',
      price: null,
      availability: 'Made to Order',
    });

    expect(withPrice['offers']).toBeDefined();
    expect(withoutPrice['offers']).toBeUndefined();
  });
});
