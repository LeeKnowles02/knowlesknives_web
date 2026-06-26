import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './public/layout/public-layout.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout.component';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./public/pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'knives',
        loadComponent: () =>
          import('./public/pages/knives/knives-listing.component').then(
            (m) => m.KnivesListingComponent,
          ),
      },
      {
        path: 'knives/:slug',
        loadComponent: () =>
          import('./public/pages/knife-details/knife-details.component').then(
            (m) => m.KnifeDetailsComponent,
          ),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./public/pages/services/services.component').then((m) => m.ServicesComponent),
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./public/pages/gallery/gallery.component').then((m) => m.GalleryComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./public/pages/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./public/pages/contact/contact.component').then((m) => m.ContactComponent),
      },
    ],
  },
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./admin/pages/admin-login/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/pages/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'knives',
        loadComponent: () =>
          import('./admin/pages/admin-knives/admin-knives.component').then(
            (m) => m.AdminKnivesComponent,
          ),
      },
      {
        path: 'knives/new',
        loadComponent: () =>
          import('./admin/pages/admin-knife-form/admin-knife-form.component').then(
            (m) => m.AdminKnifeFormComponent,
          ),
      },
      {
        path: 'knives/:id/edit',
        loadComponent: () =>
          import('./admin/pages/admin-knife-form/admin-knife-form.component').then(
            (m) => m.AdminKnifeFormComponent,
          ),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./admin/pages/admin-services/admin-services.component').then(
            (m) => m.AdminServicesComponent,
          ),
      },
      {
        path: 'services/new',
        loadComponent: () =>
          import('./admin/pages/admin-service-form/admin-service-form.component').then(
            (m) => m.AdminServiceFormComponent,
          ),
      },
      {
        path: 'services/:id/edit',
        loadComponent: () =>
          import('./admin/pages/admin-service-form/admin-service-form.component').then(
            (m) => m.AdminServiceFormComponent,
          ),
      },
      {
        path: 'enquiries',
        loadComponent: () =>
          import('./admin/pages/admin-enquiries/admin-enquiries.component').then(
            (m) => m.AdminEnquiriesComponent,
          ),
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./admin/pages/admin-gallery/admin-gallery.component').then(
            (m) => m.AdminGalleryComponent,
          ),
      },
      {
        path: 'gallery/new',
        loadComponent: () =>
          import('./admin/pages/admin-gallery-form/admin-gallery-form.component').then(
            (m) => m.AdminGalleryFormComponent,
          ),
      },
      {
        path: 'gallery/:id/edit',
        loadComponent: () =>
          import('./admin/pages/admin-gallery-form/admin-gallery-form.component').then(
            (m) => m.AdminGalleryFormComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
