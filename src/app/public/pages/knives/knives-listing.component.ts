import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { KnifeApiService, KnifeFilters } from '../../../core/api/knife-api.service';
import { KnifeCardComponent } from '../../components/knife-card/knife-card.component';
import {
  Knife,
  KnifeAvailability,
  KNIFE_AVAILABILITY_VALUES,
} from '../../../core/models/knife.model';
import { parseKnifePrice } from '../../../shared/utils/knife-images.util';

@Component({
  selector: 'app-knives-listing',
  standalone: true,
  imports: [FormsModule, KnifeCardComponent],
  templateUrl: './knives-listing.component.html',
  styleUrl: './knives-listing.component.scss',
})
export class KnivesListingComponent implements OnInit {
  private readonly knifeApi = inject(KnifeApiService);
  private readonly destroyRef = inject(DestroyRef);

  knives = signal<Knife[]>([]);
  categories = signal<string[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  category = signal('');
  availability = signal<KnifeAvailability | ''>('');
  search = signal('');
  maxPrice = signal<number | null>(null);

  readonly availabilities = KNIFE_AVAILABILITY_VALUES;

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.loading.set(true);
    this.error.set(null);
    const filters: KnifeFilters = {
      category: this.category() || undefined,
      availability: this.availability() || undefined,
      search: this.search() || undefined,
    };

    this.knifeApi
      .getKnives(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (knives) => {
          let filtered = knives;
          const max = this.maxPrice();

          if (max != null) {
            filtered = knives.filter((k) => {
              const price = parseKnifePrice(k.price);
              return price === null || price <= max;
            });
          }

          this.knives.set(filtered);
          if (!this.category() && !this.availability() && !this.search()) {
            this.categories.set([...new Set(knives.map((k) => k.category))].sort());
          }
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load knives. Please try again.');
          this.loading.set(false);
        },
      });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.category.set('');
    this.availability.set('');
    this.search.set('');
    this.maxPrice.set(null);
    this.applyFilters();
  }
}
