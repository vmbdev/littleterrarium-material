import { Route } from '@angular/router'
import { AuthGuard } from '@guards/auth.guard'

export const PLANT_ROUTES: Route[] = [
  {
    path: 'all',
    loadComponent: () => import('./plant-all/plant-all.component').then(m => m.PlantAllComponent), canActivate: [AuthGuard]
  },
  {
    path: 'create/:locationId',
    loadComponent: () => import('./plant-add/plant-add.component').then(m => m.PlantAddComponent), canActivate: [AuthGuard]
  },
  // {
  //   path: 'edit/:plantId',
  //   loadComponent: () => import('./plant-edit/plant-edit.component').then(m => m.PlantEditComponent), canActivate: [AuthGuard]
  // },
  // {
  //   path: 'edit/:plantId/soil',
  //   loadComponent: () => import('./plant-edit-soil/plant-edit-soil.component').then(m => m.PlantEditSoilComponent), canActivate: [AuthGuard]
  // },
  {
    path: ':plantId',
    loadComponent: () => import('./plant/plant.component').then(m => m.PlantComponent)
  }
];