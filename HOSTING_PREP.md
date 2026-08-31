# Knowles Knives Web Hosting Prep

This project deploys as an Angular 19 runtime SSR app on Railway. The API remains a separate Railway service.

## Railway commands

```bash
npm ci
npm run build
npm run serve:ssr
```

- Build command: `npm ci && npm run build`
- Start command: `npm run serve:ssr`
- Health check path: `/health`
- Rollback command: `npm run serve:static`

## Environment variables

Set these on the **web** Railway service before building:

```bash
SITE_URL=https://knowlesknives.co.za
API_URL=https://knowlesknivesapi-production.up.railway.app/api
```

Set these on the **API** Railway service:

```bash
CLIENT_URL=https://knowlesknives.co.za
```

During domain cutover, both origins can be allowed:

```bash
CLIENT_URLS=https://knowlesknives.co.za,https://soothing-celebration-production-c6df.up.railway.app
```

`SITE_URL` is used to generate `robots.txt`, `sitemap.xml`, canonical URLs, and social preview URLs.

`API_URL` is used by `scripts/prepare-hosting.cjs` to fetch active knife and goods slugs for the sitemap.

## Generated files

`npm run build` runs `npm run prepare:hosting` first. That script generates:

- `routes.txt`
- `public/sitemap.xml`
- `public/robots.txt`

Static routes always included:

- `/`
- `/knives`
- `/goods`
- `/services`
- `/gallery`
- `/about`
- `/contact`
- `/404`

Knife and goods detail routes are added when the API returns active slugs.

## Custom domain setup

1. Point `knowlesknives.co.za` to the Railway web service.
2. Redirect `www.knowlesknives.co.za` to the apex domain in Railway.
3. Set `SITE_URL=https://knowlesknives.co.za` and rebuild the web service.
4. Set `CLIENT_URL=https://knowlesknives.co.za` on the API service.
5. Submit `https://knowlesknives.co.za/sitemap.xml` in Google Search Console.

The SSR server also redirects the old Railway frontend hostname and `www` to the apex domain.

## Local SSR verification

```bash
npm run build
npm run serve:ssr
```

Then inspect raw HTML for public routes:

- `/`
- `/knives`
- `/knives/<slug>`
- `/404`

Confirm title, description, canonical, robots, Open Graph tags, and JSON-LD are present in the server response.
