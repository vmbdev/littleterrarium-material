import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { ViewerComponent } from '@components/viewer/viewer.component';
import { VIEWER_DATA } from 'src/tokens';

@Injectable({
  providedIn: 'root',
})
export class ViewerService {
  private readonly overlay = inject(Overlay);
  private overlayRef?: OverlayRef;

  create(image: string) {
    this.overlayRef = this.overlay.create({
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
                this.overlayRef?.dispose();
              },
            },
          },
        ],
      })
    );

    this.overlayRef.attach(portal);
  }

  destroy() {
    if (this.overlayRef) this.overlayRef.dispose();
  }
}
