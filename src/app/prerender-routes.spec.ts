import { prerenderParamsForPrefix } from './prerender-routes';

describe('prerenderParamsForPrefix', () => {
  const routesFile = ['/', '/knives', '/knives/star-lord', '/goods/sheath', '/about', ''].join(
    '\n',
  );

  it('returns slugs for one section', () => {
    expect(prerenderParamsForPrefix(routesFile, '/knives')).toEqual([{ slug: 'star-lord' }]);
  });

  it('ignores the section index and other sections', () => {
    expect(prerenderParamsForPrefix(routesFile, '/goods')).toEqual([{ slug: 'sheath' }]);
    expect(prerenderParamsForPrefix(routesFile, '/services')).toEqual([]);
  });
});
