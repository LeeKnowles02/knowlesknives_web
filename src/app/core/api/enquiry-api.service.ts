import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { Enquiry, EnquiryPayload, EnquiryStatus } from '../models/enquiry.model';

export interface EnquiryFilters {
  status?: EnquiryStatus;
  enquiryType?: string;
}

@Injectable({ providedIn: 'root' })
export class EnquiryApiService {
  private readonly api = inject(ApiClientService);
  createEnquiry(payload: EnquiryPayload): Observable<Enquiry> {
    return this.api.post<Enquiry>('/enquiries', payload);
  }
  getAdminEnquiries(filters?: EnquiryFilters): Observable<Enquiry[]> {
    return this.api.get<Enquiry[]>('/admin/enquiries', {
      status: filters?.status,
      enquiryType: filters?.enquiryType,
    });
  }
  getAdminEnquiryById(id: number): Observable<Enquiry> {
    return this.api.get<Enquiry>(`/admin/enquiries/${id}`);
  }
  updateEnquiryStatus(id: number, status: EnquiryStatus): Observable<Enquiry> {
    return this.api.patch<Enquiry>(`/admin/enquiries/${id}/status`, { status });
  }
  deleteEnquiry(id: number): Observable<void> {
    return this.api.delete<void>(`/admin/enquiries/${id}`);
  }
}
