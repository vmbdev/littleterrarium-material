import { Injectable } from '@angular/core';
import { Light, Location } from '@models/location.model';
import { Plant } from '@models/plant.model';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PlantService } from './plant.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(
    private api: ApiService,
    private plantService: PlantService
  ) { }

  get(id: number, plants?: boolean, limit?: number): Observable<Location>  {
    return this.api.getLocation(id, plants, limit);
  }

  getMany(options?: any): Observable<Location[]> {
    return this.api.getLocationList(options);
  }

  getPlants(id:number, options?: any): Observable<Plant[]> {
    return this.api.getLocationPlants(id, options).pipe(
      map((plants: Plant[]) => {
        for (const plant of plants) {
          plant.visibleName = this.plantService.getVisibleName(plant);
        }

        return plants;
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.api.deleteLocation(id);
  }

  getLightName(light: string): string {
    return Light[light].desc;
  }

  getLightVerbose(light: string): string {
    return Light[light].verbose;
  }

  getLightAsset(light: string): string {
    let icon: string;

    if (light === 'FULLSUN') icon = 'brightness_7';
    else if (light === 'PARTIALSUN') icon = 'brightness_6';
    else icon = 'brightness_5';

    return icon;
  }
}
