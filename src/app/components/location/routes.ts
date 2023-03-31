import { Route } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

export const LOCATION_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./location-list/location-list.component').then(m => m.LocationListComponent), canActivate: [AuthGuard]
  },
  {
    path: 'create',
    loadComponent: () => import('./location-add/location-add.component').then(m => m.LocationAddComponent), canActivate: [AuthGuard]
  },
  {
    path: ':locationId',
    loadComponent: () => import('./location/location.component').then(m => m.LocationComponent)
  },
];