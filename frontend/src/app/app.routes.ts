import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login').then((m) => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register').then((m) => m.RegisterComponent)
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent)
    },
    {
        path: 'upload',
        canActivate: [authGuard],
        loadComponent: () => import('./features/upload/upload').then((m) => m.UploadComponent)
    },
    {
        path: 'wall-selector/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/wall-selector/wall-selector').then((m) => m.WallSelectorComponent)
    },
    {
        path: 'preview/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/preview/preview').then((m) => m.PreviewComponent)
    },
    {
        path: 'saved-designs',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/saved-designs/saved-designs').then((m) => m.SavedDesignsComponent)
    },
    {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./features/admin/admin').then((m) => m.AdminComponent)
    },
    { path: '**', redirectTo: '' }
];