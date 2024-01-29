import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  map,
  Observable,
  throwError,
} from 'rxjs';

import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ApiService, PhotoGetConfig } from '@services/api.service';
import { Photo } from '@models/photo.model';
import { BackendResponse } from '@models/backend-response.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photo = new BehaviorSubject<Photo | null>(null);
  public readonly photo$ = this.photo.asObservable();
  private owned = new BehaviorSubject<boolean>(false);
  public readonly owned$ = this.owned.asObservable();

  constructor(
    private readonly api: ApiService,
    private readonly auth: AuthService,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  get(id: number, options?: PhotoGetConfig): Observable<Photo> {
    return this.api.getPhoto(id, options).pipe(
      map((photo: Photo) => {
        this.owned.next(this.auth.getUser()?.id === photo.ownerId);
        this.photo.next(photo);

        return photo;
      }),
      catchError((error: HttpErrorResponse) => {
        this.photo.next(null);

        return throwError(() => error);
      })
    );
  }

  getNavigation(id: number): Observable<any> {
    return this.api.getPhotoNavigation(id);
  }

  create(
    photo: Photo,
    propagateError: boolean = false
  ): Observable<HttpEvent<BackendResponse>> {
    return this.api.createPhoto(photo).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') {
          this.errorHandler.push('Invalid image.');
        }

        if (propagateError) return throwError(() => error);
        else return EMPTY;
      })
    );
  }

  update(photo: Photo): Observable<Photo> {
    return this.api.updatePhoto(photo).pipe(
      map((updatedPhoto: Photo) => {
        this.photo.next(updatedPhoto);

        return updatedPhoto;
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
}
