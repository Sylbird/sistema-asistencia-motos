import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { Home } from './features/home/home';
import { authGuard, publicGuard } from './auth/guard';
import { SignUp } from './auth/sign-up/sign-up';
import { Profile } from './features/profile/profile';
import { Checkin } from './features/checkin/checkin';
import { ResetPassword } from './auth/reset-password/reset-password';
import { NewPassword } from './auth/reset-password/new-password/new-password';

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
    path: 'reset-password',
    component: ResetPassword,
    canActivate: [publicGuard],
  },
  {
    path: 'new-password/:idReseteoClave',
    component: NewPassword,
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
      {
        path: 'checkin',
        component: Checkin,
      },
      {
        path: 'profile',
        component: Profile,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
