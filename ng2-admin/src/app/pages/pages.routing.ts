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
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'users', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
      { path: 'tables', loadChildren: './tables/tables.module#TablesModule', canActivate: [AuthGuard] },
      { path: 'edit-user/:id', loadChildren: './edit-user/edit-user.module#EditUserModule', canActivate: [AuthGuard] },
      { path: 'edit-hidden-user/:id', loadChildren: './edit-hidden-user/edit-hidden-user.module#EditHiddenUserModule', canActivate: [AuthGuard] },
      { path: 'add-user', loadChildren: './add-user/add-user.module#AddUserModule', canActivate: [AuthGuard] },
      { path: 'aliases', loadChildren: './aliases/aliases.module#AliasesModule', canActivate: [AuthGuard] },
      { path: 'add-alias', loadChildren: './add-alias/add-alias.module#AddAliasModule', canActivate: [AuthGuard] },
      { path: 'edit-alias/:id', loadChildren: './edit-alias/edit-alias.module#EditAliasModule', canActivate: [AuthGuard] },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
