import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'signin',
    loadComponent: () => import('./components/user/signin/signin.component').then(m => m.SigninComponent)
  },
  {
    path: 'logout',
    loadComponent: () => import('./components/user/logout/logout.component').then(m => m.LogoutComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/user/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'user',
    loadChildren: () => import('./components/user/routes').then(m => m.USER_ROUTES)
  },
  {
    path: 'location',
    loadChildren: () => import('./components/location/routes').then(m => m.LOCATION_ROUTES)
  },
  {
    path: 'plant',
    loadChildren: () => import('./components/plant/routes').then(m => m.PLANT_ROUTES)
  },
  {
    path: 'photo',
    loadChildren: () => import('./components/photo/routes').then(m => m.PHOTO_ROUTES)
  },
  // {
  //   path: 'terrarium/:username',
  //   loadComponent: () => import('./components/terrarium/terrarium.component').then(m => m.TerrariumComponent)
  // },
  {
    path: 'tasks',
    loadComponent: () => import('./components/task/task-list/task-list.component').then(m => m.TaskListComponent), canActivate: [AuthGuard]
  },
];