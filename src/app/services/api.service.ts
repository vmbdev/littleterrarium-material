import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Location } from '@models/location.model';
import { Photo } from '@models/photo.model';
import { Plant } from '@models/plant.model';
import { Specie } from '@models/specie.model';
import { User } from '@models/user.model';
import { BackendResponse } from '@models/backend-response.model';
import { endpoint } from '@config';
import { BACKEND_URL } from 'src/tokens';

export interface PlantGetConfig {
  userId?: number,
  locationId?: number,
  photos?: boolean,
  cover?: boolean
}

export interface PlantUpdateConfig {
  removeSpecie?: boolean,
  removeCover?: boolean
}

export interface PhotoGetConfig {
  navigation?: boolean,
  cover?: boolean
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

  getLocales(): Observable<any> {
    return this.http.get<any>(this.endpoint('angular/locales'));
  }

  /**
   * Auth and user API functions
   */

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.endpoint('users'))
  }

  getUserByName(username: string): Observable<User> {
    return this.http.get<User>(this.endpoint(`users/${username}`));
  }

  signIn(username: string, password: string): Observable<User> {
    return this.http.post<User>(this.endpoint('users/signin'), { username, password });
  }

  logOut(): Observable<any> {
    return this.http.get<any>(this.endpoint('users/logout'));
  }

  getPasswordRequirements(): Observable<BackendResponse> {
    return this.http.get<BackendResponse>(this.endpoint('users/password/requirements'));
  }

  getUsernameRequirements(): Observable<BackendResponse> {
    return this.http.get<BackendResponse>(this.endpoint('users/username/requirements'));
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

  getLocation(id: number, plants?: boolean, limit?: number): Observable<Location> {
    const url = `locations/${id}?plants=${plants ? 'true' : 'false'}&limit=${limit ? limit : 0}`;

    return this.http.get<Location>(this.endpoint(url));
  }

  // retrieve location list for current user
  getLocationList(options?: any): Observable<Location[]> {
    let url = 'locations';

    if (options) {
      if (options.userId && +options.userId) url += `/user/${+options.userId}`;

      if (options.plantCount) url += '?plantcount=true';
      else if (options.plants) url += `?plants=${(options.plants ? 'true' : 'false')}&limit=${(options.limit ? options.limit : 3)}`;
    }

    return this.http.get<Location[]>(this.endpoint(url));
  }

  /**
   * Creates a new Location or updates an existing one.
   * @param location The location to be upserted
   * @param update Whether we're creating (false/null) or updating (true) an existing one.
   * @returns An observable with the server response.
   */
  // FIXME: removePicture -> LocationUpsertConfig
  upsertLocation(location: Location, update?: boolean, removePicture?: boolean): Observable<Location> {
    let observable;
    const form = new FormData();

    form.append('name', location.name);
    form.append('light', location.light);
    form.append('public', location.public.toString());

    if (removePicture) form.append('removePicture', 'true');
    else if (location.pictureFile) form.append('picture', location.pictureFile);

    if (location.id && update) form.append('id', location.id.toString());

    if (update) observable = this.http.put<Location>(this.endpoint('locations'), form);
    else observable = this.http.post<Location>(this.endpoint('locations'), form);

    return observable;
  }

  createLocation(location: Location): Observable<Location> {
    return this.upsertLocation(location);
  }

  updateLocation(location: Location, removePicture = false): Observable<Location> {
    return this.upsertLocation(location, true, removePicture);
  }

  deleteLocation(id: number): Observable<any> {
    return this.http.delete<any>(this.endpoint(`locations/${id}`));
  }

  /**
   * Plant related calls
   */

  getPlants(options?: PlantGetConfig): Observable<Plant[]> {
    let url = 'plants';

    if (options) {
      if (options.userId) url += `/user/${options.userId}`;
      if (options.locationId) url += `/location/${options.locationId}`;
      if (options.photos || options.cover) {
        url += `?photos=${options.photos ? true : false}&cover=${options.cover ? true : false}`;
      }
    }

    return this.http.get<Plant[]>(this.endpoint(url));
  }

  getPlant(id: number, options?: any): Observable<Plant> {
    let url = `plants/${id}`;

    if (options && (options.photos || options.cover)) {
      url += `?photos=${options.photos ? true : false}&cover=${options.cover ? true : false}`;
    }

    return this.http.get<Plant>(this.endpoint(url));
  }

  getPlantCover(id: number): Observable<any> {
    return this.http.get<any>(this.endpoint(`plants/${id}/cover`));
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

  getPhotoNavigation(id: number): Observable<any> {
    return this.http.get<any>(this.endpoint(`photos/${id}/navigation`));
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
