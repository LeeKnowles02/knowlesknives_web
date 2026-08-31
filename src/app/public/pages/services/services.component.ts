import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ServiceApiService } from '../../../core/api/service-api.service';
import { Service } from '../../../core/models/service.model';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements OnInit {
  private readonly serviceApi = inject(ServiceApiService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  services = signal<Service[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.seo.update({
      title: 'Knife Making, Engraving & Repairs | Knowles Knives',
      description:
        'Custom knife commissions, laser engraving, repairs, sharpening, and knife-making courses near Randburg and Johannesburg. By appointment.',
      path: '/services',
    });

    this.serviceApi
      .getServices({ active: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
