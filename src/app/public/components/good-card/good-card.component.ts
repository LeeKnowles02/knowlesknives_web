import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Good } from '../../../core/models/good.model';
import {
  AvailabilityLabelPipe,
  AvailabilityBadgePipe,
} from '../../../shared/pipes/availability.pipe';
import { CurrencyZarPipe } from '../../../shared/pipes/currency-zar.pipe';
import { getGoodPrimaryImage } from '../../../shared/utils/good-images.util';
import { resolveProductImage } from '../../../shared/utils/image-fallback.util';

@Component({
  selector: 'app-good-card',
  standalone: true,
  imports: [RouterLink, AvailabilityLabelPipe, AvailabilityBadgePipe, CurrencyZarPipe],
  templateUrl: './good-card.component.html',
  styleUrl: './good-card.component.scss',
})
export class GoodCardComponent {
  @Input({ required: true }) good!: Good;

  get primaryImage(): string {
    return resolveProductImage(getGoodPrimaryImage(this.good));
  }
}
