import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/components/header/header';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, HeaderComponent],
    templateUrl: './home.html'
})
export class HomeComponent {
    currentYear = new Date().getFullYear();

    constructor(private authService: AuthService, private router: Router) {}

    onLogout() {
        this.authService.logout().subscribe(() => this.router.navigate(['/login']));
    }

    isLoggedIn(): boolean {
        const auth: any = this.authService;
        if (typeof auth.isLoggedIn === 'function') {
            return auth.isLoggedIn();
        }
        return !!auth.isLoggedIn;
    }

    isAdmin(): boolean {
        const auth: any = this.authService;
        if (typeof auth.isAdmin === 'function') {
            return auth.isAdmin();
        }
        return !!auth.isAdmin;
    }
}