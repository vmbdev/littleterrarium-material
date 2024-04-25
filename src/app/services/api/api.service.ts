import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { endpoint } from '@config';
import { BACKEND_URL } from 'src/tokens';
import { Location } from '@models/location.model';
import { Photo, NavigationData } from '@models/photo.model';
import { CoverPhoto, Plant } from '@models/plant.model';
import { Specie } from '@models/specie.model';
import {
  PasswordRequirements,
  User,
  UsernameRequirements,
} from '@models/user.model';
import { BackendResponse } from '@models/backend-response.model';
import { SortColumn, SortOrder } from '@models/sort-options.model';
import { AdminSummary } from '@models/admin.model';

export interface LocationGetConfig {
  plantCount?: boolean;
  userId?: number | null;
  limit?: number;
}

export interface LocationUpsertConfig {
  update?: boolean;
  removePicture?: boolean;
}

export interface PlantGetConfig {
  userId?: number;
  locationId?: number;
  photos?: boolean;
  cover?: boolean;
  limit?: number;
  filter?: string;
  cursor?: number;
  sort?: SortColumn;
  order?: SortOrder;
}

export interface PlantUpdateConfig {
  removeSpecie?: boolean;
  removeCover?: boolean;
}

export interface UserEditConfig {
  removeAvatar?: boolean;
}

export interface UserPreferences {
  [index: string]: any;
  theme?: string;
  locale?: string;
  plantListSort?: SortColumn;
  plantListOrder?: SortOrder;
}

export interface AngularLocales {
  locales: string[];
  default: string;
}

export interface AdminUserList {
  skip?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly backendUrl = inject<string>(BACKEND_URL);

  endpoint(path: string): string {
    return `${this.backendUrl}${endpoint}/${path}`;
  }

  getLocales(): Observable<AngularLocales> {
    return this.http.get<AngularLocales>(this.endpoint('angular/locales'));
  }

  /**
   * User API functions
   */

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.endpoint(`users/id/${id}`));
  }

  getUserByName(username: string): Observable<User> {
    return this.http.get<User>(this.endpoint(`users/username/${username}`));
  }

  getPasswordRequirements(): Observable<PasswordRequirements> {
    return this.http.get<PasswordRequirements>(
      this.endpoint('users/password/requirements'),
    );
  }

  getUsernameRequirements(): Observable<UsernameRequirements> {
    return this.http.get<UsernameRequirements>(
      this.endpoint('users/usernamerequirements'),
    );
  }

  checkPassword(password: string): Observable<BackendResponse> {
    return this.http.post<BackendResponse>(
      this.endpoint('users/password/check'),
      { password },
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.endpoint('users'), user);
  }

  updateUser(user: User, options: UserEditConfig = {}): Observable<User> {
    const form = new FormData();

    if (user.username) form.append('username', user.username);
    if (user.email) form.append('email', user.email);
    if (user.firstname || user.firstname === '') {
      form.append('firstname', user.firstname);
    }
    if (user.lastname || user.lastname === '') {
      form.append('lastname', user.lastname);
    }
    if (user.bio || user.bio === '') form.append('bio', user.bio);
    if (user.password) form.append('password', user.password);
    if (user.public || user.public === false) {
      form.append('public', user.public.toString());
    }
    
    if (options.removeAvatar) form.append('removeAvatar', 'true');
    else if (user.avatarFile) form.append('avatar', user.avatarFile);


    return this.http.patch<User>(this.endpoint('users'), form);
  }
  
  updatePreferences(prefs: UserPreferences): Observable<User> {
    const form = new FormData();

    form.append('preferences', JSON.stringify(prefs));
    
    return this.http.patch<User>(this.endpoint('users'), form);
  }

  /**
   * Auth related calls
   */

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.endpoint('auth'));
  }

  signIn(username: string, password: string): Observable<User> {
    return this.http.post<User>(this.endpoint('auth/signin'), {
      username,
      password,
    });
  }

  logOut(): Observable<any> {
    return this.http.post<any>(this.endpoint('auth/logout'), null);
  }

  forgotPassword(userRef: string): Observable<any> {
    return this.http.post<any>(this.endpoint('auth/forgotten'), { userRef });
  }

  recoverPassword(
    token: string,
    password: string,
    userId: number,
  ): Observable<any> {
    return this.http.post<any>(this.endpoint('auth/restore'), {
      token,
      password,
      userId,
    });
  }

  verifyToken(token: string, userId: number): Observable<any> {
    return this.http.post<any>(this.endpoint('auth/verifyToken'), {
      token,
      userId,
    });
  }

  /**
   * Location related calls
   */

  getLocation(id: number, options?: LocationGetConfig): Observable<Location> {
    let url = `locations/${id}`;

    if (options) {
      if (options.userId) url += `/user/${+options.userId}`;
      if (options.plantCount) url += '?plantcount=true';
    }

    return this.http.get<Location>(this.endpoint(url));
  }

  // retrieve location list for current user
  getLocationList(options?: LocationGetConfig): Observable<Location[]> {
    let url = 'locations';

    if (options) {
      if (options.userId && +options.userId) url += `/user/${+options.userId}`;
      if (options.plantCount) url += '?plantcount=true';
    }

    return this.http.get<Location[]>(this.endpoint(url));
  }

  getLocationPlants(id: number, options?: PlantGetConfig): Observable<Plant[]> {
    return this.getPlants({ ...options, locationId: id });
  }

  countLocationPlants(id: number): Observable<number> {
    return this.http
      .get<{ count: number }>(this.endpoint(`locations/${id}/plants/count`))
      .pipe(map((count) => count.count));
  }

  /**
   * Creates a new Location or updates an existing one.
   * @param location The location to be upserted
   * @param update Whether we're creating (false/null) or updating (true) an
   *    existing one.
   * @returns An observable with the server response.
   */
  upsertLocation(
    location: Location,
    options: LocationUpsertConfig = {},
  ): Observable<Location> {
    let observable;
    const form = new FormData();

    form.append('name', location.name);
    form.append('light', location.light);

    if (location.public || location.public === false) {
      form.append('public', location.public.toString());
    }

    if (options.removePicture) form.append('removePicture', 'true');
    else if (location.pictureFile) {
      form.append('picture', location.pictureFile);
    }

    if (location.id && options.update) {
      form.append('id', location.id.toString());
    }

    if (options.update) {
      observable = this.http.patch<Location>(this.endpoint('locations'), form);
    } else {
      observable = this.http.post<Location>(this.endpoint('locations'), form);
    }

    return observable;
  }

  createLocation(location: Location): Observable<Location> {
    return this.upsertLocation(location);
  }

  updateLocation(
    location: Location,
    options: LocationUpsertConfig = {},
  ): Observable<Location> {
    return this.upsertLocation(location, { update: true, ...options });
  }

  deleteLocation(id: number): Observable<any> {
    return this.http.delete<any>(this.endpoint(`locations/${id}`));
  }

  /**
   * Plant related calls
   */

  getPlants(options?: PlantGetConfig): Observable<Plant[]> {
    let url = 'plants/';

    if (options) {
      const urlParams = new URLSearchParams();

      // for plants in a location: location/:id/plants
      if (options.locationId) url = `locations/${options.locationId}/${url}`;
      // for plants of user: plants/user/:id
      else if (options.userId) url += `user/${options.userId}`;

      if (options.cover) urlParams.append('cover', options.cover.toString());
      if (options.cursor) urlParams.append('cursor', options.cursor.toString());
      if (options.filter) urlParams.append('filter', options.filter.toString());
      if (options.sort) urlParams.append('sort', options.sort);
      if (options.order) urlParams.append('order', options.order);
      if (options.limit) urlParams.append('limit', options.limit.toString());

      url += `?${urlParams.toString()}`;
    }

    return this.http.get<Plant[]>(this.endpoint(url));
  }

  getPlant(id: number, options?: PlantGetConfig): Observable<Plant> {
    let url = `plants/${id}`;

    if (options?.photos || options?.cover) {
      url += `?photos=${!!options.photos}&cover=${!!options.cover}`;
    }

    return this.http.get<Plant>(this.endpoint(url));
  }

  getPlantCover(id: number): Observable<CoverPhoto> {
    return this.http.get<CoverPhoto>(this.endpoint(`plants/${id}/cover`));
  }

  getPlantPhotos(id: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.endpoint(`plants/${id}/photos`));
  }

  countPlants(): Observable<number> {
    return this.http
      .get<{ count: number }>(this.endpoint('plants/count'))
      .pipe(map((count) => count.count));
  }

  createPlant(plant: Plant): Observable<Plant> {
    return this.http.post<Plant>(this.endpoint('plants'), plant);
  }

  updatePlant(plant: Plant, options?: PlantUpdateConfig): Observable<Plant> {
    const data = plant as any;

    if (options?.removeSpecie) data.removeSpecie = true;
    if (options?.removeCover) data.removeCover = true;

    return this.http.patch<Plant>(this.endpoint('plants'), data);
  }

  movePlantsToLocation(ids: number[], locationId: number): Observable<any> {
    const idstr = ids.join(';');

    return this.http.patch(
      this.endpoint(`plants/${idstr}/location/${locationId}`),
      null,
    );
  }

  deletePlant(id: number): Observable<any> {
    return this.http.delete(this.endpoint(`plants/${id}`));
  }

  deletePlants(ids: number[]): Observable<any> {
    const idstr = ids.join(';');

    return this.http.delete(this.endpoint(`plants/${idstr}`));
  }

  /**
   * Photo related calls
   */

  getPhoto(id: number): Observable<Photo> {
    return this.http.get<Photo>(this.endpoint(`photos/${id}`));
  }

  getPhotoNavigation(id: number): Observable<NavigationData> {
    return this.http.get<NavigationData>(
      this.endpoint(`photos/${id}/navigation`),
    );
  }

  createPhoto(photo: Photo): Observable<HttpEvent<BackendResponse>> {
    const form = new FormData();

    form.append('plantId', photo.plantId.toString());

    if (photo.public || photo.public === false) {
      form.append('public', photo.public.toString());
    }

    photo.pictureFiles.forEach((photo) => {
      form.append('photo', photo);
    });

    return this.http.post<BackendResponse>(this.endpoint('photos'), form, {
      reportProgress: true,
      observe: 'events',
    });
  }

  updatePhoto(photo: Photo): Observable<Photo> {
    return this.http.patch<Photo>(this.endpoint('photos'), photo);
  }

  deletePhoto(id: number): Observable<any> {
    return this.http.delete(this.endpoint(`photos/${id}`));
  }

  /**
   * Specie related calls
   */

  getSpecie(id: number): Observable<Specie> {
    return this.http.get<Specie>(this.endpoint(`species/${id}`));
  }

  findSpecie(name: string): Observable<Specie[]> {
    return this.http.get<Specie[]>(this.endpoint(`species/name/${name}`));
  }

  /**
   * Tasks related calls
   */

  getTasks(): Observable<Plant[]> {
    return this.http.get<Plant[]>(this.endpoint('tasks'));
  }

  /**
   * Admin related calls
   */

  getAdminSummary(): Observable<AdminSummary> {
    return this.http.get<AdminSummary>(this.endpoint('admin'));
  }

  getAdminUserList(options?: AdminUserList): Observable<User[]> {
    let url = 'admin/user';

    if (options) {
      const urlParams = new URLSearchParams();

      if (options.skip) urlParams.append('skip', options.skip.toString());
      if (options.limit) urlParams.append('limit', options.limit.toString());

      url += `?${urlParams.toString()}`;
    }

    return this.http.get<User[]>(this.endpoint(url));
  }
}
