import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

export interface SeoConfig {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(config: SeoConfig): void {
    const url = this.absoluteUrl(config.path ?? this.currentPath());
    const image = this.absoluteUrl(config.image ?? 'assets/images/knife-hero.png');
    const type = config.type ?? 'website';

    this.title.setTitle(config.title);
    this.setTag('description', config.description);
    this.setTag('robots', 'index, follow');
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
      this.setJsonLd(config.jsonLd);
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

  private setJsonLd(data: Record<string, unknown>): void {
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

  private absoluteUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const base = environment.siteUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  private currentPath(): string {
    return this.document.location?.pathname ?? '/';
  }
}
