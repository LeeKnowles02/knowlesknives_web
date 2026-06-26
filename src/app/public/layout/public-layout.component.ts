import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, PublicHeaderComponent, PublicFooterComponent],
  template: `
    <app-public-header />
    <main class="public-main">
      <router-outlet />
    </main>
    <app-public-footer />
  `,
  styles: [
    `
      .public-main {
        min-height: 100svh;
        padding-top: 68px;
      }
    `,
  ],
})
export class PublicLayoutComponent {}
