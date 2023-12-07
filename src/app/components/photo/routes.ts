import { Route } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

export const PHOTO_ROUTES: Route[] = [
  {
    path: 'create/:plantId',
    loadComponent: () =>
      import('./photo-add/photo-add.component').then(
        (m) => m.PhotoAddComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: ':photoId',
    loadComponent: () =>
      import('./photo/photo.component').then((m) => m.PhotoComponent),
  },
];
