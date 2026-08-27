import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { GalleryService } from '../../../core/services/gallery.service';
import { PublicGalleryItem } from '../../../core/models/gallery-item.model';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  items = signal<PublicGalleryItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedItem = signal<PublicGalleryItem | null>(null);

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

  openLightbox(item: PublicGalleryItem): void {
    this.selectedItem.set(item);
  }

  closeLightbox(): void {
    this.selectedItem.set(null);
  }
}
