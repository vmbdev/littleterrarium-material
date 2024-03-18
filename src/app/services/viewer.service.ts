import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { ViewerComponent } from '@components/viewer/viewer.component';
import { VIEWER_DATA } from 'src/tokens';

@Injectable({
  providedIn: 'root',
})
export class ViewerService {
  private readonly overlay = inject(Overlay);

  create(image: string) {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'overlay-backdrop'
    });
    const portal = new ComponentPortal(
      ViewerComponent,
      null,
      Injector.create({
        providers: [
          {
            provide: VIEWER_DATA,
            useValue: {
              src: image,
              close: () => {
                overlayRef.dispose();
              },
            },
          },
        ],
      })
    );

    overlayRef.attach(portal);
  }
}
