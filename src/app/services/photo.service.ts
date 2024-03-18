import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  tap,
  throwError,
} from 'rxjs';

import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ApiService } from '@services/api.service';
import { Photo } from '@models/photo.model';
import { BackendResponse } from '@models/backend-response.model';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly translate = inject(TranslocoService);

  private photo = new BehaviorSubject<Photo | null>(null);
  public readonly photo$ = this.photo.asObservable();
  readonly #$owned: WritableSignal<boolean> = signal(false);
  public readonly $owned = this.#$owned.asReadonly();

  get(id: number): Observable<Photo> {
    return this.api.getPhoto(id).pipe(
      tap((photo: Photo) => {
        this.#$owned.set(this.auth.getUser()?.id === photo.ownerId);
        this.photo.next(photo);
      }),
      catchError((err: HttpErrorResponse) => {
        let msg: string;

        if (err.error?.msg === 'PHOTO_NOT_FOUND') msg = 'photo.invalid';
        else msg = 'errors.server';

        this.errorHandler.push(this.translate.translate(msg));
        this.photo.next(null);

        return throwError(() => err);
      })
    );
  }

  getNavigation(id: number): Observable<any> {
    return this.api.getPhotoNavigation(id).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.error?.msg === 'PHOTO_NOT_FOUND') {
          this.errorHandler.push(this.translate.translate('photo.invalid'));
        }

        return throwError(() => err);
      }),
    );
  }

  create(
    photo: Photo,
    propagateError: boolean = false
  ): Observable<HttpEvent<BackendResponse>> {
    return this.api.createPhoto(photo).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') {
          this.errorHandler.push(this.translate.translate('errors.invalidImg'));
        }

        if (propagateError) return throwError(() => error);
        else return EMPTY;
      })
    );
  }

  update(photo: Photo): Observable<Photo> {
    return this.api.updatePhoto(photo).pipe(
      tap((updatedPhoto: Photo) => {
        this.photo.next(updatedPhoto);
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.photo.next(null);

        return throwError(() => HttpError);
      })
    );
  }

  delete(id?: number): Observable<any> {
    if (!id) id = this.photo.getValue()?.id;

    if (id) return this.api.deletePhoto(id);
    else return EMPTY;
  }

  current(): Photo | null {
    return this.photo.getValue();
  }

  empty(): void {
    this.photo.next(null);
    this.#$owned.set(false);
  }
}
