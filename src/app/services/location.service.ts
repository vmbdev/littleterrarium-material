import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, map, Observable, tap } from 'rxjs';

import {
  ApiService,
  LocationGetConfig,
  LocationUpsertConfig,
  PlantGetConfig,
} from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { PlantService } from '@services/plant.service';
import { Location } from '@models/location.model';
import { Plant } from '@models/plant.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private location = new BehaviorSubject<Location | null>(null);
  public readonly location$ = this.location.asObservable();
  private owned = new BehaviorSubject<boolean>(false);
  public readonly owned$ = this.owned.asObservable();

  constructor(
    private readonly api: ApiService,
    private readonly auth: AuthService,
    private readonly plantService: PlantService,
  ) {}

  create(location: Location): Observable<Location> {
    this.location.next(null);

    return this.api.createLocation(location).pipe(
      tap((location: Location) => {
        this.location.next(location);
      })
    );
  }

  get(id: number, options?: LocationGetConfig): Observable<Location> {
    this.location.next(null);

    return this.api.getLocation(id, options).pipe(
      tap((location: Location) => {
        this.owned.next(this.auth.getUser()?.id === location.ownerId);
        this.location.next(location);
      })
    );
  }

  getMany(options?: LocationGetConfig): Observable<Location[]> {
    return this.api.getLocationList(options);
  }

  getPlants(id: number, options?: PlantGetConfig): Observable<Plant[]> {
    return this.api.getLocationPlants(id, options).pipe(
      map((plants: Plant[]) => {
        const newPlants = [];

        for (const plant of plants) {
          const newPlant = { ...plant };

          newPlant.visibleName = this.plantService.getVisibleName(newPlant);
          newPlants.push(newPlant);
        }

        return newPlants;
      })
    );
  }

  countPlants(id: number): Observable<number> {
    return this.api.countLocationPlants(id);
  }

  update(
    location: Location,
    options?: LocationUpsertConfig
  ): Observable<Location> {
    return this.api.updateLocation(location, options).pipe(
      tap((location: Location) => {
        this.location.next(location);
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.api.deleteLocation(id).pipe(
      tap(() => {
        this.location.next(null);
      })
    );
  }

  current(): Location | null {
    return this.location.getValue();
  }

  empty(): void {
    this.location.next(null);
    this.owned.next(false);
  }

  getLightName(light: string): string {
    let desc: string;

    switch (light) {
      case 'FULLSUN': {
        desc = 'light.fullsun';
        break;
      }
      case 'PARTIALSUN': {
        desc = 'light.partialsun';
        break;
      }
      default: {
        desc = 'light.shade';
        break;
      }
    }

    return desc;
  }

  getLightDesc(light: string): string {
    let desc: string;

    switch (light) {
      case 'FULLSUN': {
        desc = 'light.fullsunDesc';
        break;
      }
      case 'PARTIALSUN': {
        desc = 'light.partialsunDesc';
        break;
      }
      default: {
        desc = 'light.shadeDesc';
        break;
      }
    }

    return desc;
  }

  getLightAsset(light: string): string {
    let icon: string;

    if (light === 'FULLSUN') icon = 'brightness_7';
    else if (light === 'PARTIALSUN') icon = 'brightness_6';
    else icon = 'brightness_5';

    return icon;
  }
}
