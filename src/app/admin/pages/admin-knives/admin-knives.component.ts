import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { KnifeApiService } from '../../../core/api/knife-api.service';
import { Knife } from '../../../core/models/knife.model';
import {
  AvailabilityLabelPipe,
  AvailabilityBadgePipe,
} from '../../../shared/pipes/availability.pipe';
import { CurrencyZarPipe } from '../../../shared/pipes/currency-zar.pipe';
import { getKnifePrimaryImage } from '../../../shared/utils/knife-images.util';

@Component({
  selector: 'app-admin-knives',
  standalone: true,
  imports: [RouterLink, AvailabilityLabelPipe, AvailabilityBadgePipe, CurrencyZarPipe],
  templateUrl: './admin-knives.component.html',
  styleUrl: './admin-knives.component.scss',
})
export class AdminKnivesComponent implements OnInit {
  private readonly knifeApi = inject(KnifeApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  knives = signal<Knife[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.refresh$
      .pipe(
        switchMap(() => this.knifeApi.getAdminKnives()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (knives) => {
          this.knives.set(knives);
          this.loading.set(false);
          this.error.set(null);
        },
        error: () => {
          this.error.set('Could not load knives. Please try again.');
          this.loading.set(false);
        },
      });
  }

  primaryImage(knife: Knife): string | null {
    return getKnifePrimaryImage(knife);
  }

  featuredCount(): number {
    return this.knives().filter((knife) => knife.featured && knife.active).length;
  }

  viewKnife(knife: Knife): void {
    window.open(`/knives/${knife.slug}`, '_blank');
  }

  deleteKnife(id: number, name: string): void {
    if (confirm(`Delete "${name}"?`)) {
      this.loading.set(true);
      this.knifeApi
        .deleteKnife(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.refresh$.next(),
          error: () => {
            this.error.set('Could not delete knife. Please try again.');
            this.loading.set(false);
          },
        });
    }
  }
}
