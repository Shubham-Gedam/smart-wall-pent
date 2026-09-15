import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './auth.css'
})
export class LoginComponent {
    email = '';
    password = '';
    loading = signal(false);
    errorMessage = signal('');

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        if (!this.email || !this.password) {
            this.errorMessage.set('Email and password are required');
            return;
        }

        this.loading.set(true);
        this.errorMessage.set('');

        this.authService.login(this.email, this.password).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
            }
        });
    }
}