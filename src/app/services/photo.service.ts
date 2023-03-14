import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, throwError } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ApiService } from '@services/api.service';
import { Photo } from '@models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  photo$: BehaviorSubject<Photo | null> = new BehaviorSubject<Photo | null>(null);
  owned: boolean = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private errorHandler: ErrorHandlerService
  ) { }

  get(id: number, options?: any): Observable<any> {
    return this.api.getPhoto(id, options).pipe(
      map((res: any) => {
        this.owned = (this.auth.user$.getValue()?.id === res.data.photo.ownerId);
        this.photo$.next(res.data.photo);

        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        this.photo$.next(null);

        return throwError(() => error);
      })
    );
  }

  create(photo: Photo, propagateError: boolean = false): Observable<any> {
    return this.api.createPhoto(photo).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') this.errorHandler.push('Invalid image.');

        if (propagateError) return throwError(() => error);
        else return EMPTY;
      })
    );
  }

  update(photo: Photo): Observable<any> {
    return this.api.updatePhoto(photo).pipe(
      map((updatedPhoto: Photo) => {
        this.photo$.next(updatedPhoto);
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.photo$.next(null);

        return throwError(() => HttpError);
      })
    );
  }

  delete(): Observable<any> {
    const photo = this.photo$.getValue();

    if (photo) {
      const id = photo.id;

      return this.api.deletePhoto(id).pipe(
        map((data: any) => {
          this.photo$.next(null);
          return data;
        })
      );
    }
    else return of(null);
  }

}
