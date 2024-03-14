import { Directive, ElementRef, effect, inject, input } from '@angular/core';

@Directive({
  selector: '[limitLargeScreen]',
  standalone: true,
  host: {
    '[style.margin-left]': '"auto"',
    '[style.margin-right]': '"auto"',
  },
})
export class LimitLargeScreenDirective {
  el = inject(ElementRef);
  width = input<number>(768);

  changeWidth = effect(() => {
    this.el.nativeElement.style.maxWidth = this.width() + 'px';
  });
}
