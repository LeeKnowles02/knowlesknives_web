import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ServiceApiService } from '../../../core/api/service-api.service';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.scss',
})
export class AdminServicesComponent implements OnInit {
  private readonly serviceApi = inject(ServiceApiService);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  services = signal<Service[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.refresh$.pipe(switchMap(() => this.serviceApi.getAdminServices())).subscribe({
      next: (services) => {
        this.services.set(services);
        this.loading.set(false);
        this.error.set(null);
      },
      error: () => {
        this.error.set('Could not load services. Please try again.');
        this.loading.set(false);
      },
    });
  }

  toggleActive(id: number, title: string, active: boolean): void {
    const action = active ? 'deactivate' : 'activate';
    if (confirm(`${active ? 'Deactivate' : 'Activate'} "${title}"?`)) {
      this.serviceApi.toggleServiceActive(id).subscribe({
        next: () => this.refresh$.next(),
        error: () => this.error.set(`Could not ${action} service. Please try again.`),
      });
    }
  }

  delete(id: number, title: string): void {
    if (confirm(`Permanently delete "${title}"?`)) {
      this.serviceApi.deleteService(id).subscribe({
        next: () => this.refresh$.next(),
        error: () => this.error.set('Could not delete service. Please try again.'),
      });
    }
  }
}
