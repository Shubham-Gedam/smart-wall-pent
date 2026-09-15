import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './header.html'
})
export class HeaderComponent {
    constructor(private authService: AuthService, private router: Router) {}

    onLogout() {
        this.authService.logout().subscribe(() => this.router.navigate(['/login']));
    }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }
}