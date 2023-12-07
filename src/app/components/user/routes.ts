import { Route } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

export const USER_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./user-main/user-main.component').then(
        (m) => m.UserMainComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'recover',
    loadComponent: () =>
      import('./password-recovery/password-recovery.component').then(
        (m) => m.PasswordRecoveryComponent
      ),
  },
  {
    path: 'reset',
    loadComponent: () =>
      import('./password-reset/password-reset.component').then(
        (m) => m.PasswordResetComponent
      ),
  },
  {
    path: 'reset/:userId?/:token?',
    loadComponent: () =>
      import('./password-reset/password-reset.component').then(
        (m) => m.PasswordResetComponent
      ),
  },
];
