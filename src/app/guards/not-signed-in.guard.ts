import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, skipWhile } from 'rxjs';
import { AuthService } from '@services/auth.service';

export const NotSignedInGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.checked$.pipe(
    skipWhile((isChecked) => isChecked === false),
    map(() => {
      const isSignedIn = !!auth.getUser();

      if (isSignedIn) router.navigate(['/']);

      return !isSignedIn;
    })
  );
};
