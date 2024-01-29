import { Route } from '@angular/router';

import { SignedInGuard } from '@guards/signed-in.guard';

export const LOCATION_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./location-list/location-list.component').then(
        (m) => m.LocationListComponent
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./location-add/location-add.component').then(
        (m) => m.LocationAddComponent
      ),
    canActivate: [SignedInGuard],
  },
  {
    path: ':locationId',
    loadComponent: () =>
      import('./location/location.component').then((m) => m.LocationComponent),
  },
];
