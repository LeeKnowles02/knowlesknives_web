import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KnifeApiService } from '../../../core/api/knife-api.service';
import { ServiceApiService } from '../../../core/api/service-api.service';
import { GalleryService } from '../../../core/services/gallery.service';
import { KnifeCardComponent } from '../../components/knife-card/knife-card.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { Knife } from '../../../core/models/knife.model';
import { Service } from '../../../core/models/service.model';
import { GalleryItem } from '../../../core/models/gallery-item.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, KnifeCardComponent, ServiceCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly knifeApi = inject(KnifeApiService);
  private readonly serviceApi = inject(ServiceApiService);
  private readonly galleryService = inject(GalleryService);

  featuredKnives = signal<Knife[]>([]);
  services = signal<Service[]>([]);
  galleryPreview = signal<GalleryItem[]>([]);
  knivesLoading = signal(true);
  servicesLoading = signal(true);
  knivesError = signal<string | null>(null);
  servicesError = signal<string | null>(null);

  ngOnInit(): void {
    this.knifeApi.getKnives({ featured: true }).subscribe({
      next: (knives) => {
        this.featuredKnives.set(knives);
        this.knivesLoading.set(false);
      },
      error: () => {
        this.knivesError.set('Could not load featured knives. Please try again.');
        this.knivesLoading.set(false);
      },
    });
    this.serviceApi.getServices({ active: true }).subscribe({
      next: (services) => {
        this.services.set(services);
        this.servicesLoading.set(false);
      },
      error: () => {
        this.servicesError.set('Could not load services. Please try again.');
        this.servicesLoading.set(false);
      },
    });
    this.galleryService.getPreview(4).subscribe((items) => this.galleryPreview.set(items));
  }
}
