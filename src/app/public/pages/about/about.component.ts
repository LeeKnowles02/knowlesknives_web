import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'About Knowles Knives | Handcrafted Workshop near Randburg',
      description:
        'Handcrafted knife-making workshop based near Randburg. Custom blades, hand finishing, and bespoke commissions serving Johannesburg.',
      path: '/about',
      image: 'assets/images/workshop.jpg',
    });
  }
}
