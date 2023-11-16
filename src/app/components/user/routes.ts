import { Route } from '@angular/router'
import { AuthGuard } from '@guards/auth.guard'

export const USER_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./user-main/user-main.component')
        .then(m => m.UserMainComponent),
    canActivate: [AuthGuard]
  },
];