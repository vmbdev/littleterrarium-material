import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Location } from '@models/location.model';
import { Photo } from '@models/photo.model';
import { CoverPhoto, Plant } from '@models/plant.model';
import { Specie } from '@models/specie.model';
import { User } from '@models/user.model';
import { BackendResponse, NavigationData } from '@models/backend-response.model';
import { endpoint } from '@config';
import { BACKEND_URL } from 'src/tokens';
import { SortColumn, SortOrder } from '@models/sort-options.model';

export interface LocationGetConfig {
  plantCount?: boolean
  userId?: number | null
  limit?: number
}

export interface LocationUpsertConfig {
  update?: boolean
  removePicture?: boolean
}

export interface PlantGetConfig {
  userId?: number
  locationId?: number
  photos?: boolean
  cover?: boolean
  limit?: number
  filter?: string
  cursor?: number
  sort?: SortColumn
  order?: SortOrder
}

export interface PlantUpdateConfig {
  removeSpecie?: boolean
  removeCover?: boolean
}

export interface PhotoGetConfig {
  navigation?: boolean
  cover?: boolean
}

export interface AngularLocales {
  locales: string[]
  default: string
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    @Inject(BACKEND_URL) public backendUrl: string
  ) { }

  endpoint = (path: string) => {
    return `${this.backendUrl}${endpoint}/${path}`;
  }

  getLocales(): Observable<AngularLocales> {
    return this.http.get<AngularLocales>(this.endpoint('angular/locales'));
  }

  /**
   * Auth and user API functions
   */

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.endpoint('users'))
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.endpoint(`users/id/${id}`));
  }

  getUserByName(username: string): Observable<User> {
    return this.http.get<User>(this.endpoint(`users/username/${username}`));
  }

  signIn(username: string, password: string): Observable<User> {
    return this.http.post<User>(this.endpoint('users/signin'), { username, password });
  }

  logOut(): Observable<any> {
    return this.http.post<any>(this.endpoint('users/logout'), null);
  }

  getPasswordRequirements(): Observable<BackendResponse> {
    return this.http.get<BackendResponse>(this.endpoint('users/password/requirements'));
  }

  getUsernameRequirements(): Observable<BackendResponse> {
    return this.http.get<BackendResponse>(this.endpoint('users/usernamerequirements'));
  }

  checkPassword(password: string): Observable<BackendResponse> {
    return this.http.post<BackendResponse>(this.endpoint('users/password/check'), { password });
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.endpoint('users'), user);
  }

  editUser(user: User, removeAvatar?: boolean): Observable<User> {
    const form = new FormData();

    form.append('username', user.username);
    form.append('email', user.email);

    if (user.firstname) form.append('firstname', user.firstname);
    if (user.lastname) form.append('lastname', user.lastname);
    if (user.bio) form.append('bio', user.bio);
    if (user.public) form.append('public', user.public.toString());

    if (removeAvatar) form.append('removeAvatar', 'true');
    else if (user.avatarFile) form.append('avatar', user.avatarFile);

    return this.http.put<User>(this.endpoint('users'), form);
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

  /**
   * Creates a new Location or updates an existing one.
   * @param location The location to be upserted
   * @param update Whether we're creating (false/null) or updating (true) an existing one.
   * @returns An observable with the server response.
   */
  upsertLocation(location: Location, options: LocationUpsertConfig = {}): Observable<Location> {
    let observable;
    const form = new FormData();

    form.append('name', location.name);
    form.append('light', location.light);
    form.append('public', location.public.toString());

    if (options.removePicture) form.append('removePicture', 'true');
    else if (location.pictureFile) form.append('picture', location.pictureFile);

    if (location.id && options.update) form.append('id', location.id.toString());

    if (options.update) observable = this.http.put<Location>(this.endpoint('locations'), form);
    else observable = this.http.post<Location>(this.endpoint('locations'), form);

    return observable;
  }

  createLocation(location: Location): Observable<Location> {
    return this.upsertLocation(location);
  }

  updateLocation(location: Location, options: LocationUpsertConfig = {}): Observable<Location> {
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
      // for location's plants it's location/:id/plants
      if (options.locationId) {
        url = `locations/${options.locationId}/${url}`;
      }
      // for plants of user it's plants/user/:id
      else if (options.userId) {
        url += `user/${options.userId}`;
      }

      url += '?';

      if (options.cover) {
        url += `cover=${options.cover ? true : false}&`;
      }
      if (options.cursor) url += `cursor=${options.cursor}&`;
      if (options.filter) url += `filter=${options.filter}&`;
      if (options.sort) url += `sort=${options.sort}&`;
      if (options.order) url += `order=${options.order}&`;
    }

    return this.http.get<Plant[]>(this.endpoint(url));
  }

  getPlant(id: number, options?: PlantGetConfig): Observable<Plant> {
    let url = `plants/${id}`;

    if (options && (options.photos || options.cover)) {
      url += `?photos=${options.photos ? true : false}&cover=${options.cover ? true : false}`;
    }

    return this.http.get<Plant>(this.endpoint(url));
  }

  getPlantCover(id: number): Observable<CoverPhoto> {
    return this.http.get<CoverPhoto>(this.endpoint(`plants/${id}/cover`));
  }

  getPlantPhotos(id: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.endpoint(`plants/${id}/photos`));
  }

  createPlant(plant: Plant): Observable<Plant> {
    return this.http.post<Plant>(this.endpoint('plants'), plant);
  }

  updatePlant(plant: Plant, options?: PlantUpdateConfig): Observable<Plant> {
    const data = plant as any;

    if (options) {
      if (options.removeSpecie) data.removeSpecie = true;
      if (options.removeCover) data.removeCover = true;
    }

    return this.http.put<Plant>(this.endpoint('plants'), data);
  }

  deletePlant(id: number): Observable<any> {
    return this.http.delete<any>(this.endpoint(`plants/${id}`));
  }

  /**
   * Photo related calls
   */

  getPhoto(id: number, options?: PhotoGetConfig): Observable<Photo> {
    let url = `photos/${id}`;

    // TODO: create proper API to do this
    if (options) {
      url += '?';
      if (options.navigation) url += `navigation=${options.navigation ? 'true' : 'false' }&`;
      if (options.cover) url += `cover=${options.cover ? 'true' : 'false'}&`;
    }

    return this.http.get<Photo>(this.endpoint(url));
  }

  getPhotoNavigation(id: number): Observable<NavigationData> {
    return this.http.get<NavigationData>(this.endpoint(`photos/${id}/navigation`));
  }

  createPhoto(photo: Photo): Observable<HttpEvent<BackendResponse>> {
    const form = new FormData();

    form.append('plantId', photo.plantId.toString());
    form.append('public', photo.public.toString());
    photo.pictureFiles.forEach((photo) => {
      form.append('photo', photo);
    });

    return this.http.post<BackendResponse>(this.endpoint('photos'), form, { reportProgress: true, observe: 'events' });
  }

  updatePhoto(photo: Photo): Observable<Photo> {
    return this.http.put<Photo>(this.endpoint('photos'), photo);
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
}
