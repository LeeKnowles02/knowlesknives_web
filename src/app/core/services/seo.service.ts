import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  absoluteSiteUrl,
  defaultOgImageUrl,
  normalizeCanonicalPath,
} from './seo.util';

export type SeoRobots = 'index, follow' | 'noindex, follow' | 'noindex, nofollow';

export interface SeoConfig {
  title: string;
  description: string;
  path?: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  robots?: SeoRobots;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(config: SeoConfig): void {
    const canonicalPath = normalizeCanonicalPath(config.canonicalPath ?? config.path ?? '/');
    const url = absoluteSiteUrl(canonicalPath);
    const image = config.image ? absoluteSiteUrl(config.image) : defaultOgImageUrl();
    const type = config.type ?? 'website';
    const robots = config.robots ?? 'index, follow';

    this.title.setTitle(config.title);
    this.setTag('description', config.description);
    this.setTag('robots', robots);
    this.setProperty('og:site_name', 'Knowles Knives');
    this.setProperty('og:title', config.title);
    this.setProperty('og:description', config.description);
    this.setProperty('og:type', type);
    this.setProperty('og:url', url);
    this.setProperty('og:image', image);
    this.setTag('twitter:card', 'summary_large_image');
    this.setTag('twitter:title', config.title);
    this.setTag('twitter:description', config.description);
    this.setTag('twitter:image', image);
    this.setCanonical(url);

    if (config.jsonLd) {
      const payload = Array.isArray(config.jsonLd)
        ? { '@context': 'https://schema.org', '@graph': config.jsonLd.map(stripContext) }
        : config.jsonLd;
      this.setJsonLd(payload);
    } else {
      this.removeJsonLd();
    }
  }

  private setTag(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private setJsonLd(data: Record<string, unknown> | Record<string, unknown>[]): void {
    this.removeJsonLd();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  private removeJsonLd(): void {
    this.document.querySelector('#structured-data')?.remove();
  }
}

function stripContext(item: Record<string, unknown>): Record<string, unknown> {
  const { '@context': _context, ...rest } = item;
  return rest;
}
