import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, of, catchError } from 'rxjs';
import { GoodApiService } from '../../../core/api/good-api.service';
import { ApiError } from '../../../core/api/api-client.service';
import { Good } from '../../../core/models/good.model';
import {
  AvailabilityLabelPipe,
  AvailabilityBadgePipe,
} from '../../../shared/pipes/availability.pipe';
import { CurrencyZarPipe } from '../../../shared/pipes/currency-zar.pipe';
import { getGoodImages, parseGoodPrice } from '../../../shared/utils/good-images.util';
import { resolveProductImage } from '../../../shared/utils/image-fallback.util';
import { GoodImage } from '../../../core/models/good-image.model';
import { SeoService } from '../../../core/services/seo.service';
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  truncateDescription,
} from '../../../core/services/seo.util';
import { HttpStatusService } from '../../../core/services/http-status.service';

@Component({
  selector: 'app-good-details',
  standalone: true,
  imports: [RouterLink, AvailabilityLabelPipe, AvailabilityBadgePipe, CurrencyZarPipe],
  templateUrl: './good-details.component.html',
  styleUrl: './good-details.component.scss',
})
export class GoodDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly goodApi = inject(GoodApiService);
  private readonly seo = inject(SeoService);
  private readonly httpStatus = inject(HttpStatusService);
  private readonly destroyRef = inject(DestroyRef);

  good = signal<Good | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  notFound = signal(false);
  selectedImage = '';
  galleryImages: GoodImage[] = [];

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const slug = params.get('slug');

          if (!slug) {
            return of(null);
          }

          this.loading.set(true);
          this.error.set(null);
          this.notFound.set(false);

          return this.goodApi.getGoodBySlug(slug).pipe(
            catchError((error: unknown) => {
              if (error instanceof ApiError && error.status === 404) {
                return of(null);
              }

              this.error.set('Could not load item. Please try again.');
              return of(undefined);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((good) => {
        if (good === undefined) {
          this.loading.set(false);
          this.updateErrorSeo();
          return;
        }

        if (good === null) {
          this.notFound.set(true);
          this.loading.set(false);
          this.updateNotFoundSeo();
          return;
        }

        this.good.set(good);
        this.galleryImages = getGoodImages(good);
        this.selectedImage = resolveProductImage(this.galleryImages[0]?.imageUrl);
        this.updateSeo(good);
        this.loading.set(false);
      });
  }

  selectImage(url: string): void {
    this.selectedImage = resolveProductImage(url);
  }

  private updateSeo(good: Good): void {
    const image = this.galleryImages[0]?.imageUrl ?? undefined;
    const sourceDescription =
      good.shortDescription ??
      good.description ??
      `${good.category} piece from Knowles Knives.`;
    const description = truncateDescription(sourceDescription);
    const path = `/goods/${good.slug}`;

    this.seo.update({
      title: `${good.name} | ${good.category} | Knowles Knives`,
      description,
      path,
      image,
      type: 'product',
      jsonLd: [
        buildProductJsonLd({
          name: good.name,
          description,
          path,
          image,
          category: good.category,
          price: parseGoodPrice(good.price),
          availability: good.availability,
        }),
        buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Goods', path: '/goods' },
          { name: good.name, path },
        ]),
      ],
    });
  }

  private updateNotFoundSeo(): void {
    this.httpStatus.setStatus(404);
    this.seo.update({
      title: 'Item Not Found | Knowles Knives',
      description:
        'This item could not be found. Browse engraved gifts from Knowles Knives or send an enquiry.',
      path: '/goods',
      robots: 'noindex, follow',
    });
  }

  private updateErrorSeo(): void {
    this.seo.update({
      title: 'Item Unavailable | Knowles Knives',
      description:
        'This item page could not be loaded right now. Browse goods from Knowles Knives or try again later.',
      path: '/goods',
      robots: 'noindex, follow',
    });
  }
}
