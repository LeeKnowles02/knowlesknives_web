import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { Knife, KnifeAvailability, KnifePayload } from '../models/knife.model';

export interface KnifeFilters {
  category?: string;
  availability?: KnifeAvailability;
  search?: string;
  featured?: boolean;
}

@Injectable({ providedIn: 'root' })
export class KnifeApiService {
  private readonly api = inject(ApiClientService);
  getKnives(filters?: KnifeFilters): Observable<Knife[]> {
    return this.api.get<Knife[]>('/knives', {
      category: filters?.category,
      availability: filters?.availability,
      search: filters?.search,
      featured: filters?.featured,
    });
  }
  getKnifeBySlug(slug: string): Observable<Knife> {
    return this.api.get<Knife>(`/knives/${slug}`);
  }
  getAdminKnives(): Observable<Knife[]> {
    return this.api.get<Knife[]>('/admin/knives');
  }
  getAdminKnifeById(id: number): Observable<Knife> {
    return this.api.get<Knife>(`/admin/knives/${id}`);
  }
  createKnife(payload: KnifePayload): Observable<Knife> {
    return this.api.post<Knife>('/admin/knives', payload);
  }
  updateKnife(id: number, payload: KnifePayload): Observable<Knife> {
    return this.api.put<Knife>(`/admin/knives/${id}`, payload);
  }
  deleteKnife(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/knives/${id}`);
  }
  updateKnifeStatus(id: number, availability: KnifeAvailability): Observable<Knife> {
    return this.api.patch<Knife>(`/admin/knives/${id}/status`, {
      availability,
    });
  }
}
