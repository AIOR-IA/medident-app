import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map(user => {
      if (user?.role === 'admin') {
        return true;
      } else {
        router.navigateByUrl('/calendar');
        return false;
      }
    })
  );
};
