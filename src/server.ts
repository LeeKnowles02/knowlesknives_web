import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const CANONICAL_HOST = 'knowlesknives.co.za';
const LEGACY_HOSTS = new Set([
  'www.knowlesknives.co.za',
  'soothing-celebration-production-c6df.up.railway.app',
]);

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: [
    'localhost',
    '127.0.0.1',
    'knowlesknives.co.za',
    'www.knowlesknives.co.za',
    'soothing-celebration-production-c6df.up.railway.app',
  ],
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res, next) => {
  const host = req.headers.host?.split(':')[0] ?? '';

  if (
    host &&
    host !== 'localhost' &&
    !host.startsWith('127.0.0.1') &&
    LEGACY_HOSTS.has(host)
  ) {
    return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
  }

  next();
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT']) || 4000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Knowles Knives SSR server listening on http://0.0.0.0:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
