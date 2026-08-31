import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, PublicHeaderComponent, PublicFooterComponent],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <app-public-header />
    <main id="main-content" class="public-main">
      <router-outlet />
    </main>
    <app-public-footer />
  `,
  styles: [
    `
      .skip-link {
        position: absolute;
        left: -9999px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
        z-index: 9999;
      }

      .skip-link:focus {
        left: 1rem;
        top: 1rem;
        width: auto;
        height: auto;
        overflow: visible;
        padding: 0.5rem 1rem;
        background: #141414;
        color: #fff;
        text-decoration: none;
      }

      .public-main {
        min-height: 100svh;
        padding-top: 68px;
      }
    `,
  ],
})
export class PublicLayoutComponent {}
