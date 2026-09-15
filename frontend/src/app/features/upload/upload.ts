import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MediaService } from '../../core/services/media.service';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/components/header/header';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [HeaderComponent],
    templateUrl: './upload.html'
})
export class UploadComponent {
    selectedFile = signal<File | null>(null);
    previewUrl = signal<string | null>(null);
    uploading = signal(false);
    errorMessage = signal('');
    isDragging = signal(false);

    constructor(
        private mediaService: MediaService,
        private projectService: ProjectService,
        private authService: AuthService,
        private router: Router
    ) {}

    private validateAndSetFile(file: File) {
        if (!ALLOWED_TYPES.includes(file.type)) {
            this.errorMessage.set('Only PNG, JPG, and JPEG images are supported');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            this.errorMessage.set('File is too large — max size is 10MB');
            return;
        }

        this.selectedFile.set(file);
        this.previewUrl.set(URL.createObjectURL(file));
        this.errorMessage.set('');
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        this.validateAndSetFile(file);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        this.isDragging.set(true);
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        this.isDragging.set(false);
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        this.isDragging.set(false);

        const file = event.dataTransfer?.files?.[0];
        if (!file) return;
        this.validateAndSetFile(file);
    }

    onUpload() {
        const file = this.selectedFile();
        if (!file) return;

        this.uploading.set(true);
        this.errorMessage.set('');

        this.mediaService.upload(file, 'room-photo').subscribe({
            next: (res) => {
                this.projectService.create(file.name, res.media.url).subscribe({
                    next: (projectRes) => {
                        this.uploading.set(false);
                        this.router.navigate(['/wall-selector', projectRes.project._id]);
                    },
                    error: (err) => {
                        this.uploading.set(false);
                        this.errorMessage.set(err.error?.message || 'Failed to create project');
                    }
                });
            },
            error: (err) => {
                this.uploading.set(false);
                this.errorMessage.set(err.error?.message || 'Upload failed');
            }
        });
    }

    onLogout() {
        this.authService.logout().subscribe(() => this.router.navigate(['/login']));
    }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }
}