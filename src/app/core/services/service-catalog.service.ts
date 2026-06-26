import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Service } from '../models/service.model';
import { MOCK_SERVICES } from '../mock-data/services.mock';

@Injectable({ providedIn: 'root' })
export class ServiceCatalogService {
  // TODO: Replace BehaviorSubject with HTTP client when API is connected
  private readonly servicesSubject = new BehaviorSubject<Service[]>([...MOCK_SERVICES]);
  readonly services$ = this.servicesSubject.asObservable();
  /** All services (admin) */
  getServices(): Observable<Service[]> {
    return this.services$;
  }
  getAll(): Observable<Service[]> {
    return this.getServices();
  }
  /** Active services only (public site) */
  getActive(): Observable<Service[]> {
    return this.services$.pipe(map((list) => list.filter((s) => s.active)));
  }
  // TODO: Replace with HTTP GET /api/services/:id
  getServiceById(id: string): Observable<Service | undefined> {
    return this.services$.pipe(map((list) => list.find((s) => s.id === id)));
  }
  getById(id: string): Observable<Service | undefined> {
    return this.getServiceById(id);
  }
  getBySlug(slug: string): Observable<Service | undefined> {
    return this.services$.pipe(map((list) => list.find((s) => s.slug === slug)));
  }
  getCount(): number {
    return this.servicesSubject.value.filter((s) => s.active).length;
  }
  // TODO: Replace with POST /api/services
  addService(service: Omit<Service, 'id'>): Observable<Service> {
    const newService: Service = { ...service, id: String(Date.now()) };
    this.servicesSubject.next([...this.servicesSubject.value, newService]);
    console.log('[ServiceCatalogService] addService:', newService);
    return new BehaviorSubject(newService).asObservable();
  }
  // TODO: Replace with PUT /api/services/:id
  updateService(id: string, updates: Partial<Service>): Observable<Service | undefined> {
    const list = this.servicesSubject.value;
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) return new BehaviorSubject(undefined).asObservable();
    const updated = { ...list[index], ...updates, id };
    const newList = [...list];
    newList[index] = updated;
    this.servicesSubject.next(newList);
    console.log('[ServiceCatalogService] updateService:', updated);
    return new BehaviorSubject(updated).asObservable();
  }
  // TODO: Replace with PATCH /api/services/:id/deactivate
  deactivateService(id: string): Observable<Service | undefined> {
    return this.updateService(id, { active: false });
  }
  // TODO: Replace with DELETE /api/services/:id
  deleteService(id: string): Observable<boolean> {
    const filtered = this.servicesSubject.value.filter((s) => s.id !== id);
    const success = filtered.length < this.servicesSubject.value.length;
    if (success) {
      this.servicesSubject.next(filtered);
      console.log('[ServiceCatalogService] deleteService:', id);
    }
    return new BehaviorSubject(success).asObservable();
  }
}
