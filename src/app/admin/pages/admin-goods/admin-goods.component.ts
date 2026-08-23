import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { GoodApiService } from '../../../core/api/good-api.service';
import { Good } from '../../../core/models/good.model';
import {
  AvailabilityLabelPipe,
  AvailabilityBadgePipe,
} from '../../../shared/pipes/availability.pipe';
import { CurrencyZarPipe } from '../../../shared/pipes/currency-zar.pipe';
import { getGoodPrimaryImage } from '../../../shared/utils/good-images.util';

@Component({
  selector: 'app-admin-goods',
  standalone: true,
  imports: [RouterLink, AvailabilityLabelPipe, AvailabilityBadgePipe, CurrencyZarPipe],
  templateUrl: './admin-goods.component.html',
  styleUrl: './admin-goods.component.scss',
})
export class AdminGoodsComponent implements OnInit {
  private readonly goodApi = inject(GoodApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  goods = signal<Good[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.refresh$
      .pipe(
        switchMap(() => this.goodApi.getAdminGoods()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (goods) => {
          this.goods.set(goods);
          this.loading.set(false);
          this.error.set(null);
        },
        error: () => {
          this.error.set('Could not load goods. Please try again.');
          this.loading.set(false);
        },
      });
  }

  primaryImage(good: Good): string | null {
    return getGoodPrimaryImage(good);
  }

  featuredCount(): number {
    return this.goods().filter((good) => good.featured && good.active).length;
  }

  viewGood(good: Good): void {
    window.open(`/goods/${good.slug}`, '_blank');
  }

  deleteGood(id: number, name: string): void {
    if (confirm(`Delete "${name}"?`)) {
      this.loading.set(true);
      this.goodApi
        .deleteGood(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.refresh$.next(),
          error: () => {
            this.error.set('Could not delete good. Please try again.');
            this.loading.set(false);
          },
        });
    }
  }
}
