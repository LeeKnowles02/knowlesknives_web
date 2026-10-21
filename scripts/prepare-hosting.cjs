const fs = require('node:fs/promises');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const routesPath = path.join(projectRoot, 'routes.txt');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const robotsPath = path.join(publicDir, 'robots.txt');

const DEFAULT_SITE_URL = 'https://knowlesknivesweb-nbhu.codecapsules.co.za';
const siteUrl = normalizeSiteUrl(
  process.env.SITE_URL || process.env.PUBLIC_SITE_URL || DEFAULT_SITE_URL,
);
const apiUrl = normalizeApiUrl(process.env.API_URL || 'http://localhost:5000/api');
const isProductionBuild = process.env.NODE_ENV === 'production' || process.argv.includes('--production');

const staticRoutes = [
  '/',
  '/knives',
  '/goods',
  '/services',
  '/gallery',
  '/about',
  '/contact',
  '/404',
];

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  if (isProductionBuild && siteUrl.includes('REPLACE_WITH')) {
    throw new Error('SITE_URL must be set to the production domain before building.');
  }

  const [knifeRoutes, goodRoutes] = await Promise.all([getKnifeRoutes(), getGoodRoutes()]);
  const routes = uniqueRoutes([...staticRoutes, ...knifeRoutes, ...goodRoutes]);

  await fs.writeFile(routesPath, `${routes.join('\n')}\n`);
  await fs.writeFile(sitemapPath, buildSitemap(routes));
  await fs.writeFile(robotsPath, buildRobots());

  console.log(`Prepared ${routes.length} routes for hosting.`);
  console.log(`Site URL: ${siteUrl}`);
  if (knifeRoutes.length === 0) {
    console.log('No knife routes were added. Start the API or set API_URL to include knife slugs.');
  }
  if (goodRoutes.length === 0) {
    console.log('No goods routes were added. Start the API or set API_URL to include goods slugs.');
  }
}

async function getKnifeRoutes() {
  return getSlugRoutes('/knives', 'knives');
}

async function getGoodRoutes() {
  return getSlugRoutes('/goods', 'goods');
}

async function getSlugRoutes(prefix, endpoint) {
  try {
    const response = await fetch(`${apiUrl}/${endpoint}`);

    if (!response.ok) {
      throw new Error(`${endpoint} API returned ${response.status}`);
    }

    const body = await response.json();
    const items = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];

    return items
      .map((item) => item?.slug)
      .filter((slug) => typeof slug === 'string' && slug.trim().length > 0)
      .map((slug) => `${prefix}/${slug.trim()}`);
  } catch (error) {
    console.warn(`Could not fetch ${endpoint} slugs from ${apiUrl}/${endpoint}.`);
    console.warn(error instanceof Error ? error.message : error);
    return [];
  }
}

function buildSitemap(routes) {
  const urls = routes
    .filter((route) => route !== '/404')
    .map((route) => {
      const priority =
        route === '/'
          ? '1.0'
          : route.startsWith('/knives/') || route.startsWith('/goods/')
            ? '0.8'
            : '0.7';
      const changefreq =
        route === '/' ||
        route.startsWith('/knives') ||
        route.startsWith('/goods') ||
        route === '/gallery'
          ? 'weekly'
          : 'monthly';

      return [
        '  <url>',
        `    <loc>${siteUrl}${route === '/' ? '/' : route}</loc>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots() {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n');
}

function uniqueRoutes(routes) {
  return [...new Set(routes.map((route) => (route === '' ? '/' : route)))];
}

function normalizeSiteUrl(value) {
  return value.replace(/\/+$/, '');
}

function normalizeApiUrl(value) {
  return value.replace(/\/+$/, '');
}
