import { Component, ElementRef, ViewChild, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { ColorService, Color } from '../../core/services/color.service';
import { MediaService } from '../../core/services/media.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../../shared/components/header/header';
import { HttpClient } from '@angular/common/http';

interface WallDraft {
    coordinates: [number, number][];
    colorId: string | null;
    finish: string;
    opacity: number;
}

@Component({
    selector: 'app-wall-selector',
    standalone: true,
    imports: [CommonModule, FormsModule, HeaderComponent],
    templateUrl: './wall-selector.html'
})
export class WallSelectorComponent implements AfterViewInit {
    @ViewChild('canvasEl') canvasRef!: ElementRef<HTMLCanvasElement>;

    private ctx!: CanvasRenderingContext2D;
    private image = new Image();
    projectId: string;

    loading = signal(true);
    saving = signal(false);
    errorMessage = signal('');

    colors = signal<Color[]>([]);
    walls = signal<WallDraft[]>([]);
    currentPoints = signal<[number, number][]>([]);

    selectedColorId = signal<string | null>(null);
    selectedFinish = 'matte';
    selectedOpacity = signal(0.6); // Default 60% as seen in Screenshot 2

    searchQuery = signal('');
    activeCategory = signal('All');

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private projectService: ProjectService,
        private colorService: ColorService,
        private mediaService: MediaService,
        private authService: AuthService,
        private http: HttpClient
    ) {
        this.projectId = this.route.snapshot.paramMap.get('id') || '';
    }

    ngAfterViewInit() {
        this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
        this.loadProjectAndColors();
    }

    private loadProjectAndColors() {
        this.projectService.getById(this.projectId).subscribe({
            next: (res) => {
                this.image.crossOrigin = 'anonymous';
                this.image.onload = () => {
                    const canvas = this.canvasRef.nativeElement;
                    canvas.width = this.image.naturalWidth;
                    canvas.height = this.image.naturalHeight;

                    if (res.project.wallSelections?.length) {
                        this.walls.set(
                            res.project.wallSelections.map((w: any) => ({
                                coordinates: w.coordinates,
                                colorId: w.colorId || null,
                                finish: w.finish || 'matte',
                                opacity: w.opacity ?? 0.6
                            }))
                        );
                    }

                    this.loading.set(false);
                    this.redraw();
                };
                this.image.onerror = () => {
                    this.errorMessage.set('Failed to load the room image');
                    this.loading.set(false);
                };
                this.image.src = res.project.originalImageUrl;
            },
            error: (err) => {
                this.errorMessage.set(err.error?.message || 'Failed to load project');
                this.loading.set(false);
            }
        });

        this.colorService.getAll().subscribe({
            next: (res) => this.colors.set(res.colors),
            error: () => {}
        });
    }

    // --- Colour palette search + filter ---

    categories(): string[] {
        const tags = new Set<string>();
        for (const c of this.colors()) {
            for (const t of c.categoryTags || []) tags.add(t);
        }
        return ['All', ...Array.from(tags)];
    }

    filteredColors(): Color[] {
        const query = this.searchQuery().trim().toLowerCase();
        const category = this.activeCategory();

        return this.colors().filter((c) => {
            const matchesQuery = !query || c.name.toLowerCase().includes(query);
            const matchesCategory = category === 'All' || (c.categoryTags || []).includes(category);
            return matchesQuery && matchesCategory;
        });
    }

    selectedColor(): Color | undefined {
        return this.colors().find((c) => c._id === this.selectedColorId());
    }

    // --- Canvas interaction ---

    private getCanvasCoords(event: MouseEvent): [number, number] {
        const canvas = this.canvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        return [Math.round(x), Math.round(y)];
    }

    onCanvasClick(event: MouseEvent) {
        const point = this.getCanvasCoords(event);
        this.currentPoints.update((pts) => [...pts, point]);
        this.redraw();
    }

    onCanvasDoubleClick(event: MouseEvent) {
        event.preventDefault();
        this.applyColorToCurrentSelection();
    }

    applyColorToCurrentSelection() {
        const points = this.currentPoints();
        if (points.length < 3) {
            this.errorMessage.set('A wall outline needs at least 3 points');
            return;
        }

        if (!this.selectedColorId()) {
            this.errorMessage.set('Pick a colour before closing the outline');
            return;
        }

        this.walls.update((w) => [
            ...w,
            {
                coordinates: points,
                colorId: this.selectedColorId(),
                finish: this.selectedFinish,
                opacity: this.selectedOpacity()
            }
        ]);

        this.currentPoints.set([]);
        this.errorMessage.set('');
        this.redraw();
    }

    onOpacityChange(event: Event) {
        const value = Number((event.target as HTMLInputElement).value) / 100;
        this.selectedOpacity.set(value);
    }

    setFinish(finish: string) {
        this.selectedFinish = finish;
    }

    clearCurrentPolygon() {
        this.currentPoints.set([]);
        this.redraw();
    }

    removeWall(index: number) {
        this.walls.update((w) => w.filter((_, i) => i !== index));
        this.redraw();
    }

    colorHexFor(colorId: string | null): string {
        return this.colors().find((c) => c._id === colorId)?.hex || '#cccccc';
    }

    colorNameFor(colorId: string | null): string {
        return this.colors().find((c) => c._id === colorId)?.name || 'Unnamed';
    }

    private redraw() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);

        for (const wall of this.walls()) {
            this.drawPolygon(wall.coordinates, this.colorHexFor(wall.colorId), wall.opacity, true, false);
        }

        if (this.currentPoints().length > 0) {
            // Terracotta theme dashed active outline
            this.drawPolygon(this.currentPoints(), '#C85227', 1, false, true);
        }
    }

    private drawPolygon(
        points: [number, number][],
        color: string,
        opacity: number,
        fill: boolean,
        dashed: boolean
    ) {
        if (points.length === 0) return;

        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        for (const [x, y] of points.slice(1)) {
            this.ctx.lineTo(x, y);
        }

        if (fill && points.length >= 3) {
            this.ctx.closePath();
            this.ctx.globalAlpha = opacity;
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        } else {
            this.ctx.setLineDash(dashed ? [6, 4] : []);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2.5;
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            for (const [x, y] of points) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, 5, 0, Math.PI * 2);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fill();
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = color;
                this.ctx.stroke();
            }
        }
    }

    // --- Save & Download ---

    onSave() {
        this.saving.set(true);
        this.errorMessage.set('');

        const canvas = this.canvasRef.nativeElement;

        canvas.toBlob((blob) => {
            if (!blob) {
                this.saving.set(false);
                this.errorMessage.set('Failed to capture preview image');
                return;
            }

            const previewFile = new File([blob], `preview-${this.projectId}.jpg`, { type: 'image/jpeg' });

            this.mediaService.upload(previewFile, 'final-preview').subscribe({
                next: (mediaRes) => {
                    this.projectService
                        .update(this.projectId, {
                            wallSelections: this.walls() as any,
                            finalPreviewUrl: mediaRes.media.url,
                            status: 'saved'
                        })
                        .subscribe({
                            next: () => {
                                this.saving.set(false);
                                this.router.navigate(['/preview', this.projectId]);
                            },
                            error: (err) => {
                                this.saving.set(false);
                                this.errorMessage.set(err.error?.message || 'Failed to save project');
                            }
                        });
                },
                error: (err) => {
                    this.saving.set(false);
                    this.errorMessage.set(err.error?.message || 'Failed to upload preview image');
                }
            });
        }, 'image/jpeg', 0.9);
    }

    downloadUrl(): string {
    return `${environment.apiUrl}/projects/${this.projectId}/download`;
    }      

    onLogout() {
        this.authService.logout().subscribe(() => this.router.navigate(['/login']));
    }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }
}