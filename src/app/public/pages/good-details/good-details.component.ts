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
import { getGoodImages } from '../../../shared/utils/good-images.util';
import { GoodImage } from '../../../core/models/good-image.model';
import { SeoService } from '../../../core/services/seo.service';
import { environment } from '../../../../environments/environment';

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
          return;
        }

        if (good === null) {
          this.notFound.set(true);
          this.loading.set(false);
          return;
        }

        this.good.set(good);
        this.galleryImages = getGoodImages(good);
        this.selectedImage = this.galleryImages[0]?.imageUrl ?? '';
        this.updateSeo(good);
        this.loading.set(false);
      });
  }

  selectImage(url: string): void {
    this.selectedImage = url;
  }

  private updateSeo(good: Good): void {
    const image = this.galleryImages[0]?.imageUrl ?? 'assets/images/knife-hero.png';
    const sourceDescription =
      good.description ??
      good.shortDescription ??
      `${good.category} piece from Knowles Knives.`;
    const description =
      sourceDescription.length > 155 ? `${sourceDescription.slice(0, 152)}...` : sourceDescription;

    this.seo.update({
      title: `${good.name} — ${good.category} | Knowles Knives`,
      description,
      path: `/goods/${good.slug}`,
      image,
      type: 'product',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: good.name,
        description,
        image: image.startsWith('http') ? image : `${environment.siteUrl}/${image}`,
        brand: {
          '@type': 'Brand',
          name: 'Knowles Knives',
        },
        category: good.category,
        offers: {
          '@type': 'Offer',
          availability:
            good.availability === 'Available'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/LimitedAvailability',
          priceCurrency: 'ZAR',
          url: `${environment.siteUrl}/goods/${good.slug}`,
        },
      },
    });
  }
}
