# Knowles Knives

A premium Angular frontend for **Knowles Knives** — a handcrafted custom knife-making business.

The public site and admin CMS connect to a REST API (`environment.apiUrl`). Gallery content still uses a local mock store until the gallery API is wired up.

## Features

### Public site
- Dark artisan hero, product showcase, services, gallery, about, and enquiry flow
- Knife listing with category, availability, search, and price filters
- Knife detail pages with **Enquire About This Knife** (no buy/pay buttons)
- Reactive enquiry form with knife/service pre-fill via query params
- Prices displayed in South African Rand (ZAR)

### Admin area (`/admin`)
- JWT authentication with route guards and HTTP interceptor
- Dashboard with live stats from the API
- Knife, service, and enquiry management (full CRUD via API)
- Gallery management (local mock store — pending API migration)
- Image upload with drag-to-reposition cropping
- Toast notifications on successful saves

## Tech stack

- Angular 19 (standalone components, signals, lazy routes)
- Angular Router with functional guards and HTTP interceptors
- Reactive Forms
- SCSS with shared design tokens
- Prettier for consistent formatting

## Getting started

### Prerequisites
- Node.js 18+
- Backend API running (default: `http://localhost:5000/api`)

### Install and run

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

Build for production:

```bash
npm run build
```

Format code:

```bash
npm run format
```

### Environment

| File | Purpose |
|------|---------|
| `src/environments/environment.ts` | Development API URL (`http://localhost:5000/api`) |
| `src/environments/environment.prod.ts` | Production API URL — set before deploying |

## Project structure

```
src/app/
├── core/
│   ├── api/             # HTTP services (KnifeApiService, etc.)
│   ├── auth/            # AuthService, guards, interceptor
│   ├── models/          # TypeScript interfaces
│   ├── mock-data/       # Gallery seed data (temporary)
│   └── services/        # GalleryService (mock, pending API)
├── public/
│   ├── components/      # Header, footer, cards
│   ├── layout/          # Public shell
│   └── pages/           # Home, knives, contact, etc.
├── admin/
│   ├── layout/          # Admin sidebar shell + toasts
│   └── pages/           # Dashboard, knives, enquiries, etc.
└── shared/
    ├── components/      # Image picker, toast
    ├── pipes/           # Currency ZAR, availability labels
    └── utils/           # Knife image helpers
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/knives` | Knife listing |
| `/knives/:slug` | Knife details |
| `/services` | Services |
| `/gallery` | Gallery |
| `/about` | About |
| `/contact` | Enquiry form |
| `/admin` | Admin dashboard (auth required) |
| `/admin/login` | Admin login |

## API integration

| Domain | Service | Status |
|--------|---------|--------|
| Knives | `KnifeApiService` | Live |
| Services | `ServiceApiService` | Live |
| Enquiries | `EnquiryApiService` | Live |
| Dashboard | `DashboardApiService` | Live |
| Auth | `AuthService` | Live |
| Uploads | `UploadApiService` | Live |
| Gallery | `GalleryService` | Mock (local state) |

## Design

Colour palette: black, charcoal, warm brown, cream, and steel tones. Brand assets live in `public/assets/images/`.

## Business rules

- **No online payments** — all purchases go through enquiry
- Knives show availability: Available, Reserved, Sold, Made to Order
- Enquiries are submitted to the API and managed in the admin panel
