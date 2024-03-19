import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { skipWhile, switchMap, tap } from 'rxjs';

import { AuthService } from '@services/auth/auth.service';

export const SignedInGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.checked$.pipe(
    skipWhile((isChecked) => isChecked === false),
    switchMap(() => auth.signedIn$),
    tap((signedIn: boolean) => {
      if (!signedIn) router.navigate(['/signin']);
    })
  );
};
