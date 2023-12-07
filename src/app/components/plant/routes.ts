import { Route } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

export const PLANT_ROUTES: Route[] = [
  {
    path: 'all',
    loadComponent: () =>
      import('./plant-all/plant-all.component').then(
        (m) => m.PlantAllComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'create/:locationId',
    loadComponent: () =>
      import('./plant-add/plant-add.component').then(
        (m) => m.PlantAddComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: ':plantId',
    loadComponent: () =>
      import('./plant/plant.component').then((m) => m.PlantComponent),
  },
];
