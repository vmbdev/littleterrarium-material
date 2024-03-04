import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[fullWidth]',
  standalone: true
})
export class FullWidthDirective {
  @HostBinding('style.width') width: string = '100%';
}
