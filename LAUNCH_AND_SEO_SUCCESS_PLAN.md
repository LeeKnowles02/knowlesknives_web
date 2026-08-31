# Knowles Knives Launch and SEO Success Plan

This document is the practical launch checklist for getting Knowles Knives hosted, discoverable, and ready for real enquiries.

## Current Frontend Status

Implemented in `KnowlesKnivesWeb`:

- Angular 19 runtime SSR on Railway
- Client hydration with HTTP transfer caching
- Central `SeoService` for titles, descriptions, canonicals, robots, Open Graph, Twitter, and JSON-LD
- Canonical domain: `https://knowlesknives.co.za`
- Route-level SEO metadata on all public pages
- Chef/cooking knife relevance on `/knives`
- Dynamic product metadata and Product JSON-LD on knife/good detail pages
- Organization + WebSite JSON-LD on the home page
- `noindex` and HTTP 404 handling for missing pages
- Generated `robots.txt` and `sitemap.xml`
- `/goods` included in sitemap generation
- Skip link, improved alt text, and heading fixes
- Admin routes remain client-rendered and blocked in `robots.txt`

## Railway deployment checklist

1. Build web service with `SITE_URL=https://knowlesknives.co.za`.
2. Start web service with `npm run serve:ssr`.
3. Set API `CLIENT_URL=https://knowlesknives.co.za`.
4. Attach custom domain `knowlesknives.co.za` to the web service.
5. Verify `/health`, `/robots.txt`, and `/sitemap.xml`.
6. Inspect raw HTML for `/`, `/knives`, and at least one knife detail page.
7. Submit sitemap in Google Search Console.

## Search intent covered

The site is positioned for searches such as:

- handmade knives South Africa
- custom knives South Africa
- chef knives / cooking knives / kitchen knives
- laser engraving South Africa
- personalised engraved gifts
- custom knife maker Randburg
- knife making, engraving, and repairs near Johannesburg

Ranking depends on competition, content quality, backlinks, and time — not only technical SEO.

## Manual information still needed

Do not add these until confirmed:

- Street address
- Business phone number
- Opening hours
- Wedding-specific services
- Wooden board product line
- Nationwide shipping policy
- Reviews or ratings

## Google Search Console

After deployment:

1. Verify `https://knowlesknives.co.za`
2. Submit `https://knowlesknives.co.za/sitemap.xml`
3. Inspect `/`, `/knives`, and one product URL
4. Monitor coverage, canonicals, and structured data reports

## Rollback

If SSR causes deployment issues, switch Railway start command back to:

```bash
npm run serve:static
```

This restores the previous static SPA hosting model while keeping the SEO metadata improvements in the client app.
