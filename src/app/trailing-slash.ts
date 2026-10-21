export function withTrailingSlash(url: string): string {
  const match = /^([^?#]*)(.*)$/.exec(url);
  if (!match) {
    return url;
  }

  let path = match[1];
  const suffix = match[2] ?? '';

  if (!path || path === '/') {
    return `/${suffix}`;
  }

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  if (path.endsWith('/')) {
    return `${path}${suffix}`;
  }

  return `${path}/${suffix}`;
}
