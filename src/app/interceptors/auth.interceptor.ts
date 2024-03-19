import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';

import { ErrorHandlerService } from '@services/error-handler/error-handler.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly errorHandler = inject(ErrorHandlerService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    request = request.clone({ withCredentials: true });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.errorHandler.push('Insufficient permissions.');
          return EMPTY;
        } else return throwError(() => error);
      }),
    );
  }
}
