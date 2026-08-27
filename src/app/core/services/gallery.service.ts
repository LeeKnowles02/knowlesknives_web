import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { GalleryApiService } from '../api/gallery-api.service';
import { GalleryItem, GalleryItemPayload, PublicGalleryItem } from '../models/gallery-item.model';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly galleryApi = inject(GalleryApiService);

  getAll(): Observable<GalleryItem[]> {
    return this.galleryApi.getAdminItems();
  }

  getActive(): Observable<PublicGalleryItem[]> {
    return this.galleryApi.getActive();
  }

  getPreview(count = 4): Observable<PublicGalleryItem[]> {
    return this.getActive().pipe(map((items) => items.slice(0, count)));
  }

  getById(id: number): Observable<GalleryItem> {
    return this.galleryApi.getAdminItemById(id);
  }

  addItem(item: GalleryItemPayload): Observable<GalleryItem> {
    return this.galleryApi.createItem(item);
  }

  updateItem(id: number, updates: GalleryItemPayload): Observable<GalleryItem> {
    return this.galleryApi.updateItem(id, updates);
  }

  deactivateItem(id: number): Observable<GalleryItem> {
    return this.galleryApi.getAdminItemById(id).pipe(
      switchMap((existing) =>
        this.galleryApi.updateItem(id, {
          title: existing.title,
          imageUrl: existing.imageUrl,
          category: existing.category,
          active: false,
          sortOrder: existing.sortOrder,
        }),
      ),
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.galleryApi.deleteItem(id);
  }
}
