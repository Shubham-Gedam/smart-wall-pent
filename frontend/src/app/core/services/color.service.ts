import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Color {
    _id: string;
    name: string;
    hex: string;
    brand?: string;
    finishOptions: string[];
    categoryTags: string[];
}

export interface CreateColorPayload {
    name: string;
    hex: string;
    brand?: string;
    finishOptions?: string[];
    categoryTags?: string[];
}

@Injectable({ providedIn: 'root' })
export class ColorService {
    private readonly apiUrl = `${environment.apiUrl}/colors`;

    constructor(private http: HttpClient) {}

    getAll(): Observable<{ count: number; colors: Color[] }> {
        return this.http.get<{ count: number; colors: Color[] }>(this.apiUrl);
    }

    create(payload: CreateColorPayload): Observable<{ message: string; color: Color }> {
        return this.http.post<{ message: string; color: Color }>(this.apiUrl, payload);
    }
        
    delete(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}