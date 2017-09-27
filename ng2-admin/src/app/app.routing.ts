import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './pages/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'pages/users', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'pages/users', canActivate: [AuthGuard] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
