import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProjectService, Project } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../../shared/components/header/header';

@Component({
    selector: 'app-saved-designs',
    standalone: true,
    imports: [RouterLink, HeaderComponent],
    templateUrl: './saved-designs.html'
})
export class SavedDesignsComponent implements OnInit {
    projects = signal<Project[]>([]);
    loading = signal(true);
    errorMessage = signal('');
    apiUrl = environment.apiUrl;

    constructor(
        private projectService: ProjectService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadProjects();
    }

    loadProjects() {
        this.loading.set(true);
        this.projectService.getMyProjects().subscribe({
            next: (res) => {
                this.projects.set(res.projects);
                this.loading.set(false);
            },
            error: (err) => {
                this.errorMessage.set(err.error?.message || 'Failed to load your designs');
                this.loading.set(false);
            }
        });
    }

    onEdit(projectId: string) {
        this.router.navigate(['/wall-selector', projectId]);
    }

    onDelete(projectId: string) {
        if (!confirm('Delete this project? This cannot be undone.')) return;

        this.projectService.delete(projectId).subscribe({
            next: () => this.loadProjects(),
            error: (err) => this.errorMessage.set(err.error?.message || 'Failed to delete project')
        });
    }

    downloadUrl(projectId: string): string {
        return `${this.apiUrl}/projects/${projectId}/download`;
    }

    onLogout() {
        this.authService.logout().subscribe(() => this.router.navigate(['/login']));
    }
}