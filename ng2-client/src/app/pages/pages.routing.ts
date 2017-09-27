import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/noAuth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule',
    canActivate: [NotAuthGuard]
  },
  {
    path: 'page',
    component: Pages,
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'user', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
