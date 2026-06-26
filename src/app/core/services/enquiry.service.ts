import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Enquiry, EnquiryStatus } from '../models/enquiry.model';
import { MOCK_ENQUIRIES } from '../mock-data/enquiries.mock';

@Injectable({ providedIn: 'root' })
export class EnquiryService {
  // TODO: Replace BehaviorSubject with HTTP client when API is connected
  private readonly enquiriesSubject = new BehaviorSubject<Enquiry[]>([...MOCK_ENQUIRIES]);
  readonly enquiries$ = this.enquiriesSubject.asObservable();
  getAll(): Observable<Enquiry[]> {
    return this.enquiries$;
  }
  getById(id: string): Observable<Enquiry | undefined> {
    return this.enquiries$.pipe(map((list) => list.find((e) => e.id === id)));
  }
  getPendingCount(): Observable<number> {
    return this.enquiries$.pipe(map((list) => list.filter((e) => e.status === 'new').length));
  }
  // TODO: Replace with POST /api/enquiries
  submitEnquiry(enquiry: Omit<Enquiry, 'id' | 'status' | 'createdAt'>): Observable<Enquiry> {
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: String(Date.now()),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    const updated = [newEnquiry, ...this.enquiriesSubject.value];
    this.enquiriesSubject.next(updated);
    console.log('[EnquiryService] submitEnquiry:', newEnquiry);
    return new BehaviorSubject(newEnquiry).asObservable();
  }
  // TODO: Replace with PATCH /api/enquiries/:id/status
  updateStatus(id: string, status: EnquiryStatus): Observable<Enquiry | undefined> {
    const list = this.enquiriesSubject.value;
    const index = list.findIndex((e) => e.id === id);
    if (index === -1) return new BehaviorSubject(undefined).asObservable();
    const updated = { ...list[index], status };
    const newList = [...list];
    newList[index] = updated;
    this.enquiriesSubject.next(newList);
    console.log('[EnquiryService] updateStatus:', id, status);
    return new BehaviorSubject(updated).asObservable();
  }
}
