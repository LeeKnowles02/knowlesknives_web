import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface UploadResult {
  url: string;
  filename: string;
}

@Injectable({ providedIn: 'root' })
export class UploadApiService {
  private readonly http = inject(HttpClient);
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http
      .post<ApiResponse<UploadResult>>(`${environment.apiUrl}/admin/upload`, formData)
      .pipe(
        map((res) => {
          if (!res.success || !res.data?.url) {
            throw new Error(res.message ?? 'Upload failed');
          }
          return res.data.url;
        }),
        catchError((err) => {
          const message =
            err.error?.message ?? err.message ?? 'Could not upload image. Please try again.';
          return throwError(() => new Error(message));
        }),
      );
  }
}
