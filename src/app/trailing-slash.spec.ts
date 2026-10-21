import { withTrailingSlash } from './trailing-slash';

describe('withTrailingSlash', () => {
  it('adds a slash to a page path', () => {
    expect(withTrailingSlash('/contact')).toBe('/contact/');
    expect(withTrailingSlash('/knives/biltong-carver')).toBe('/knives/biltong-carver/');
  });

  it('keeps the root and an existing slash', () => {
    expect(withTrailingSlash('/')).toBe('/');
    expect(withTrailingSlash('/contact/')).toBe('/contact/');
  });

  it('keeps the query string after the slash', () => {
    expect(withTrailingSlash('/contact?knifeId=1')).toBe('/contact/?knifeId=1');
  });
});
