import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, of, catchError } from 'rxjs';
import { KnifeApiService } from '../../../core/api/knife-api.service';
import { Knife } from '../../../core/models/knife.model';
import {
  AvailabilityLabelPipe,
  AvailabilityBadgePipe,
} from '../../../shared/pipes/availability.pipe';
import { CurrencyZarPipe } from '../../../shared/pipes/currency-zar.pipe';
import { getKnifeImages } from '../../../shared/utils/knife-images.util';
import { KnifeImage } from '../../../core/models/knife-image.model';

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
            catchError(() => {
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
          return;
        }

        if (knife === null) {
          this.notFound.set(true);
          this.loading.set(false);
          return;
        }

        this.knife.set(knife);
        this.galleryImages = getKnifeImages(knife);
        this.selectedImage = this.galleryImages[0]?.imageUrl ?? '';
        this.loading.set(false);
      });
  }

  selectImage(url: string): void {
    this.selectedImage = url;
  }
}
