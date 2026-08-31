import { Injectable, RESPONSE_INIT, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpStatusService {
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });

  setStatus(status: number): void {
    if (this.responseInit) {
      this.responseInit.status = status;
    }
  }
}
