import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { DashboardAdmin } from './features/dashboard-admin/dashboard-admin';
import { Home } from './features/home/home';
import { publicGuard, adminGuard, userGuard } from './auth/guard';
import { SignUp } from './auth/sign-up/sign-up';
import { Profile } from './features/profile/profile';
import { Checkin } from './features/checkin/checkin';
import { ResetPassword } from './auth/reset-password/reset-password';
import { NewPassword } from './auth/reset-password/new-password/new-password';
import { MenuAdmin } from './features/menu-admin/menu-admin';
import { ProgramacionAdmin } from './features/programacion-admin/programacion-admin';
import { ParaderosAdmin } from './features/paraderos-admin/paraderos-admin';

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
    canActivate: [userGuard],
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
    path: 'dashboard-admin',
    component: DashboardAdmin,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'menu-admin',
        pathMatch: 'full',
      },
      {
        path: 'menu-admin',
        component: MenuAdmin,
      },
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: 'programacion',
        component: ProgramacionAdmin,
      },
      {
        path: 'paraderos',
        component: ParaderosAdmin,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
