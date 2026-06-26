import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  let request = req;
  const token = auth.getToken();
  if (token && req.url.startsWith(environment.apiUrl)) {
    request = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && req.url.startsWith(environment.apiUrl)) {
        auth.logout();
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    }),
  );
};
