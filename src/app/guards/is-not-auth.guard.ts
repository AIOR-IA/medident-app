import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const isNotAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuth().pipe(
      map(res => {
        if (res) {
          router.navigateByUrl('/calendar');
          return false;
        } else {
          return true;
        }
      })
    );
};
