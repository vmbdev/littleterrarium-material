import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Location } from '@models/location.model';
import { Photo } from '@models/photo.model';
import { Plant } from '@models/plant.model';
import { Specie } from '@models/specie.model';
import { User } from '@models/user.model';
import { endpoint } from '@config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions: any = {};

  constructor(private http: HttpClient) {
    this.httpOptions.withCredentials = true;
  }

  endpoint = (path: string) => {
    return `${endpoint}/${path}`;
  }

  getLocales(): Observable<any> {
    return this.http.get<any>(this.endpoint('angular/locales'));
  }

  /**
   * Auth and user API functions
   */

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.endpoint('user'))
  }

  getUserByName(username: string): Observable<User> {
    return this.http.get<User>(this.endpoint(`user/${username}`));
  }

  signIn(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.endpoint('user/signin'), { username, password });
  }

  logOut(): Observable<any> {
    return this.http.get<any>(this.endpoint('user/logout'));
  }

  getPasswordRequirements(): Observable<any> {
    return this.http.get<any>(this.endpoint('user/password/requirements'));
  }

  getUsernameRequirements(): Observable<any> {
    return this.http.get<any>(this.endpoint('user/username/requirements'));
  }

  checkPassword(password: string): Observable<any> {
    return this.http.post<any>(this.endpoint('user/password/check'), { password });
  }

  createUser(user: User): Observable<any> {
    return this.http.post<User>(this.endpoint('user'), user);
  }

  editUser(user: User, removeAvatar?: boolean): Observable<any> {
    const form = new FormData();

    form.append('username', user.username);
    form.append('email', user.email);

    if (user.firstname) form.append('firstname', user.firstname);
    if (user.lastname) form.append('lastname', user.lastname);
    if (user.bio) form.append('bio', user.bio);
    if (user.public) form.append('public', user.public.toString());

    if (removeAvatar) form.append('removeAvatar', 'true');
    else if (user.avatarFile) form.append('avatar', user.avatarFile);

    return this.http.put<User>(this.endpoint('user'), form);
  }

  /**
   * Location related calls
   */

  getLocation(id: number, plants?: boolean, limit?: number): Observable<Location> {
    const url = `location/${id}?plants=${plants ? 'true' : 'false'}&limit=${limit ? limit : 0}`;

    return this.http.get<Location>(this.endpoint(url));
  }

  // retrieve location list for current user
  getLocationList(options?: any): Observable<Location[]> {
    console.log('te');
    let url = 'location';

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
  upsertLocation(location: Location, update?: boolean, removePicture?: boolean): Observable<any> {
    let observable;
    const form = new FormData();

    form.append('name', location.name);
    form.append('light', location.light);
    form.append('public', location.public.toString());

    if (removePicture) form.append('removePicture', 'true');
    else if (location.pictureFile) form.append('picture', location.pictureFile);

    if (location.id && update) form.append('id', location.id.toString());

    if (update) observable = this.http.put<Location>(this.endpoint('location'), form);
    else observable = this.http.post<Location>(this.endpoint('location'), form);

    return observable.pipe(
      map((data: any) => {
        if ((data.msg === 'LOCATION_CREATED') || (data.msg === 'LOCATION_UPDATED')) {
          return data;
        }
      })
    )
  }

  createLocation(location: Location): Observable<Location> {
    return this.upsertLocation(location);
  }

  updateLocation(location: Location, removePicture = false): Observable<any> {
    return this.upsertLocation(location, true, removePicture);
  }

  deleteLocation(id: number): Observable<any> {
    return this.http.delete<number>(this.endpoint(`location/${id}`));
  }

  /**
   * Plant related calls
   */

  getPlants(options?: any): Observable<Plant[]> {
    let url = 'plant';

    if (options) {
      if (options.userId && +options.userId) {
        url += `/user/${+options.userId}`;
      }

      if (options.locationId && +options.locationId) {
        url += `/location/${+options.locationId}`;
      }

      if (options.photos || options.cover) {
        url += `?photos=${options.photos ? true : false}&cover=${options.cover ? true : false}`;
      }
    }

    return this.http.get<Plant[]>(this.endpoint(url));
  }

  getPlant(id: number, options?: any): Observable<Plant> {
    let url = `plant/${id}`;

    if (options && (options.photos || options.cover)) {
      url += `?photos=${options.photos ? true : false}&cover=${options.cover ? true : false}`;
    }

    return this.http.get<Plant>(this.endpoint(url));
  }

  createPlant(plant: Plant): Observable<any> {
    return this.http.post<Plant>(this.endpoint('plant'), plant);
  }

  updatePlant(plant: Plant, options?: any): Observable<Plant> {
    const data = plant as any;

    if (options) {
      if (options.removeSpecie) data.removeSpecie = true;
      if (options.removeCover) data.removeCover = true;
    }

    return this.http.put<any>(this.endpoint('plant'), data).pipe(
      map((res: any) => {
        if (res.msg === 'PLANT_UPDATED') return res.data.plant;
      })
    )
  }

  deletePlant(id: number): Observable<any> {
    return this.http.delete<number>(this.endpoint(`plant/${id}`));
  }

  /**
   * Photo related calls
   */

  getPhoto(id: number, options?: any): Observable<Photo> {
    let url = `photo/${id}`;

    // TODO: create proper API to do this
    if (options) {
      url += '?';
      if (options.navigation) url += `navigation=${options.navigation ? 'true' : 'false' }&`;
      if (options.cover) url += `cover=${options.cover ? 'true' : 'false'}&`;
    }

    return this.http.get<Photo>(this.endpoint(url));
  }

  createPhoto(photo: Photo): Observable<any> {
    const form = new FormData();

    form.append('plantId', photo.plantId.toString());
    form.append('public', photo.public.toString());
    photo.pictureFiles.forEach((photo) => {
      form.append('photo', photo);
    });

    return this.http.post<Photo>(this.endpoint('photo'), form, { reportProgress: true, observe: 'events' });
  }

  updatePhoto(photo: Photo): Observable<any> {
    return this.http.put<Photo>(this.endpoint('photo'), photo).pipe(
      map((res: any) => {
        if (res.msg === 'PHOTO_UPDATED') return res.data.photo;
      })
    )
  }

  deletePhoto(id: number): Observable<any> {
    return this.http.delete(this.endpoint(`photo/${id}`));
  }

  /**
   * Specie related calls
   */

  getSpecie(id: number): Observable<Specie> {
    return this.http.get<Specie>(this.endpoint(`specie/${id}`));
  }

  findSpecie(name: string): Observable<Specie[]> {
    return this.http.get<Specie[]>(this.endpoint(`specie/name/${name}`));
  }

  /**
   * Tasks related calls
   */

  getTasks(): Observable<Plant[]> {
    return this.http.get<Plant[]>(this.endpoint('tasks'));
  }
}
