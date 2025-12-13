import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { Home } from './features/home/home';
import { authGuard, publicGuard } from './auth/guard';
import { SignUp } from './auth/sign-up/sign-up';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
    canActivate: [publicGuard],
  },
  {
    path: 'sign-up',
    component: SignUp,
    canActivate: [publicGuard],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: Home,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
