import { BehaviorSubject, EMPTY, map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Location } from '@models/location.model';
import { Plant } from '@models/plant.model';
import { ApiService, LocationGetConfig, LocationUpsertConfig, PlantGetConfig } from './api.service';
import { AuthService } from './auth.service';
import { PlantService } from './plant.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private location = new BehaviorSubject<Location | null>(null);
  public location$ = this.location.asObservable();
  public owned: boolean = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private plantService: PlantService,
  ) { }

  create(location: Location): Observable<Location> {
    this.location.next(null);

    return this.api.createLocation(location).pipe(
      map((location: Location) => {
        this.location.next(location);

        return location;
      })
    )
  }

  get(id: number, options?: LocationGetConfig): Observable<Location>  {
    this.location.next(null);

    return this.api.getLocation(id, options).pipe(
      map((location: Location) => {
        this.owned = (this.auth.getUser()?.id === location.ownerId);

        this.location.next(location);

        return location;
      })
    );
  }

  getMany(options?: any): Observable<Location[]> {
    return this.api.getLocationList(options);
  }

  getPlants(id:number, options?: PlantGetConfig): Observable<Plant[]> {
    return this.api.getLocationPlants(id, options).pipe(
      map((plants: Plant[]) => {
        for (const plant of plants) {
          plant.visibleName = this.plantService.getVisibleName(plant);
        }

        return plants;
      })
    );
  }

  update(location: Location, options?: LocationUpsertConfig): Observable<Location> {
    return this.api.updateLocation(location, options).pipe(
      map((location: Location) => {
        this.location.next(location);

        return location;
      })
    )
  }

  delete(id: number): Observable<any> {
    return this.api.deleteLocation(id).pipe(
      map(() => {
        this.location.next(null);

        return EMPTY;
      })
    )
  }

  current(): Location | null {
    return this.location.getValue();
  }

  getLightName(light: string): string {
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
      default:
      case 'SHADE': {
        desc = 'light.shadeDesc';
        break;
      }
    }

    return desc;
  }

  getLightVerbose(light: string): string {
    let desc: string;

    switch (light) {
      case 'FULLSUN': {
        desc = 'light.fullsunVerbose';
        break;      
      }
      case 'PARTIALSUN': {
        desc = 'light.partialsunVerbose';
        break;      
      }
      default:
      case 'SHADE': {
        desc = 'light.shadeVerbose';
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
