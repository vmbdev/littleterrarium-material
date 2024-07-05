import { Routes } from '@angular/router';
import { NotSignedInGuard } from '@guards/not-signed-in.guard';
import { SignedInGuard } from '@guards/signed-in.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './components/layouts/default-layout/default-layout.component'
      ).then((m) => m.DefaultLayoutComponent),
    loadChildren: () => [
      {
        path: '',
        loadComponent: () =>
          import('./components/home/home.component').then(
            (m) => m.HomeComponent,
          ),
        canActivate: [SignedInGuard],
      },
      {
        path: 'logout',
        loadComponent: () =>
          import('./components/user/logout/logout.component').then(
            (m) => m.LogoutComponent,
          ),
        canActivate: [SignedInGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./components/user/routes').then((m) => m.USER_ROUTES),
      },
      {
        path: 'location',
        loadChildren: () =>
          import('./components/location/routes').then((m) => m.LOCATION_ROUTES),
      },
      {
        path: 'plant',
        loadChildren: () =>
          import('./components/plant/routes').then((m) => m.PLANT_ROUTES),
      },
      {
        path: 'photo',
        loadChildren: () =>
          import('./components/photo/routes').then((m) => m.PHOTO_ROUTES),
      },
      {
        path: 'terrarium/:username',
        loadComponent: () =>
          import('./components/terrarium/terrarium/terrarium.component').then(
            (m) => m.TerrariumComponent,
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./components/tasks/task-list/task-list.component').then(
            (m) => m.TaskListComponent,
          ),
        canActivate: [SignedInGuard],
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/layouts/signin-layout/signin-layout.component').then(
        (m) => m.SigninLayoutComponent,
      ),
    canActivate: [NotSignedInGuard],
    loadChildren: () => [
      {
        path: 'signin',
        loadComponent: () =>
          import('./components/user/signin/signin.component').then(
            (m) => m.SigninComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/user/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./components/user/routes').then(
            (m) => m.USER_ROUTES_UNSIGNED,
          ),
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/errors/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
