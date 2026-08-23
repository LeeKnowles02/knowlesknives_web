import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { GoodApiService, GoodFilters } from '../../../core/api/good-api.service';
import { GoodCardComponent } from '../../components/good-card/good-card.component';
import {
  Good,
  GoodAvailability,
  GOOD_AVAILABILITY_VALUES,
} from '../../../core/models/good.model';
import { parseGoodPrice } from '../../../shared/utils/good-images.util';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-goods-listing',
  standalone: true,
  imports: [FormsModule, GoodCardComponent],
  templateUrl: './goods-listing.component.html',
  styleUrl: './goods-listing.component.scss',
})
export class GoodsListingComponent implements OnInit {
  private readonly goodApi = inject(GoodApiService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  goods = signal<Good[]>([]);
  categories = signal<string[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  category = signal('');
  availability = signal<GoodAvailability | ''>('');
  search = signal('');
  maxPrice = signal<number | null>(null);

  readonly availabilities = GOOD_AVAILABILITY_VALUES;

  ngOnInit(): void {
    this.seo.update({
      title: 'Engraved & Handcrafted Goods | Knowles Knives',
      description:
        'Browse engraved and handcrafted goods from Knowles Knives — personalised pieces and workshop-made items. Enquire about availability.',
      path: '/goods',
    });
    this.applyFilters();
  }

  applyFilters(): void {
    this.loading.set(true);
    this.error.set(null);
    const filters: GoodFilters = {
      category: this.category() || undefined,
      availability: this.availability() || undefined,
      search: this.search() || undefined,
    };

    this.goodApi
      .getGoods(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (goods) => {
          let filtered = goods;
          const max = this.maxPrice();

          if (max != null) {
            filtered = goods.filter((g) => {
              const price = parseGoodPrice(g.price);
              return price === null || price <= max;
            });
          }

          this.goods.set(filtered);
          if (!this.category() && !this.availability() && !this.search()) {
            this.categories.set([...new Set(goods.map((g) => g.category))].sort());
          }
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load goods. Please try again.');
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
