import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceApiService } from '../../../core/api/service-api.service';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements OnInit {
  private readonly serviceApi = inject(ServiceApiService);

  services = signal<Service[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.serviceApi.getServices({ active: true }).subscribe({
      next: (services) => {
        this.services.set(services);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load services. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
