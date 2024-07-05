import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BottomScrollDetectorService {
  readonly #$detected: WritableSignal<number | null> = signal(null);
  public readonly $detected = this.#$detected.asReadonly();

  set(): void {
    const tstamp = Date.now();
    const lastTstamp = this.#$detected();
    const diff = !lastTstamp || tstamp - lastTstamp > 200;

    if (lastTstamp !== tstamp && diff) {
      this.#$detected.set(tstamp);
    }
  }

  clear(): void {
    this.#$detected.set(null);
  }
}
