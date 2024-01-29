import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private readonly toastr: ToastrService) {}

  push(error: string) {
    this.toastr.error(error, undefined, {
      positionClass: 'toast-bottom-center',
      disableTimeOut: true,
    });
  }
}
