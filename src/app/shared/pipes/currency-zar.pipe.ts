import { Pipe, PipeTransform } from '@angular/core';
import { parseKnifePrice } from '../utils/knife-images.util';

@Pipe({ name: 'currencyZar', standalone: true })
export class CurrencyZarPipe implements PipeTransform {
  transform(value: number | string | undefined | null): string {
    const num = parseKnifePrice(value ?? null);
    if (num == null) return 'Price on enquiry';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(num);
  }
}
