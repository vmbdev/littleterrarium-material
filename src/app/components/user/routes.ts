import { Route } from '@angular/router';

import { SignedInGuard } from '@guards/signed-in.guard';

export const USER_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./user-main/user-main.component').then(
        (m) => m.UserMainComponent,
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: 'change',
    loadComponent: () =>
      import('./password-change/password-change.component').then(
        (m) => m.PasswordChangeComponent,
      ),
  },
];

export const USER_ROUTES_UNSIGNED: Route[] = [
  {
    path: 'recover',
    loadComponent: () =>
      import('./password-recovery/password-recovery.component').then(
        (m) => m.PasswordRecoveryComponent,
      ),
  },
  {
    path: 'reset/:userId/:token',
    loadComponent: () =>
      import('./password-reset/password-reset.component').then(
        (m) => m.PasswordResetComponent,
      ),
  },
];
