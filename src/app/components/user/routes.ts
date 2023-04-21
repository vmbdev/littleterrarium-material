import { Route } from '@angular/router'
import { AuthGuard } from '@guards/auth.guard'

export const USER_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./user-main/user-main.component').then(m => m.UserMainComponent), canActivate: [AuthGuard]
  },
  // {
  //   path: 'edit',
  //   loadComponent: () => import('./photo/photo.component').then(m => m.PhotoComponent)
  // },
];