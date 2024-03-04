import { Directive, HostListener, inject } from '@angular/core';

import { BottomScrollDetectorService } from '@services/bottom-scroll-detector.service';

@Directive({
  selector: '[bottomScroll]',
  standalone: true,
})
export class BottomScrollDirective {
  private readonly bottomScrollDetector = inject(BottomScrollDetectorService);

  @HostListener('scrollend', ['$event'])
  public onBottomReached(event: Event) {
    const target = event.target as HTMLElement;
    const gotBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight;

    if (gotBottom <= 1.0) {
      this.bottomScrollDetector.set();
    } else this.bottomScrollDetector.clear();
  }
}
