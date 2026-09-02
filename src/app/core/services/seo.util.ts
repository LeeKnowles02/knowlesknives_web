import { environment } from '../../../environments/environment';

const DEFAULT_OG_IMAGE = 'assets/images/knife-hero-1920.jpg';

export function absoluteSiteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = environment.siteUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function normalizeCanonicalPath(path: string): string {
  const withoutQuery = path.split(/[?#]/)[0] || '/';
  const collapsed = withoutQuery.replace(/\/{2,}/g, '/');
  const trimmed = collapsed.length > 1 ? collapsed.replace(/\/+$/, '') : collapsed;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

export function truncateDescription(text: string, maxLength = 155): string {
  const trimmed = text.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 3).trimEnd()}...`;
}

export function defaultOgImageUrl(): string {
  return absoluteSiteUrl(DEFAULT_OG_IMAGE);
}

export function resolveProductImageUrl(image?: string | null): string {
  if (!image) {
    return defaultOgImageUrl();
  }

  return absoluteSiteUrl(image.replace(/^\//, ''));
}

export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Knowles Knives',
        url: environment.siteUrl,
        logo: absoluteSiteUrl('assets/images/knowles-knives-logo.svg'),
        description:
          'Handmade custom knives, engraving, repairs, and knife-making courses near Randburg, serving Johannesburg.',
        areaServed: ['Randburg', 'Johannesburg', 'South Africa'],
      },
      {
        '@type': 'WebSite',
        name: 'Knowles Knives',
        url: environment.siteUrl,
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteSiteUrl(item.path),
    })),
  };
}

export function buildProductJsonLd(options: {
  name: string;
  description: string;
  path: string;
  image?: string | null;
  category?: string;
  price?: number | null;
  availability?: string;
}): Record<string, unknown> {
  const productUrl = absoluteSiteUrl(options.path);
  const image = resolveProductImageUrl(options.image);
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: options.name,
    description: options.description,
    image,
    brand: {
      '@type': 'Brand',
      name: 'Knowles Knives',
    },
    url: productUrl,
  };

  if (options.category) {
    jsonLd['category'] = options.category;
  }

  if (options.price != null) {
    jsonLd['offers'] = {
      '@type': 'Offer',
      price: options.price,
      priceCurrency: 'ZAR',
      availability:
        options.availability === 'Available'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/LimitedAvailability',
      url: productUrl,
    };
  }

  return jsonLd;
}
