import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private readonly toastr = inject(ToastrService);

  push(error: string) {
    this.toastr.error(error, undefined, {
      positionClass: 'toast-bottom-center',
      disableTimeOut: true,
    });
  }
}
