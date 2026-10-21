import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { RenderMode, ServerRoute } from '@angular/ssr';

import { prerenderParamsForPrefix } from './prerender-routes';

function prerenderParams(prefix: string): Array<{ slug: string }> {
  try {
    const routesFile = readFileSync(resolve(process.cwd(), 'routes.txt'), 'utf8');
    return prerenderParamsForPrefix(routesFile, prefix);
  } catch {
    return [];
  }
}

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'knives/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve(prerenderParams('/knives')),
  },
  {
    path: 'goods/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve(prerenderParams('/goods')),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
