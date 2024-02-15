import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, skipWhile, switchMap } from 'rxjs';
import { AuthService } from '@services/auth.service';

export const NotSignedInGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.checked$.pipe(
    skipWhile((isChecked) => isChecked === false),
    switchMap(() => auth.signedIn$),
    map((signedIn: boolean) => {
      if (signedIn) router.navigate(['/']);

      return !signedIn;
    })
  );
};
