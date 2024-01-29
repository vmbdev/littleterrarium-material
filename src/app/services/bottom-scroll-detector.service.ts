import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BottomScrollDetectorService {
  // for local count; not to stream if not necessary
  private currentValue: boolean = false;
  private detected = new Subject<boolean>();
  public readonly detected$ = this.detected.asObservable();

  set(): void {
    if (!this.currentValue) this.detected.next(true);
  }

  clear(): void {
    if (this.currentValue) this.detected.next(false);
  }
}
