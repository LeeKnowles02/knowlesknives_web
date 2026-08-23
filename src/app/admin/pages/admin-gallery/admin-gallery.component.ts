import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { GalleryService } from '../../../core/services/gallery.service';
import { GalleryItem } from '../../../core/models/gallery-item.model';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-gallery.component.html',
  styleUrl: './admin-gallery.component.scss',
})
export class AdminGalleryComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  items = signal<GalleryItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.refresh$
      .pipe(
        switchMap(() => this.galleryService.getAll()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (items) => {
          this.items.set(items);
          this.loading.set(false);
          this.error.set(null);
        },
        error: () => {
          this.error.set('Could not load gallery items. Please try again.');
          this.loading.set(false);
        },
      });
  }

  deactivate(id: number, title: string): void {
    if (confirm(`Hide "${title}" from the public gallery?`)) {
      this.galleryService
        .deactivateItem(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.refresh$.next(),
          error: () => this.error.set('Could not hide gallery item. Please try again.'),
        });
    }
  }

  delete(id: number, title: string): void {
    if (confirm(`Permanently delete "${title}"?`)) {
      this.galleryService
        .deleteItem(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.refresh$.next(),
          error: () => this.error.set('Could not delete gallery item. Please try again.'),
        });
    }
  }
}
