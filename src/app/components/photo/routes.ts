import { Route } from '@angular/router';

import { SignedInGuard } from '@guards/signed-in.guard';

export const PHOTO_ROUTES: Route[] = [
  {
    path: 'create/:plantId',
    loadComponent: () =>
      import('./photo-add/photo-add.component').then(
        (m) => m.PhotoAddComponent
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: ':photoId',
    loadComponent: () =>
      import('./photo/photo.component').then((m) => m.PhotoComponent),
  },
];
