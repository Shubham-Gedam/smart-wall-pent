import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthResponse {
    message: string;
    user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/auth`;

    currentUser = signal<User | null>(null);

    constructor(private http: HttpClient) {}

    register(name: string, email: string, password: string): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password })
            .pipe(tap((res) => this.currentUser.set(res.user)));
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
            .pipe(tap((res) => this.currentUser.set(res.user)));
    }

    logout(): Observable<{ message: string }> {
        return this.http
            .post<{ message: string }>(`${this.apiUrl}/logout`, {})
            .pipe(tap(() => this.currentUser.set(null)));
    }

    fetchMe(): Observable<{ success: boolean; user: User }> {
        return this.http
            .get<{ success: boolean; user: User }>(`${this.apiUrl}/me`)
            .pipe(tap((res) => this.currentUser.set(res.user)));
    }

    isAdmin(): boolean {
        return this.currentUser()?.role === 'admin';
    }
}