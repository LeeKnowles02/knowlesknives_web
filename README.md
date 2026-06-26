# Knowles Knives

A premium Angular frontend for **Knowles Knives** — a handcrafted custom knife-making business.

This is a **frontend-only** demo with mock data and services. No backend, payments, or authentication yet. The architecture is designed so API integration can be added later with minimal changes.

## Features

### Public site
- Dark artisan hero, product showcase, services, gallery, about, and enquiry flow
- Knife listing with category, availability, search, and price filters
- Knife detail pages with **Enquire About This Knife** (no buy/pay buttons)
- Reactive enquiry form with knife/service pre-fill via query params

### Admin area (`/admin`)
- Dashboard with mock stats
- Knife list with view/edit/delete (local mock state)
- Add/edit knife form
- Enquiry management with status updates
- Services and gallery overview (read-only placeholders)

## Tech stack

- Angular 19 (standalone components)
- Angular Router with lazy-loaded routes
- Reactive Forms
- SCSS with shared design tokens
- Mock services using `BehaviorSubject` (ready to swap for HTTP)

## Getting started

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

Build for production:

```bash
npm run build
```

## Project structure

```
src/app/
├── core/
│   ├── models/          # TypeScript interfaces
│   ├── mock-data/       # Seed data
│   └── services/        # Data services (TODO: replace with HTTP)
├── public/
│   ├── components/      # Header, footer, cards
│   ├── layout/          # Public shell
│   └── pages/           # Home, knives, contact, etc.
├── admin/
│   ├── layout/          # Admin sidebar shell
│   └── pages/           # Dashboard, knives, enquiries
└── shared/
    └── pipes/           # Currency, availability labels
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/knives` | Knife listing |
| `/knives/:id` | Knife details |
| `/services` | Services |
| `/gallery` | Gallery |
| `/about` | About |
| `/contact` | Enquiry form |
| `/admin` | Admin dashboard |

## API integration (future)

Services include `TODO` comments where HTTP calls should replace mock logic:

- `KnifeService` — CRUD for knives
- `EnquiryService` — submit and update enquiries
- `ServiceCatalogService` / `GalleryService` — read catalog data
- `DashboardService` — admin stats

Add `provideHttpClient()` in `app.config.ts` and an `AuthGuard` on `/admin` routes when ready.

## Design

Colour palette: black, charcoal, warm brown, cream, and steel tones. Placeholder images live in `public/assets/images/` as SVG gradients until real photography is added.

## Business rules

- **No online payments** — all purchases go through enquiry
- Knives show availability: Available, Reserved, Sold, Made to Order
- Enquiries are logged to the console and stored in mock state
