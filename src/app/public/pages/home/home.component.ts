import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  HostListener,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { KnifeApiService } from '../../../core/api/knife-api.service';
import { ServiceApiService } from '../../../core/api/service-api.service';
import { GoodApiService } from '../../../core/api/good-api.service';
import { GalleryService } from '../../../core/services/gallery.service';
import { KnifeCardComponent } from '../../components/knife-card/knife-card.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { GoodCardComponent } from '../../components/good-card/good-card.component';
import { Knife } from '../../../core/models/knife.model';
import { Service } from '../../../core/models/service.model';
import { Good } from '../../../core/models/good.model';
import { PublicGalleryItem } from '../../../core/models/gallery-item.model';
import { SeoService } from '../../../core/services/seo.service';
import { buildOrganizationJsonLd } from '../../../core/services/seo.util';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, KnifeCardComponent, ServiceCardComponent, GoodCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly knifeApi = inject(KnifeApiService);
  private readonly serviceApi = inject(ServiceApiService);
  private readonly goodApi = inject(GoodApiService);
  private readonly galleryService = inject(GalleryService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  featuredKnives = signal<Knife[]>([]);
  featuredGoods = signal<Good[]>([]);
  carouselIndex = signal(0);
  itemsPerView = signal(3);
  services = signal<Service[]>([]);
  galleryPreview = signal<PublicGalleryItem[]>([]);
  knivesLoading = signal(true);
  goodsLoading = signal(true);
  servicesLoading = signal(true);
  galleryLoading = signal(true);
  knivesError = signal<string | null>(null);
  goodsError = signal<string | null>(null);
  servicesError = signal<string | null>(null);
  galleryError = signal<string | null>(null);

  visibleFeaturedKnives = computed(() => {
    const start = this.carouselIndex();
    const count = this.itemsPerView();
    return this.featuredKnives().slice(start, start + count);
  });

  canGoPrevFeatured = computed(() => this.carouselIndex() > 0);

  canGoNextFeatured = computed(() => {
    const total = this.featuredKnives().length;
    const start = this.carouselIndex();
    const count = this.itemsPerView();
    return start + count < total;
  });

  featuredPageCount = computed(() => {
    const total = this.featuredKnives().length;
    const count = this.itemsPerView();
    return total <= count ? 1 : total - count + 1;
  });

  featuredPageNumber = computed(() => this.carouselIndex() + 1);

  ngOnInit(): void {
    this.updateItemsPerView();
    this.seo.update({
      title: 'Handmade Knives & Custom Engraving | Knowles Knives',
      description:
        'Handmade custom knives, laser engraving, and personalised gifts from Knowles Knives near Randburg, serving Johannesburg. Enquire by appointment.',
      path: '/',
      jsonLd: buildOrganizationJsonLd(),
    });

    this.knifeApi
      .getKnives({ featured: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (knives) => {
          this.featuredKnives.set(knives);
          this.carouselIndex.set(0);
          this.knivesLoading.set(false);
        },
        error: () => {
          this.knivesError.set('Could not load featured knives. Please try again.');
          this.knivesLoading.set(false);
        },
      });

    this.serviceApi
      .getServices({ active: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (services) => {
          this.services.set(services);
          this.servicesLoading.set(false);
        },
        error: () => {
          this.servicesError.set('Could not load services. Please try again.');
          this.servicesLoading.set(false);
        },
      });

    this.goodApi
      .getGoods({ featured: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (goods) => {
          this.featuredGoods.set(goods);
          this.goodsLoading.set(false);
        },
        error: () => {
          this.goodsError.set('Could not load featured goods. Please try again.');
          this.goodsLoading.set(false);
        },
      });

    this.galleryService
      .getPreview(4)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.galleryPreview.set(items);
          this.galleryLoading.set(false);
        },
        error: () => {
          this.galleryError.set('Could not load gallery preview.');
          this.galleryLoading.set(false);
        },
      });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateItemsPerView();
  }

  prevFeaturedKnives(): void {
    if (this.canGoPrevFeatured()) {
      this.carouselIndex.update((index) => index - 1);
    }
  }

  nextFeaturedKnives(): void {
    if (this.canGoNextFeatured()) {
      this.carouselIndex.update((index) => index + 1);
    }
  }

  private updateItemsPerView(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const perView = window.innerWidth < 768 ? 1 : 3;
    this.itemsPerView.set(perView);

    const maxIndex = Math.max(0, this.featuredKnives().length - perView);
    if (this.carouselIndex() > maxIndex) {
      this.carouselIndex.set(maxIndex);
    }
  }
}
