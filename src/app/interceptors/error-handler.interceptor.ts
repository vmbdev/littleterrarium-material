import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { ErrorHandlerService } from '@services/error-handler.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly translate = inject(TranslocoService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((res: HttpErrorResponse) => {
        let errorMsg: string | undefined;

        if (res.status === 400) {
          const errorData = res.error.errorData;

          switch (res.error.msg) {
            case 'INCORRECT_FIELD': {
              errorMsg = this.translate.translate('errors.field', {
                field: errorData.field,
              });

              if (errorData.values) {
                errorMsg += this.translate.translate('errors.fieldValues', {
                  values: errorData.values.join(','),
                });
              }
              break;
            }
            case 'MISSING_FIELD': {
              errorMsg = this.translate.translate('errors.missingField', {
                field: errorData.field,
              });
              break;
            }
          }
        } else if (res.status === 500)
          errorMsg = this.translate.translate('errors.server');

        if (errorMsg) {
          this.errorHandler.push(errorMsg);

          return EMPTY;
        } else return throwError(() => res);
      })
    );
  }
}
