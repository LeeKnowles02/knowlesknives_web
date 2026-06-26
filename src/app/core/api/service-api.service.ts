import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { Service, ServicePayload } from '../models/service.model';

export interface ServiceFilters {
  featured?: boolean;
  active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ServiceApiService {
  private readonly api = inject(ApiClientService);
  getServices(filters?: ServiceFilters): Observable<Service[]> {
    return this.api.get<Service[]>('/services', {
      featured: filters?.featured,
      active: filters?.active,
    });
  }
  getServiceBySlug(slug: string): Observable<Service> {
    return this.api.get<Service>(`/services/${slug}`);
  }
  getAdminServices(): Observable<Service[]> {
    return this.api.get<Service[]>('/admin/services');
  }
  getAdminServiceById(id: number): Observable<Service> {
    return this.api.get<Service>(`/admin/services/${id}`);
  }
  createService(payload: ServicePayload): Observable<Service> {
    return this.api.post<Service>('/admin/services', payload);
  }
  updateService(id: number, payload: ServicePayload): Observable<Service> {
    return this.api.put<Service>(`/admin/services/${id}`, payload);
  }
  deleteService(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/services/${id}`);
  }
  toggleServiceActive(id: number): Observable<Service> {
    return this.api.patch<Service>(`/admin/services/${id}/toggle-active`, {});
  }
}
