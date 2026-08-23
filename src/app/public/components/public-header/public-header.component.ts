import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss',
})
export class PublicHeaderComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  menuOpen = signal(false);

  readonly navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/knives', label: 'Knives', exact: false },
    { path: '/goods', label: 'Goods', exact: false },
    { path: '/services', label: 'Services', exact: false },
    { path: '/gallery', label: 'Gallery', exact: false },
    { path: '/about', label: 'About', exact: false },
    { path: '/contact', label: 'Enquire', exact: false },
  ];

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    this.syncBodyScroll();
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.syncBodyScroll();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.body.classList.remove('nav-open');
  }

  private syncBodyScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.body.classList.toggle('nav-open', this.menuOpen());
  }
}
