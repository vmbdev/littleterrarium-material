import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, skipWhile } from 'rxjs';
import { AuthService } from '@services/auth.service';

export const AuthGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.checked$.pipe(
    skipWhile(isChecked => isChecked === false),
    map(() => {
      const isSignedIn = !!auth.user$.getValue();

      if (!isSignedIn) router.navigate(['/signin']);

      return isSignedIn;
    })
  );
}
