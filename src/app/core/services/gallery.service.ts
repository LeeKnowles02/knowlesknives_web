import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { GalleryItem } from '../models/gallery-item.model';
import { MOCK_GALLERY } from '../mock-data/gallery.mock';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  // TODO: Replace BehaviorSubject with HTTP client when API is connected
  private readonly itemsSubject = new BehaviorSubject<GalleryItem[]>([...MOCK_GALLERY]);
  readonly items$ = this.itemsSubject.asObservable();
  /** All items (admin) */
  getAll(): Observable<GalleryItem[]> {
    return this.items$;
  }
  /** Active items only (public site) */
  getActive(): Observable<GalleryItem[]> {
    return this.items$.pipe(map((items) => items.filter((i) => i.active)));
  }
  getPreview(count = 4): Observable<GalleryItem[]> {
    return this.getActive().pipe(map((items) => items.slice(0, count)));
  }
  // TODO: Replace with HTTP GET /api/gallery/:id
  getById(id: string): Observable<GalleryItem | undefined> {
    return this.items$.pipe(map((items) => items.find((i) => i.id === id)));
  }
  getCount(): number {
    return this.itemsSubject.value.filter((i) => i.active).length;
  }
  // TODO: Replace with POST /api/gallery
  addItem(item: Omit<GalleryItem, 'id'>): Observable<GalleryItem> {
    const newItem: GalleryItem = { ...item, id: String(Date.now()) };
    this.itemsSubject.next([...this.itemsSubject.value, newItem]);
    console.log('[GalleryService] addItem:', newItem);
    return new BehaviorSubject(newItem).asObservable();
  }
  // TODO: Replace with PUT /api/gallery/:id
  updateItem(id: string, updates: Partial<GalleryItem>): Observable<GalleryItem | undefined> {
    const list = this.itemsSubject.value;
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) return new BehaviorSubject(undefined).asObservable();
    const updated = { ...list[index], ...updates, id };
    const newList = [...list];
    newList[index] = updated;
    this.itemsSubject.next(newList);
    console.log('[GalleryService] updateItem:', updated);
    return new BehaviorSubject(updated).asObservable();
  }
  // TODO: Replace with PATCH /api/gallery/:id/deactivate
  deactivateItem(id: string): Observable<GalleryItem | undefined> {
    return this.updateItem(id, { active: false });
  }
  // TODO: Replace with DELETE /api/gallery/:id
  deleteItem(id: string): Observable<boolean> {
    const filtered = this.itemsSubject.value.filter((i) => i.id !== id);
    const success = filtered.length < this.itemsSubject.value.length;
    if (success) {
      this.itemsSubject.next(filtered);
      console.log('[GalleryService] deleteItem:', id);
    }
    return new BehaviorSubject(success).asObservable();
  }
}
