import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { GalleryItem } from '../models/gallery-item.model';
import { MOCK_GALLERY } from '../mock-data/gallery.mock';

/** Local mock gallery store until GalleryApiService is wired to the backend. */
@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly itemsSubject = new BehaviorSubject<GalleryItem[]>([...MOCK_GALLERY]);
  readonly items$ = this.itemsSubject.asObservable();

  getAll(): Observable<GalleryItem[]> {
    return this.items$;
  }

  getActive(): Observable<GalleryItem[]> {
    return this.items$.pipe(map((items) => items.filter((i) => i.active)));
  }

  getPreview(count = 4): Observable<GalleryItem[]> {
    return this.getActive().pipe(map((items) => items.slice(0, count)));
  }

  getById(id: string): Observable<GalleryItem | undefined> {
    return this.items$.pipe(map((items) => items.find((i) => i.id === id)));
  }

  addItem(item: Omit<GalleryItem, 'id'>): Observable<GalleryItem> {
    const newItem: GalleryItem = { ...item, id: String(Date.now()) };
    this.itemsSubject.next([...this.itemsSubject.value, newItem]);
    return new BehaviorSubject(newItem).asObservable();
  }

  updateItem(id: string, updates: Partial<GalleryItem>): Observable<GalleryItem | undefined> {
    const list = this.itemsSubject.value;
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) return new BehaviorSubject(undefined).asObservable();
    const updated = { ...list[index], ...updates, id };
    const newList = [...list];
    newList[index] = updated;
    this.itemsSubject.next(newList);
    return new BehaviorSubject(updated).asObservable();
  }

  deactivateItem(id: string): Observable<GalleryItem | undefined> {
    return this.updateItem(id, { active: false });
  }

  deleteItem(id: string): Observable<boolean> {
    const filtered = this.itemsSubject.value.filter((i) => i.id !== id);
    const success = filtered.length < this.itemsSubject.value.length;
    if (success) {
      this.itemsSubject.next(filtered);
    }
    return new BehaviorSubject(success).asObservable();
  }
}
