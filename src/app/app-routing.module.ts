import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './core/layout/dashboard/dashboard.component';
import {AuthenticateComponent} from './authenticate/authenticate.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { 
    path: '',
    redirectTo: 'authenticate', 
    pathMatch: 'full' 
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [],
    canActivate: [authGuard]
  },
  {
    path: 'authenticate',
    component: AuthenticateComponent,
    children: [
      { path: '', loadChildren: () => import('./authenticate/authenticate.module').then(m => m.AuthenticateModule) }
    ]
  },
  // {
  //   path: "**",
  //   component: PageNotFoundComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
