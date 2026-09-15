import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MediaItem {
    _id: string;
    url: string;
    thumbnailUrl?: string;
    fileName: string;
    purpose: string;
}

@Injectable({ providedIn: 'root' })
export class MediaService {
    private readonly apiUrl = `${environment.apiUrl}/media`;

    constructor(private http: HttpClient) {}

    upload(file: File, purpose = 'room-photo'): Observable<{ message: string; media: MediaItem }> {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('purpose', purpose);

        return this.http.post<{ message: string; media: MediaItem }>(`${this.apiUrl}/upload`, formData);
    }

    getMyMedia(): Observable<{ count: number; media: MediaItem[] }> {
        return this.http.get<{ count: number; media: MediaItem[] }>(this.apiUrl);
    }
}