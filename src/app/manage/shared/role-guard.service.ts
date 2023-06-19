import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';

import { AuthService } from '@services/v2/auth.service';
import { get } from 'lodash';

@Injectable()
export class RoleGuard implements CanActivate, CanActivateChild {
   constructor(private authService: AuthService, private router: Router) {}

   public canActivate(route: ActivatedRouteSnapshot): boolean {
      if (!get(route, 'data.roles')) {
         this.router.navigate(['/403']);
         return false;
      }

      const roles: string[] = get(route, 'data.roles') || [];

      if (this.authService.hasRoles(roles, true)) {
         return true;
      }

      this.router.navigate(['/403']);
      return false;
   }

   public canActivateChild(childRoute: ActivatedRouteSnapshot): boolean {
      return this.canActivate(childRoute);
   }
}
