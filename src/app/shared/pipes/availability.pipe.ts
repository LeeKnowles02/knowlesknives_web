import { Pipe, PipeTransform } from '@angular/core';
import { KnifeAvailability } from '../../core/models/knife.model';

@Pipe({ name: 'availabilityLabel', standalone: true })
export class AvailabilityLabelPipe implements PipeTransform {
  transform(value: KnifeAvailability | string): string {
    return value ?? '';
  }
}

@Pipe({ name: 'availabilityBadge', standalone: true })
export class AvailabilityBadgePipe implements PipeTransform {
  transform(value: KnifeAvailability | string): string {
    const map: Record<string, string> = {
      Available: 'available',
      Reserved: 'reserved',
      Sold: 'sold',
      'Made to Order': 'made-to-order',
    };
    return map[value] ?? 'available';
  }
}
