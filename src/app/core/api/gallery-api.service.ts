import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { GalleryItem, GalleryItemPayload } from '../models/gallery-item.model';

@Injectable({ providedIn: 'root' })
export class GalleryApiService {
  private readonly api = inject(ApiClientService);

  getActive(): Observable<GalleryItem[]> {
    return this.api.get<GalleryItem[]>('/gallery');
  }

  getAdminItems(): Observable<GalleryItem[]> {
    return this.api.get<GalleryItem[]>('/admin/gallery');
  }

  getAdminItemById(id: number): Observable<GalleryItem> {
    return this.api.get<GalleryItem>(`/admin/gallery/${id}`);
  }

  createItem(payload: GalleryItemPayload): Observable<GalleryItem> {
    return this.api.post<GalleryItem>('/admin/gallery', payload);
  }

  updateItem(id: number, payload: GalleryItemPayload): Observable<GalleryItem> {
    return this.api.put<GalleryItem>(`/admin/gallery/${id}`, payload);
  }

  deleteItem(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/gallery/${id}`);
  }
}
