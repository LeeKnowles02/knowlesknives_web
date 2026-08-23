# Knowles Knives Launch and SEO Success Plan

This document is the practical launch checklist for getting Knowles Knives hosted, discoverable, and ready for real enquiries. The goal is not just to get the site online, but to give your dad the best possible chance of being found by people searching for custom knives, knife making, engraving, and related services around Randburg and Johannesburg.

## Current Frontend Status

The frontend is ready for hosting preparation.

Already done in `KnowlesKnivesWeb`:

- Angular SSR is configured.
- Public pages are prerendered.
- Knife detail pages are added to `routes.txt` and `sitemap.xml` when the API is running.
- `robots.txt` is generated.
- `sitemap.xml` is generated.
- Route-level SEO metadata is in place.
- Canonical URLs and Open Graph metadata are supported.
- JSON-LD structured data is in place for:
  - `LocalBusiness` on the home page
  - `Product` on knife detail pages
- Admin/browser-only code has been made safer for SSR.
- Unknown routes use a real 404 page.
- Gallery has a lightbox.
- `npm run build` passes.
- SSR runtime smoke test has passed locally.

Important remaining frontend placeholders:

- `https://REPLACE_WITH_CODE_CAPSULES_URL` must be replaced or supplied through `SITE_URL` once Code Capsules gives the public URL.
- Final real logo, favicon, workshop photo, and gallery photos should replace placeholders.
- Stronger local SEO content should be added before Search Console submission if possible.

## Quick Answer: Can SEO Be Done After Hosting?

Yes, SEO can be done after hosting.

But the best order is:

1. Add the strongest local content before the first serious Google submission.
2. Host the site.
3. Rebuild with the final hosted URL.
4. Submit the sitemap to Google Search Console.
5. Keep improving content after launch.

It is not fatal if you host first. You can update content later and Google will recrawl. But if Google first sees a weak version of the site, you may lose time waiting for it to notice the improved version.

Recommended approach: host when ready, but do not rush Search Console submission until the local Randburg/Johannesburg wording and final URLs are in place.

## Success Goal

The website should make it clear to visitors and search engines that Knowles Knives is relevant for searches like:

- custom knife maker Randburg
- handmade knives Johannesburg
- knife making Randburg
- knife making courses Johannesburg
- knife engraving Randburg
- custom hunting knives South Africa
- handmade chef knives South Africa
- bespoke knives Johannesburg

The site should also make it easy for a visitor to enquire without confusion.

## Phase 1: Before Hosting

### 1. Confirm Business Positioning

Decide the exact local wording before launch.

Recommended wording:

```text
Knowles Knives is a custom knife maker based near Randburg, Johannesburg, crafting handmade knives, bespoke commissions, engraving, repairs, and knife-making courses by appointment.
```

Softer version if you do not want to expose an exact address:

```text
Based in the Randburg area and serving Johannesburg, Knowles Knives creates handmade custom knives, blade services, engraving, and knife-making experiences by appointment.
```

Use this wording consistently on:

- Home page
- Services page
- About page
- Contact page
- Google Business Profile
- Social profiles

### 2. Add Strong Local Content

The technical SEO is already prepared, but local SEO needs words on the page.

Home page should mention:

- custom knife maker
- Randburg
- Johannesburg
- handmade knives
- bespoke commissions
- knife making services

Services page should mention:

- custom knife commissions
- knife making courses
- engraving
- repairs
- sharpening or blade services if offered
- Randburg/Johannesburg service area

About page should mention:

- the workshop story
- handmade/hand-finished process
- Randburg/Johannesburg location wording
- why the knives are personal and custom

Contact page should mention:

- by appointment only
- Randburg/Johannesburg
- enquiries for custom knives, courses, engraving, and services

### 3. Prepare Photos and Trust Content

Photos matter a lot for a craft business.

Minimum photo set before public marketing:

- 1 strong hero image
- 1 workshop photo
- 6 to 12 finished knife photos
- 2 to 4 process photos if available
- 1 logo or clean brand mark

Image guidance:

- Use real photos over SVG placeholders.
- Compress images before deploy.
- Aim for large hero images under about 300 KB if possible.
- Aim for gallery images under about 200 KB each where possible.
- Use descriptive alt text, for example:
  - `Handmade hunting knife by Knowles Knives`
  - `Custom chef knife made near Randburg`
  - `Knife engraving detail by Knowles Knives`

### 4. Build With API Running

Before hosting, run the frontend build while the API is running:

```bash
npm run build
```

This should:

- Generate `routes.txt`
- Generate `public/sitemap.xml`
- Generate `public/robots.txt`
- Fetch knife slugs from `http://localhost:5000/api/knives`
- Prerender public pages and knife detail pages

Check `routes.txt`. It should include:

```text
/
/knives
/services
/gallery
/about
/contact
/404
/knives/<knife-slug>
```

### 5. Keep Admin Out of Search

Admin routes should not be submitted to Google.

This is already handled by:

- `robots.txt` blocking `/admin`
- explicit prerender routes instead of auto-discovering admin routes

## Phase 2: Code Capsules Hosting

### 1. Create Hosting Resources

In Code Capsules:

1. Create a Space.
2. Create a MySQL Data Capsule for the API.
3. Create a Backend Capsule for the API/SSR app.
4. Bind the Backend Capsule to the MySQL capsule.
5. Connect the GitHub repo.

The budget target is around R400 to R500/month:

- Backend capsule
- MySQL capsule
- Optional free-tier Cloudinary for images

### 2. Build and Run Commands

For the frontend SSR app, use:

```bash
npm ci
npm run build
npm run serve:ssr
```

If Code Capsules separates build and run commands:

Build command:

```bash
npm ci && npm run build
```

Run command:

```bash
npm run serve:ssr
```

### 3. Environment Variables for Frontend Build

When Code Capsules gives the public URL, set:

```bash
SITE_URL=https://YOUR_CODE_CAPSULES_URL
API_URL=https://YOUR_CODE_CAPSULES_URL/api
```

`SITE_URL` is used for:

- `sitemap.xml`
- `robots.txt`
- canonical URLs
- Open Graph URLs

`API_URL` is used by `scripts/prepare-hosting.cjs` to fetch knife slugs for prerendering.

If API and frontend are hosted under the same origin, production browser calls can use:

```text
/api
```

That is already the frontend production setup.

### 4. Replace URL Placeholders

Before public launch, replace or supply:

```text
https://REPLACE_WITH_CODE_CAPSULES_URL
```

Places affected:

- `src/environments/environment.prod.ts`
- generated `public/sitemap.xml`
- generated `public/robots.txt`
- canonical URLs
- Open Graph URLs

Best practical flow:

```bash
SITE_URL=https://YOUR_CODE_CAPSULES_URL API_URL=https://YOUR_CODE_CAPSULES_URL/api npm run build
```

### 5. Hosting Smoke Test

After deploy, test these:

- `https://YOUR_CODE_CAPSULES_URL/`
- `https://YOUR_CODE_CAPSULES_URL/knives`
- `https://YOUR_CODE_CAPSULES_URL/knives/<knife-slug>`
- `https://YOUR_CODE_CAPSULES_URL/services`
- `https://YOUR_CODE_CAPSULES_URL/gallery`
- `https://YOUR_CODE_CAPSULES_URL/contact`
- `https://YOUR_CODE_CAPSULES_URL/sitemap.xml`
- `https://YOUR_CODE_CAPSULES_URL/robots.txt`

For SEO, inspect page source on a knife detail page.

The source should contain:

- knife name
- description
- meta description
- Open Graph tags
- structured data

If the page source only shows an empty Angular shell, SSR is not working correctly.

## Phase 3: API and Data Requirements

This document is focused on launch success, but the frontend depends on the API for real content.

Before public marketing, the API should support:

- knives
- services
- enquiries
- admin login
- image uploads or external image storage
- health check
- gallery, if you want gallery admin changes to persist

Important API production items:

- Use real production database credentials.
- Set a strong `JWT_SECRET`.
- Set `CLIENT_URL` to the Code Capsules URL.
- Run migrations.
- Seed admin user once.
- Ensure uploaded images survive redeploys.

Image persistence is critical. If Code Capsules local disk is not persistent, use Cloudinary or another external image host.

## Phase 4: Google Search Console

Do this after the site is hosted and the sitemap has real URLs.

### 1. Open Google Search Console

Go to:

```text
https://search.google.com/search-console
```

### 2. Add Property

If you do not have a custom domain yet:

- Choose `URL prefix`
- Enter the Code Capsules URL

Example:

```text
https://your-code-capsules-url
```

If you later buy a domain:

- Add a new domain property
- Resubmit the sitemap using the real domain

### 3. Verify Ownership

Google will provide verification options.

Use whichever Code Capsules supports most easily:

- HTML file upload
- meta tag
- DNS record, if using a domain

Without a domain, URL prefix verification is usually the easier route.

### 4. Submit Sitemap

In Search Console:

1. Click `Sitemaps`.
2. Enter:

```text
sitemap.xml
```

3. Click Submit.

The full sitemap URL should be:

```text
https://YOUR_CODE_CAPSULES_URL/sitemap.xml
```

### 5. Request Indexing

Use URL Inspection for the most important pages:

- home page
- `/knives`
- `/services`
- `/contact`
- top 5 knife detail pages

Click `Request indexing`.

Indexing can take days or weeks. It is not instant.

## Phase 5: Google Business Profile

For local searches like `knife making in Randburg`, Google Business Profile is extremely important.

Create or claim the profile:

```text
https://www.google.com/business/
```

Add:

- business name: `Knowles Knives`
- service area: Randburg, Johannesburg, surrounding areas
- website URL
- phone/email
- business hours or by appointment only
- category closest to custom knife maker / knife shop / artisan
- real photos
- short business description

Suggested profile description:

```text
Knowles Knives is a custom knife maker based near Randburg, Johannesburg. We create handmade knives, bespoke commissions, engraving, repairs, and knife-making experiences by appointment.
```

Keep this wording consistent with the website.

## Phase 6: Local SEO Content Targets

The goal is to target realistic local searches.

Primary phrase:

```text
custom knife maker Randburg
```

Secondary phrases:

```text
knife making Randburg
handmade knives Johannesburg
custom knives Johannesburg
knife engraving Randburg
knife making courses Johannesburg
custom hunting knives South Africa
handmade chef knives South Africa
bespoke knives Johannesburg
```

Do not stuff these phrases unnaturally. Use them where they make sense.

Good natural sentence:

```text
Based near Randburg and serving Johannesburg, Knowles Knives creates handmade custom knives, engraving, blade services, and knife-making courses by appointment.
```

Bad keyword-stuffed sentence:

```text
Knife making Randburg knife maker Randburg custom knife Randburg knife making course Randburg.
```

## Phase 7: Content Checklist by Page

### Home Page

Should answer:

- What is Knowles Knives?
- Where is it based?
- What services does it offer?
- How does someone enquire?

Recommended SEO angle:

```text
Custom knife maker based near Randburg, Johannesburg.
```

### Knives Page

Should answer:

- What knives are available?
- Can people search/filter?
- Are these handmade/custom?
- How do they enquire?

Recommended SEO angle:

```text
Browse handmade knives and custom blades from Knowles Knives.
```

### Knife Detail Pages

Should include:

- knife name
- category
- description
- steel type
- handle material
- price/availability
- enquiry CTA

Recommended SEO angle:

```text
Handmade custom knife by Knowles Knives.
```

### Services Page

Should cover:

- custom commissions
- engraving
- repairs/services
- courses, if offered
- Randburg/Johannesburg area

Recommended SEO angle:

```text
Knife making, engraving, and custom blade services near Randburg.
```

### Gallery Page

Should show:

- real finished work
- workshop photos
- process photos
- engraving detail

Recommended SEO angle:

```text
Examples of handmade knives, workshop craft, and engraving from Knowles Knives.
```

### About Page

Should tell:

- who makes the knives
- why the craft matters
- where the workshop is based generally
- why customers can trust the work

Recommended SEO angle:

```text
Handcrafted knife-making workshop based near Randburg.
```

### Contact Page

Should make it clear:

- no online payments
- enquire first
- by appointment only
- where service area is

Recommended SEO angle:

```text
Contact Knowles Knives for custom knife enquiries in Randburg and Johannesburg.
```

## Phase 8: Post-Launch QA

After hosting, test:

- mobile home page
- mobile navigation
- knife search/filter
- knife detail page
- enquiry form
- admin login
- admin add/edit knife
- image loading
- gallery lightbox
- 404 page
- sitemap URL
- robots URL

Run Lighthouse in Chrome DevTools:

- Performance target: 70+
- SEO target: 90+
- Accessibility: fix obvious issues
- Best Practices: fix obvious issues

## Phase 9: Dad Handoff

Before calling the site "launched", make sure your dad can:

1. Log into `/admin`.
2. Add a knife.
3. Upload/change knife images.
4. Edit availability.
5. View enquiries.
6. Understand that enquiries come through the site.
7. Know what to do when a customer contacts him.

Create a simple one-page handoff for him:

```text
How to add a knife
1. Go to /admin
2. Log in
3. Click Knives
4. Click New Knife
5. Add name, description, price, steel, handle, availability
6. Upload photos
7. Save
8. Check the public knives page
```

## Phase 10: What Success Looks Like

Technical success:

- site is live on HTTPS
- SSR works
- sitemap is submitted
- knife pages are indexed
- admin works
- enquiries work
- images persist

Business success:

- real people can find the site
- visitors understand what your dad offers
- visitors can enquire easily
- Google Business Profile is live
- the site looks trustworthy and finished

SEO success will take time. The first goal is not instant ranking. The first goal is to make sure Google can crawl the right content and customers who do land on the site trust it enough to enquire.

## Immediate Next Steps

1. Add stronger Randburg/Johannesburg wording to the frontend pages.
2. Replace placeholder images with real photos.
3. Host on Code Capsules.
4. Rebuild with real `SITE_URL` and `API_URL`.
5. Confirm `/sitemap.xml` and `/robots.txt` are live.
6. Submit sitemap to Google Search Console.
7. Set up Google Business Profile.
8. Test enquiry flow with your dad.

