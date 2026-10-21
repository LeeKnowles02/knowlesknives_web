export function prerenderParamsForPrefix(
  routesFile: string,
  prefix: string,
): Array<{ slug: string }> {
  const pathPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;

  return routesFile
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith(pathPrefix))
    .map((line) => line.slice(pathPrefix.length))
    .filter((slug) => slug.length > 0 && !slug.includes('/'))
    .map((slug) => ({ slug }));
}
