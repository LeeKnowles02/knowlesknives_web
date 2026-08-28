import { Pipe, PipeTransform } from '@angular/core';
import { KnifeAvailability } from '../../core/models/knife.model';

export function availabilityFilterLabel(value: KnifeAvailability | string): string {
  if (value === 'Made to Order') {
    return 'By order';
  }

  return value ?? '';
}

@Pipe({ name: 'availabilityLabel', standalone: true })
export class AvailabilityLabelPipe implements PipeTransform {
  transform(value: KnifeAvailability | string): string {
    return value ?? '';
  }
}

@Pipe({ name: 'availabilityFilterLabel', standalone: true })
export class AvailabilityFilterLabelPipe implements PipeTransform {
  transform(value: KnifeAvailability | string): string {
    return availabilityFilterLabel(value);
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
