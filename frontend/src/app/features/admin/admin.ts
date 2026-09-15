import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ColorService, Color } from '../../core/services/color.service';
import { PatternService, Pattern } from '../../core/services/pattern.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin.html'
})
export class AdminComponent implements OnInit {
    activeTab = signal<'colors' | 'patterns'>('colors');

    colors = signal<Color[]>([]);
    patterns = signal<Pattern[]>([]);
    errorMessage = signal('');

    newColorName = '';
    newColorHex = '#000000';
    newColorBrand = '';

    newPatternName = '';
    newPatternImageUrl = '';
    newPatternCategory = '';

    constructor(private colorService: ColorService, private patternService: PatternService) {}

    ngOnInit() {
        this.loadColors();
        this.loadPatterns();
    }
    // Add this method inside AdminComponent class:
onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'https://placehold.co/100x100?text=Pattern';
}

    loadColors() {
        this.colorService.getAll().subscribe({
            next: (res) => this.colors.set(res.colors),
            error: (err) => this.errorMessage.set(err.error?.message || 'Failed to load colours')
        });
    }

    loadPatterns() {
        this.patternService.getAll().subscribe({
            next: (res) => this.patterns.set(res.patterns),
            error: (err) => this.errorMessage.set(err.error?.message || 'Failed to load patterns')
        });
    }

    addColor() {
        if (!this.newColorName || !this.newColorHex) {
            this.errorMessage.set('Colour name and hex are required');
            return;
        }

        this.colorService
            .create({ name: this.newColorName, hex: this.newColorHex, brand: this.newColorBrand })
            .subscribe({
                next: () => {
                    this.newColorName = '';
                    this.newColorHex = '#000000';
                    this.newColorBrand = '';
                    this.errorMessage.set('');
                    this.loadColors();
                },
                error: (err) => this.errorMessage.set(err.error?.message || 'Failed to add colour')
            });
    }

    deleteColor(id: string) {
        if (!confirm('Delete this colour?')) return;

        this.colorService.delete(id).subscribe({
            next: () => this.loadColors(),
            error: (err) => this.errorMessage.set(err.error?.message || 'Failed to delete colour')
        });
    }

    addPattern() {
        if (!this.newPatternName || !this.newPatternImageUrl) {
            this.errorMessage.set('Pattern name and image URL are required');
            return;
        }

        this.patternService
            .create({
                name: this.newPatternName,
                imageUrl: this.newPatternImageUrl,
                category: this.newPatternCategory
            })
            .subscribe({
                next: () => {
                    this.newPatternName = '';
                    this.newPatternImageUrl = '';
                    this.newPatternCategory = '';
                    this.errorMessage.set('');
                    this.loadPatterns();
                },
                error: (err) => this.errorMessage.set(err.error?.message || 'Failed to add pattern')
            });
    }

    deletePattern(id: string) {
        if (!confirm('Delete this pattern?')) return;

        this.patternService.delete(id).subscribe({
            next: () => this.loadPatterns(),
            error: (err) => this.errorMessage.set(err.error?.message || 'Failed to delete pattern')
        });
    }
}