import { Route } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

export const LOCATION_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./location-list/location-list.component').then(m => m.LocationListComponent), canActivate: [AuthGuard]
  },
  {
    path: 'create',
    loadComponent: () => import('./location-add-edit/location-add-edit.component').then(m => m.LocationAddEditComponent), canActivate: [AuthGuard]
  },
  // {
  //   path: 'edit/:locationId',
  //   loadComponent: () => import('./location-add-edit/location-add-edit.component').then(m => m.LocationAddEditComponent), canActivate: [AuthGuard]
  // },
  {
    path: ':locationId',
    loadComponent: () => import('./location/location.component').then(m => m.LocationComponent)
  },
];