import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  of,
  map,
  catchError,
  throwError,
  BehaviorSubject,
  tap,
} from 'rxjs';

import { ApiService, UserPreferences } from '@services/api/api.service';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  // signedIn$ exists just for convenience.
  // We can achieve the same checking if user$ is null
  private signedIn = new BehaviorSubject<boolean>(false);
  public readonly signedIn$ = this.signedIn.asObservable();

  private checked = new BehaviorSubject<boolean>(false);
  public readonly checked$ = this.checked.asObservable();

  private user = new BehaviorSubject<User | null>(null);
  public readonly user$ = this.user.asObservable();

  check(): Observable<boolean> {
    return this.api.getCurrentUser().pipe(
      map((user: User) => {
        this.signedIn.next(true);
        this.user.next(user);
        this.checked.next(true);

        return true;
      }),
      catchError(() => {
        this.checked.next(true);

        return of(false);
      }),
    )
  }

  signIn(username: string, password: string): Observable<User> {
    return this.api.signIn(username, password).pipe(
      map((user: User) => {
        this.user.next(user);
        this.signedIn.next(true);

        return user;
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.signedIn.next(false);
        return throwError(() => HttpError.error);
      })
    );
  }

  register(user: User): Observable<User> {
    return this.api.createUser(user).pipe(
      map((user: User) => {
        this.user.next(user);
        this.signedIn.next(true);

        return user;
      })
    );
  }

  logOut(): Observable<any> {
    this.signedIn.next(false);
    this.user.next(null);

    return this.api.logOut().pipe(catchError(() => of(null)));
  }

  getUser(): User | null {
    return this.user.getValue();
  }

  updateUser(user: User): void {
    this.user.next(user);
  }

  isSameUser(param: 'username' | 'id', val: string | number): boolean {
    const user = this.user.getValue();

    return !!(user && user[param] === val);
  }

  getPref(key: string): any {
    const user = this.user.getValue();

    if (user) {
      if (user.preferences && user.preferences[key]) {
        return user.preferences[key];
      } else return null;
    } else return localStorage.getItem(`LT_${key}`);
  }

  setPref(prefs: UserPreferences): Observable<User | null> {
    const user = this.user.getValue();

    if (user) {
      const newPrefs = {
        ...user.preferences,
        ...prefs,
      };

      return this.api.updatePreferences(newPrefs).pipe(
        tap((user: User) => {
          this.user.next(user);
        }),
      );
    } else {
      for (const [key, value] of Object.entries(prefs)) {
        localStorage.setItem(`LT_${key}`, value);
      }

      return of(null);
    }
  }
}
