import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss',
})
export class PublicHeaderComponent implements OnDestroy {
  menuOpen = signal(false);

  readonly navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/knives', label: 'Knives', exact: false },
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
    document.body.classList.remove('nav-open');
  }

  private syncBodyScroll(): void {
    document.body.classList.toggle('nav-open', this.menuOpen());
  }
}
