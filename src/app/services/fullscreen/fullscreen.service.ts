import { Injectable, inject } from '@angular/core';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen';
import {
  Observable,
  filter,
  forkJoin,
  from,
  switchMap,
} from 'rxjs';

import { StatusBarService } from '@services/status-bar/status-bar.service';
import { DeviceService } from '@services/device/device.service';

@Injectable({
  providedIn: 'root',
})
export class FullscreenService {
  private readonly device = inject(DeviceService);
  private readonly statusbar = inject(StatusBarService);

  start(): Observable<any> {
    return this.isAvailable().pipe(
      switchMap(() =>
        forkJoin([
          from(AndroidFullScreen.immersiveMode()),
          this.statusbar.hide(),
        ]),
      ),
    );
  }

  stop(): Observable<any> {
    return this.isAvailable().pipe(
      switchMap(() =>
        forkJoin([
          from(AndroidFullScreen.showSystemUI()),
          this.statusbar.show(),
        ]),
      ),
    );
  }

  isAvailable(): Observable<boolean> {
    return this.device.getOS().pipe(
      filter((os) => os === 'android'),
      switchMap(() => from(AndroidFullScreen.isImmersiveModeSupported())),
      filter((isAvailable) => isAvailable),
    );
  }
}
