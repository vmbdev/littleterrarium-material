import { Directive, ElementRef, inject } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Observable, fromEvent, map, throttleTime } from 'rxjs';

export type ScrollDirection = 'Up' | 'Down';

@Directive({
  selector: '[scrollDetector]',
  standalone: true,
})
export class ScrollDetectorDirective {
  #el = inject(ElementRef);

  #obs$: Observable<ScrollDirection> = fromEvent<Event>(
    this.#el.nativeElement,
    'scroll',
  ).pipe(
    throttleTime(200),
    map((event: Event) => {
      const currScroll = (event.target as HTMLElement).scrollTop;
      let res: ScrollDirection;

      if (currScroll > this.#prevScrollValue) res = 'Down';
      else res = 'Up';

      this.#prevScrollValue = currScroll;

      return res;
    }),
  );
  scrollDirection = outputFromObservable<ScrollDirection>(this.#obs$);

  #prevScrollValue: number = 0;
}
