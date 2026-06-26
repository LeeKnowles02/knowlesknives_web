import { Component, DestroyRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/models/user.model';
import { ToastComponent } from '../../shared/components/toast/toast.component';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  exact: boolean;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, ToastComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  sidebarOpen = signal(false);
  currentUser = signal<User | null>(null);

  readonly overviewNav: NavItem[] = [
    { path: '/admin', label: 'Dashboard', icon: '◫', exact: true },
    { path: '/admin/enquiries', label: 'Enquiries', icon: '✉', exact: false },
  ];

  readonly catalogueNav: NavItem[] = [
    { path: '/admin/knives', label: 'Knives', icon: '⚔', exact: false },
    { path: '/admin/services', label: 'Services', icon: '⚙', exact: false },
  ];

  readonly contentNav: NavItem[] = [
    { path: '/admin/gallery', label: 'Gallery', icon: '▣', exact: false },
  ];

  ngOnInit(): void {
    this.auth.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this.currentUser.set(user));

    if (this.auth.isLoggedIn() && !this.auth.getCurrentUserValue()) {
      this.auth.loadCurrentUserIfLoggedIn();
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('nav-open');
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
    document.body.classList.toggle('nav-open', this.sidebarOpen());
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
    document.body.classList.remove('nav-open');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
