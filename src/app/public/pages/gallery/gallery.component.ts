import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GalleryService } from '../../../core/services/gallery.service';
import { GalleryItem } from '../../../core/models/gallery-item.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);
  private readonly destroyRef = inject(DestroyRef);

  items = signal<GalleryItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
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
}
