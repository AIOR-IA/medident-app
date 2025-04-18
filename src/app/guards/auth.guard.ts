import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuth().pipe(
    map(res => {
      if (res) {
        return true;
      } else {
        router.navigateByUrl('/login');
        return false;
      }
    })
  );
};
