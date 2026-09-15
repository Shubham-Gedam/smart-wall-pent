import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './auth.css'
})
export class RegisterComponent {
    name = '';
    email = '';
    password = '';
    loading = signal(false);
    errorMessage = signal('');

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        if (!this.name || !this.email || !this.password) {
            this.errorMessage.set('All fields are required');
            return;
        }

        this.loading.set(true);
        this.errorMessage.set('');

        this.authService.register(this.name, this.email, this.password).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMessage.set(err.error?.message || 'Registration failed. Please try again.');
            }
        });
    }
}