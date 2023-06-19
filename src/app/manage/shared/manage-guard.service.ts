import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '@services/v2/auth.service';
import { get } from 'lodash';

@Injectable()
export class ManageGuard implements CanActivate {
   constructor(private authService: AuthService, private router: Router) {}

   public canActivate(): boolean {
      const user = this.authService.getUser();
      if (get(user, 'roles.length')) {
         return true;
      }

      this.router.navigate(['/403']);
      return false;
   }
}
