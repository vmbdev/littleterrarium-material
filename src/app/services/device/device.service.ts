import { Injectable } from '@angular/core';
import { Device, OperatingSystem } from '@capacitor/device';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  getOS(): Observable<OperatingSystem> {
    return from(Device.getInfo()).pipe(map((info) => info.operatingSystem));
  }
}
