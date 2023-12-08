import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { ErrorHandlerService } from '@services/error-handler.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private readonly errorHandler: ErrorHandlerService,
    private readonly translate: TranslateService
  ) {}

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
              errorMsg = this.translate.instant('errors.field', {
                field: errorData.field,
              });

              if (errorData.values) {
                errorMsg += this.translate.instant('errors.fieldValues', {
                  values: errorData.values.join(','),
                });
              }
              break;
            }
            case 'MISSING_FIELD': {
              errorMsg = this.translate.instant('errors.missingField', {
                field: errorData.field,
              });
              break;
            }
          }
        } else if (res.status === 500)
          errorMsg = this.translate.instant('errors.server');

        if (errorMsg) {
          this.errorHandler.push(errorMsg);

          return EMPTY;
        } else return throwError(() => res);
      })
    );
  }
}
