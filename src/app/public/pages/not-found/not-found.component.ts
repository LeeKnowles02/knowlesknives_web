import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { HttpStatusService } from '../../../core/services/http-status.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly httpStatus = inject(HttpStatusService);

  ngOnInit(): void {
    this.httpStatus.setStatus(404);
    this.seo.update({
      title: 'Page Not Found | Knowles Knives',
      description:
        'This page could not be found. Browse handmade knives, services, or send an enquiry to Knowles Knives.',
      path: '/404',
      robots: 'noindex, follow',
    });
  }
}
