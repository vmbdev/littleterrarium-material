import { Injectable } from '@angular/core';
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
}
