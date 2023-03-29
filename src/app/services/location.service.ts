import { Injectable } from '@angular/core';
import { Light } from '@models/location.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(
    private api: ApiService,
  ) { }

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
