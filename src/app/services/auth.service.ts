import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map, catchError, throwError, BehaviorSubject } from 'rxjs';
import { ApiService } from '@services/api.service';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // signedIn$ exists just for convenience.
  // We can achieve the same checking if user$ is null
  signedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  checked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private api: ApiService) {
    this.api.getCurrentUser().subscribe({
      next: (user: User) => {
        this.signedIn$.next(true);
        this.user$.next(user);
        this.checked$.next(true);
      },
      error: () => {
        this.checked$.next(true);
      }
    });
  }

  signIn(username: string, password: string): Observable<any> {
    return this.api.signIn(username, password).pipe(
      map(res => {
        if (res.msg && (res.msg === 'USER_SIGNEDIN') && res.data.user) {
          this.user$.next(res.data.user);
          this.signedIn$.next(true);
        }
      }),
      catchError((HttpError: HttpErrorResponse) => {
        this.signedIn$.next(false);
        return throwError(() => HttpError.error);
      }),
    );
  }

  register(user: User): Observable<any> {
    return this.api.createUser(user).pipe(
      map(res => {
        if (res.msg && (res.msg === 'USER_CREATED') && res.data.user) {
          this.user$.next(res.data.user);
          this.signedIn$.next(true);
        }
      })
    );
  }

  logOut(): Observable<any> {
    this.signedIn$.next(false);
    this.user$.next(null);
  
    return this.api.logOut().pipe(catchError(() => of(null)));
  }

  getUser(): User | null {
    return this.user$.getValue();
  }

  updateUser(user: User): void {
    this.user$.next(user);
  }
}
