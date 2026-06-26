import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Knife, KnifeAvailability, KnifeCategory } from '../models/knife.model';
import { MOCK_KNIVES } from '../mock-data/knives.mock';

export interface KnifeFilters {
  category?: KnifeCategory | '';
  availability?: KnifeAvailability | '';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable({ providedIn: 'root' })
export class KnifeService {
  // TODO: Replace BehaviorSubject with HTTP client when API is connected
  private readonly knivesSubject = new BehaviorSubject<Knife[]>([...MOCK_KNIVES]);
  readonly knives$ = this.knivesSubject.asObservable();
  getAll(): Observable<Knife[]> {
    return this.knives$;
  }
  getFeatured(): Observable<Knife[]> {
    return this.knives$.pipe(map((knives) => knives.filter((k) => k.featured)));
  }
  getById(id: string): Observable<Knife | undefined> {
    return this.knives$.pipe(map((knives) => knives.find((k) => k.id === id)));
  }
  getFiltered(filters: KnifeFilters): Observable<Knife[]> {
    return this.knives$.pipe(
      map((knives) => {
        let result = [...knives];
        if (filters.category) {
          result = result.filter((k) => k.category === filters.category);
        }
        if (filters.availability) {
          result = result.filter((k) => k.availability === filters.availability);
        }
        if (filters.search?.trim()) {
          const term = filters.search.toLowerCase();
          result = result.filter(
            (k) =>
              k.name.toLowerCase().includes(term) ||
              k.shortDescription.toLowerCase().includes(term) ||
              k.steelType.toLowerCase().includes(term),
          );
        }
        if (filters.minPrice != null) {
          result = result.filter((k) => k.price != null && k.price >= filters.minPrice!);
        }
        if (filters.maxPrice != null) {
          result = result.filter((k) => k.price != null && k.price <= filters.maxPrice!);
        }
        return result;
      }),
    );
  }
  // TODO: Replace with POST /api/knives
  addKnife(knife: Omit<Knife, 'id'>): Observable<Knife> {
    const newKnife: Knife = {
      ...knife,
      id: this.generateId(),
    };
    const updated = [...this.knivesSubject.value, newKnife];
    this.knivesSubject.next(updated);
    console.log('[KnifeService] addKnife:', newKnife);
    return new BehaviorSubject(newKnife).asObservable();
  }
  // TODO: Replace with PUT /api/knives/:id
  updateKnife(id: string, updates: Partial<Knife>): Observable<Knife | undefined> {
    const knives = this.knivesSubject.value;
    const index = knives.findIndex((k) => k.id === id);
    if (index === -1) return new BehaviorSubject(undefined).asObservable();
    const updated = { ...knives[index], ...updates, id };
    const newList = [...knives];
    newList[index] = updated;
    this.knivesSubject.next(newList);
    console.log('[KnifeService] updateKnife:', updated);
    return new BehaviorSubject(updated).asObservable();
  }
  // TODO: Replace with DELETE /api/knives/:id
  deleteKnife(id: string): Observable<boolean> {
    const filtered = this.knivesSubject.value.filter((k) => k.id !== id);
    const success = filtered.length < this.knivesSubject.value.length;
    if (success) {
      this.knivesSubject.next(filtered);
      console.log('[KnifeService] deleteKnife:', id);
    }
    return new BehaviorSubject(success).asObservable();
  }
  getStats(): Observable<{ total: number; available: number; sold: number }> {
    return this.knives$.pipe(
      map((knives) => ({
        total: knives.length,
        available: knives.filter((k) => k.availability === 'available').length,
        sold: knives.filter((k) => k.availability === 'sold').length,
      })),
    );
  }
  private generateId(): string {
    return String(Date.now());
  }
}
