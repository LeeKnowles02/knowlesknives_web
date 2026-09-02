import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Service } from '../../../core/models/service.model';
import { resolveProductImage } from '../../../shared/utils/image-fallback.util';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
})
export class ServiceCardComponent {
  @Input({ required: true }) service!: Service;

  imageUrl(): string {
    return resolveProductImage(this.service.imageUrl);
  }
}
