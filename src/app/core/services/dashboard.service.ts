import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { DashboardStats } from '../models/dashboard-stats.model';
import { KnifeService } from './knife.service';
import { EnquiryService } from './enquiry.service';
import { ServiceCatalogService } from './service-catalog.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    private knifeService: KnifeService,
    private enquiryService: EnquiryService,
    private serviceCatalog: ServiceCatalogService,
  ) {}
  // TODO: Replace with HTTP GET /api/admin/dashboard when API is connected
  getStats(): Observable<DashboardStats> {
    return combineLatest([
      this.knifeService.getStats(),
      this.enquiryService.getPendingCount(),
    ]).pipe(
      map(([knifeStats, pendingEnquiries]) => ({
        totalKnives: knifeStats.total,
        availableKnives: knifeStats.available,
        soldKnives: knifeStats.sold,
        pendingEnquiries,
        servicesListed: this.serviceCatalog.getCount(),
      })),
    );
  }
}
