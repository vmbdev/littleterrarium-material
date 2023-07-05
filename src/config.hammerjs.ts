import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import 'hammerjs';

@Injectable({
  providedIn: 'root'
})
export class LTHammerConfig extends HammerGestureConfig {
  override buildHammer(element: HTMLElement): HammerManager {
    return new Hammer.Manager(element, {
     touchAction: 'auto',
     inputClass: Hammer.TouchInput,
     recognizers: [
      [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }],
      [Hammer.Tap, { event: 'doubletap', taps: 2 }],
      [Hammer.Pinch, {
        direction: Hammer.DIRECTION_ALL,
      }],
      [Hammer.Pan, {
        direction: Hammer.DIRECTION_ALL,
      }, ['swipe']]
     ]
   });
 }
}