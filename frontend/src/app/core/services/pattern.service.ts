import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Pattern {
    _id: string;
    name: string;
    description?: string;
    category?: string;
    imageUrl: string;
}

export interface CreatePatternPayload {
    name: string;
    description?: string;
    category?: string;
    imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class PatternService {
    private readonly apiUrl = `${environment.apiUrl}/patterns`;

    constructor(private http: HttpClient) {}

    getAll(): Observable<{ count: number; patterns: Pattern[] }> {
        return this.http.get<{ count: number; patterns: Pattern[] }>(this.apiUrl);
    }

    create(payload: CreatePatternPayload): Observable<{ message: string; pattern: Pattern }> {
        return this.http.post<{ message: string; pattern: Pattern }>(this.apiUrl, payload);
    }

    delete(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}