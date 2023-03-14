import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map, Observable, skipWhile } from 'rxjs';
import { AuthService } from '@services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.checked$.pipe(
      skipWhile(isChecked => isChecked === false),
      map(() => {
        const isSignedIn = !!this.auth.user$.getValue();

        if (!isSignedIn) this.router.navigate(['/signin']);

        return isSignedIn;
      })
    );

  }

}
