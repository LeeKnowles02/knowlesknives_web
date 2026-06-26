import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { LoginResponse, User } from '../models/user.model';

const TOKEN_KEY = 'knowles_knives_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClientService);
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();
  login(email: string, password: string): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/login', { email, password }).pipe(
      tap((response) => {
        this.saveToken(response.token);
        this.currentUserSubject.next(response.user);
      }),
    );
  }

  logout(): void {
    this.clearToken();
    this.currentUserSubject.next(null);
  }
  getCurrentUser(): Observable<User> {
    return this.api.get<User>('/auth/me').pipe(tap((user) => this.currentUserSubject.next(user)));
  }
  loadCurrentUserIfLoggedIn(): void {
    if (this.isLoggedIn()) {
      this.getCurrentUser().subscribe({ error: () => this.logout() });
    }
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
