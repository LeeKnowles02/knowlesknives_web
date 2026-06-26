import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, switchMap } from 'rxjs';
import { EnquiryApiService } from '../../../core/api/enquiry-api.service';
import { Enquiry, EnquiryStatus, ENQUIRY_STATUS_VALUES } from '../../../core/models/enquiry.model';

@Component({
  selector: 'app-admin-enquiries',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-enquiries.component.html',
  styleUrl: './admin-enquiries.component.scss',
})
export class AdminEnquiriesComponent implements OnInit {
  private readonly enquiryApi = inject(EnquiryApiService);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  enquiries = signal<Enquiry[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  readonly statusOptions = ENQUIRY_STATUS_VALUES;

  ngOnInit(): void {
    this.refresh$.pipe(switchMap(() => this.enquiryApi.getAdminEnquiries())).subscribe({
      next: (enquiries) => {
        this.enquiries.set(enquiries);
        this.loading.set(false);
        this.error.set(null);
      },
      error: () => {
        this.error.set('Could not load enquiries. Please try again.');
        this.loading.set(false);
      },
    });
  }

  updateStatus(id: number, status: EnquiryStatus): void {
    this.enquiryApi.updateEnquiryStatus(id, status).subscribe({
      next: () => this.refresh$.next(),
      error: () => this.error.set('Could not update enquiry status. Please try again.'),
    });
  }

  statusBadgeClass(status: EnquiryStatus): string {
    return status.toLowerCase();
  }
  knifeName(enquiry: Enquiry): string | null {
    return enquiry.selectedKnifeName ?? enquiry.selectedKnife?.name ?? null;
  }
  serviceName(enquiry: Enquiry): string | null {
    return enquiry.selectedServiceName ?? enquiry.selectedService?.title ?? null;
  }
}
