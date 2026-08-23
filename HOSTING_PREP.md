# Knowles Knives Web Hosting Prep

This project is ready to host as an Angular SSR app. It still expects the API to be available at `/api` in production, or proxied to that path by the hosting setup.

## Code Capsules commands

Use these commands for a Web/Node SSR capsule:

```bash
npm ci
npm run build
npm run serve:ssr
```

If Code Capsules separates build and run commands:

- Build command: `npm ci && npm run build`
- Run command: `npm run serve:ssr`

## Environment variables

Set these before building for the final hosted URL:

```bash
SITE_URL=https://REPLACE_WITH_CODE_CAPSULES_URL
API_URL=https://REPLACE_WITH_CODE_CAPSULES_URL/api
API_ORIGIN=https://REPLACE_WITH_CODE_CAPSULES_URL
```

`SITE_URL` is used to generate `robots.txt`, `sitemap.xml`, canonical URLs, and social preview URLs.

`API_URL` is used only by `scripts/prepare-hosting.cjs` to fetch knife slugs for prerendering. If the API is not live yet, the build still works and prerenders the static public routes.

`API_ORIGIN` is used at runtime by the SSR server to proxy browser and server requests from `/api` to the backend API capsule. Defaults to `http://localhost:5000` for local SSR.

## Generated files

`npm run build` runs `npm run prepare:hosting` first. That script generates:

- `routes.txt` for Angular prerendering
- `public/sitemap.xml`
- `public/robots.txt`

Static routes are always included:

- `/`
- `/knives`
- `/services`
- `/gallery`
- `/about`
- `/contact`
- `/404`

Knife detail routes are added when `API_URL/knives` returns active knife slugs.

## After Code Capsules gives the temporary URL

1. Set `SITE_URL` to the Code Capsules URL.
2. Set `API_URL` to the public API URL.
3. Rebuild so `sitemap.xml`, `robots.txt`, and prerender routes are regenerated.
4. Replace `siteUrl` in `src/environments/environment.prod.ts` if you want the compiled Angular app to use the exact Code Capsules URL for route-level canonical and Open Graph tags.

When a custom domain is added later, repeat the same steps with the real domain.
