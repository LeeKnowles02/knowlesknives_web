import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly baseUrl = this.resolveBaseUrl();
  get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${path}`, { params: this.toParams(params) })
      .pipe(
        map((res) => this.unwrap(res)),
        catchError((err) => this.handleError(err)),
      );
  }
  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body).pipe(
      map((res) => this.unwrap(res)),
      catchError((err) => this.handleError(err)),
    );
  }
  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body).pipe(
      map((res) => this.unwrap(res)),
      catchError((err) => this.handleError(err)),
    );
  }
  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${path}`, body).pipe(
      map((res) => this.unwrap(res)),
      catchError((err) => this.handleError(err)),
    );
  }
  delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`).pipe(
      map((res) => this.unwrap(res)),
      catchError((err) => this.handleError(err)),
    );
  }
  private unwrap<T>(res: ApiResponse<T>): T {
    if (!res.success) {
      throw new Error(res.message ?? 'Request failed');
    }
    return res.data as T;
  }
  private toParams(
    params?: Record<string, string | number | boolean | undefined>,
  ): HttpParams | undefined {
    if (!params) {
      return undefined;
    }
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }
  private handleError(err: HttpErrorResponse): Observable<never> {
    const message =
      err.error?.message ?? err.message ?? 'An unexpected error occurred. Please try again.';
    return throwError(() => new ApiError(message, err.status));
  }

  private resolveBaseUrl(): string {
    if (/^https?:\/\//i.test(environment.apiUrl)) {
      return environment.apiUrl;
    }

    if (isPlatformServer(this.platformId)) {
      return `${environment.siteUrl.replace(/\/$/, '')}${environment.apiUrl}`;
    }

    return environment.apiUrl;
  }
}
