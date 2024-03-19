import { Injectable, inject } from '@angular/core';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen';
import { EMPTY, Observable, forkJoin, from, switchMap } from 'rxjs';

import { StatusBarService } from '@services/status-bar.service';

@Injectable({
  providedIn: 'root',
})
export class FullscreenService {
  private readonly statusbar = inject(StatusBarService);

  start(): Observable<any> {
    return this.isAvailable().pipe(
      switchMap((isAvailable: boolean) => {
        if (isAvailable) {
          return forkJoin([
            from(AndroidFullScreen.immersiveMode()),
            this.statusbar.hide(),
          ]);
        } else return EMPTY;
      }),
    );
  }

  stop(): Observable<any> {
    return forkJoin([
      from(AndroidFullScreen.showSystemUI()),
      this.statusbar.show(),
    ]);
  }

  isAvailable(): Observable<boolean> {
    return from(AndroidFullScreen.isImmersiveModeSupported());
  }
}
