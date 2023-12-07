import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BottomScrollDetectorService {
  // for local count; not to stream if not necessary
  currentValue: boolean = false;
  detected = new Subject<boolean>();
  detected$ = this.detected.asObservable();

  constructor() {}

  set(): void {
    if (!this.currentValue) this.detected.next(true);
  }

  clear(): void {
    if (this.currentValue) this.detected.next(false);
  }
}
