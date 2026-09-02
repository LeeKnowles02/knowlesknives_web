import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, of, catchError } from 'rxjs';
import { KnifeApiService } from '../../../core/api/knife-api.service';
import { ApiError } from '../../../core/api/api-client.service';
import { Knife } from '../../../core/models/knife.model';
import {
  AvailabilityLabelPipe,
  AvailabilityBadgePipe,
} from '../../../shared/pipes/availability.pipe';
import { CurrencyZarPipe } from '../../../shared/pipes/currency-zar.pipe';
import { getKnifeImages, parseKnifePrice } from '../../../shared/utils/knife-images.util';
import { resolveProductImage } from '../../../shared/utils/image-fallback.util';
import { KnifeImage } from '../../../core/models/knife-image.model';
import { SeoService } from '../../../core/services/seo.service';
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  truncateDescription,
} from '../../../core/services/seo.util';
import { HttpStatusService } from '../../../core/services/http-status.service';

@Component({
  selector: 'app-knife-details',
  standalone: true,
  imports: [RouterLink, AvailabilityLabelPipe, AvailabilityBadgePipe, CurrencyZarPipe],
  templateUrl: './knife-details.component.html',
  styleUrl: './knife-details.component.scss',
})
export class KnifeDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly knifeApi = inject(KnifeApiService);
  private readonly seo = inject(SeoService);
  private readonly httpStatus = inject(HttpStatusService);
  private readonly destroyRef = inject(DestroyRef);

  knife = signal<Knife | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  notFound = signal(false);
  selectedImage = '';
  galleryImages: KnifeImage[] = [];

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

          return this.knifeApi.getKnifeBySlug(slug).pipe(
            catchError((error: unknown) => {
              if (error instanceof ApiError && error.status === 404) {
                return of(null);
              }

              this.error.set('Could not load knife. Please try again.');
              return of(undefined);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((knife) => {
        if (knife === undefined) {
          this.loading.set(false);
          this.updateErrorSeo();
          return;
        }

        if (knife === null) {
          this.notFound.set(true);
          this.loading.set(false);
          this.updateNotFoundSeo();
          return;
        }

        this.knife.set(knife);
        this.galleryImages = getKnifeImages(knife);
        this.selectedImage = resolveProductImage(this.galleryImages[0]?.imageUrl);
        this.updateSeo(knife);
        this.loading.set(false);
      });
  }

  selectImage(url: string): void {
    this.selectedImage = resolveProductImage(url);
  }

  private updateSeo(knife: Knife): void {
    const image = this.galleryImages[0]?.imageUrl ?? undefined;
    const sourceDescription =
      knife.shortDescription ??
      knife.description ??
      `Handcrafted ${knife.category.toLowerCase()} knife from Knowles Knives.`;
    const description = truncateDescription(sourceDescription);
    const path = `/knives/${knife.slug}`;

    this.seo.update({
      title: `${knife.name} | ${knife.category} Knife | Knowles Knives`,
      description,
      path,
      image,
      type: 'product',
      jsonLd: [
        buildProductJsonLd({
          name: knife.name,
          description,
          path,
          image,
          category: knife.category,
          price: parseKnifePrice(knife.price),
          availability: knife.availability,
        }),
        buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Knives', path: '/knives' },
          { name: knife.name, path },
        ]),
      ],
    });
  }

  private updateNotFoundSeo(): void {
    this.httpStatus.setStatus(404);
    this.seo.update({
      title: 'Knife Not Found | Knowles Knives',
      description:
        'This knife could not be found. Browse handmade knives from Knowles Knives or send an enquiry.',
      path: '/knives',
      robots: 'noindex, follow',
    });
  }

  private updateErrorSeo(): void {
    this.seo.update({
      title: 'Knife Unavailable | Knowles Knives',
      description:
        'This knife page could not be loaded right now. Browse handmade knives from Knowles Knives or try again later.',
      path: '/knives',
      robots: 'noindex, follow',
    });
  }
}
