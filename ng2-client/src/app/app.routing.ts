import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './pages/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'page/user', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'page/user', canActivate: [AuthGuard] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
