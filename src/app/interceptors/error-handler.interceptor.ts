import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';

import { ErrorHandlerService } from '@services/error-handler.service';

// FIXME: translate
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private errorHandler: ErrorHandlerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((res: HttpErrorResponse) => {
        let errorMsg: string | undefined;

        if (res.status === 400) {
          switch (res.error.msg) {
            case 'INCORRECT_FIELD': {
              errorMsg = `Incorrect field (${res.error.errorData.field}).`;

              if (res.error.errorData.values) {
                errorMsg +=
                  `Possible values are ${res.error.errorData.values.join(',')}`;
              }
              break;
            }
            case 'MISSING_FIELD': {
              errorMsg = `Missing field (${res.error.errorData.field})`;
              break;
            }
          }
        } else if (res.status === 500) errorMsg = 'Server error';

        if (errorMsg) {
          this.errorHandler.push(errorMsg);

          return EMPTY;
        } else return throwError(() => res);
      })
    );
  }
}
