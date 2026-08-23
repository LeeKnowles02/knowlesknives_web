import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { Good, GoodAvailability, GoodPayload } from '../models/good.model';

export interface GoodFilters {
  category?: string;
  availability?: GoodAvailability;
  search?: string;
  featured?: boolean;
}

@Injectable({ providedIn: 'root' })
export class GoodApiService {
  private readonly api = inject(ApiClientService);

  getGoods(filters?: GoodFilters): Observable<Good[]> {
    return this.api.get<Good[]>('/goods', {
      category: filters?.category,
      availability: filters?.availability,
      search: filters?.search,
      featured: filters?.featured,
    });
  }

  getGoodBySlug(slug: string): Observable<Good> {
    return this.api.get<Good>(`/goods/${slug}`);
  }

  getAdminGoods(): Observable<Good[]> {
    return this.api.get<Good[]>('/admin/goods');
  }

  getAdminGoodById(id: number): Observable<Good> {
    return this.api.get<Good>(`/admin/goods/${id}`);
  }

  createGood(payload: GoodPayload): Observable<Good> {
    return this.api.post<Good>('/admin/goods', payload);
  }

  updateGood(id: number, payload: GoodPayload): Observable<Good> {
    return this.api.put<Good>(`/admin/goods/${id}`, payload);
  }

  deleteGood(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/goods/${id}`);
  }

  updateGoodStatus(id: number, availability: GoodAvailability): Observable<Good> {
    return this.api.patch<Good>(`/admin/goods/${id}/status`, {
      availability,
    });
  }
}
