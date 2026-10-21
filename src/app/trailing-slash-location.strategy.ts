import { APP_BASE_HREF, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { withTrailingSlash } from './trailing-slash';

@Injectable()
export class TrailingSlashPathLocationStrategy extends PathLocationStrategy {
  constructor() {
    super(inject(PlatformLocation), inject(APP_BASE_HREF, { optional: true }) ?? undefined);
  }

  override prepareExternalUrl(internal: string): string {
    return withTrailingSlash(super.prepareExternalUrl(internal));
  }
}
