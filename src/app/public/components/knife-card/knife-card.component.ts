import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Knife } from '../../../core/models/knife.model';
import {
  AvailabilityLabelPipe,
  AvailabilityBadgePipe,
} from '../../../shared/pipes/availability.pipe';

import { CurrencyZarPipe } from '../../../shared/pipes/currency-zar.pipe';
import { getKnifePrimaryImage } from '../../../shared/utils/knife-images.util';
import { resolveProductImage } from '../../../shared/utils/image-fallback.util';

@Component({
  selector: 'app-knife-card',
  standalone: true,
  imports: [RouterLink, AvailabilityLabelPipe, AvailabilityBadgePipe, CurrencyZarPipe],
  templateUrl: './knife-card.component.html',
  styleUrl: './knife-card.component.scss',
})
export class KnifeCardComponent {
  @Input({ required: true }) knife!: Knife;
  get primaryImage(): string {
    return resolveProductImage(getKnifePrimaryImage(this.knife));
  }
}
