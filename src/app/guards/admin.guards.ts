import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, skipWhile, switchMap } from 'rxjs';

import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { User } from '@models/user.model';

export const AdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const errorHandler = inject(ErrorHandlerService);

  return auth.checked$.pipe(
    skipWhile((isChecked) => isChecked === false),
    switchMap(() => auth.user$),
    map((user: User | null) => {
      if (user?.role === 'ADMIN') return true;
      else {
        // errorHandler.push(
        //   $localize`:@@auth-interceptor.forbidden:Insufficient permissions.`
        // );
        router.navigate(['/']);

        return false;
      }
    })
  );
};
