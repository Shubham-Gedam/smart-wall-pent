import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Project {
    _id: string;
    title: string;
    originalImageUrl: string;
    wallSelections: any[];
    finalPreviewUrl?: string;
    status: 'draft' | 'saved';
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
    private readonly apiUrl = `${environment.apiUrl}/projects`;

    constructor(private http: HttpClient) {}

    create(title: string, originalImageUrl: string): Observable<{ message: string; project: Project }> {
        return this.http.post<{ message: string; project: Project }>(this.apiUrl, { title, originalImageUrl });
    }

    getMyProjects(): Observable<{ count: number; projects: Project[] }> {
        return this.http.get<{ count: number; projects: Project[] }>(this.apiUrl);
    }

    getById(id: string): Observable<{ project: Project }> {
        return this.http.get<{ project: Project }>(`${this.apiUrl}/${id}`);
    }

    update(id: string, changes: Partial<Project>): Observable<{ message: string; project: Project }> {
        return this.http.put<{ message: string; project: Project }>(`${this.apiUrl}/${id}`, changes);
    }

    delete(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}