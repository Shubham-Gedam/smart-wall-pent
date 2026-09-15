import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, Project } from '../../core/services/project.service';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../../shared/components/header/header';

@Component({
    selector: 'app-preview',
    standalone: true,
    imports: [HeaderComponent],
    templateUrl: './preview.html'
})
export class PreviewComponent implements OnInit {
    private projectId: string;

    project = signal<Project | null>(null);
    loading = signal(true);
    errorMessage = signal('');

    constructor(private route: ActivatedRoute, private router: Router, private projectService: ProjectService) {
        this.projectId = this.route.snapshot.paramMap.get('id') || '';
    }

    ngOnInit() {
        this.projectService.getById(this.projectId).subscribe({
            next: (res) => {
                this.project.set(res.project);
                this.loading.set(false);
            },
            error: (err) => {
                this.errorMessage.set(err.error?.message || 'Failed to load project');
                this.loading.set(false);
            }
        });
    }

    downloadUrl(): string {
        return `${environment.apiUrl}/projects/${this.projectId}/download`;
    }

    onEditAgain() {
        this.router.navigate(['/wall-selector', this.projectId]);
    }
}