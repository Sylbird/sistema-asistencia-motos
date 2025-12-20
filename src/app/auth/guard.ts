import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const userData = authService.getUserData();
    if (userData?.id_rol === 1) {
      router.navigate(['/dashboard-admin']);
    } else {
      router.navigate(['/dashboard']);
    }
    return false;
  }

  return true;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const userData = authService.getUserData();
  if (userData?.id_rol !== 1) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const userData = authService.getUserData();
  if (userData?.id_rol !== 2) {
    router.navigate(['/dashboard-admin']);
    return false;
  }

  return true;
};
