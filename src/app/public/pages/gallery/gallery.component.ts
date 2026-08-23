import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GalleryService } from '../../../core/services/gallery.service';
import { GalleryItem } from '../../../core/models/gallery-item.model';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  items = signal<GalleryItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedItem = signal<GalleryItem | null>(null);

  ngOnInit(): void {
    this.seo.update({
      title: 'Knife Gallery | Knowles Knives',
      description:
        'View custom knives, workshop moments, engravings, and finished blade work from Knowles Knives.',
      path: '/gallery',
    });

    this.galleryService
      .getActive()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.items.set(items);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load gallery. Please try again.');
          this.loading.set(false);
        },
      });
  }

  openLightbox(item: GalleryItem): void {
    this.selectedItem.set(item);
  }

  closeLightbox(): void {
    this.selectedItem.set(null);
  }
}
