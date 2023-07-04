import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { CurrentStateService } from '@services/current-state.service';
import { get } from 'lodash';

@Injectable()
export class PermissionGuard implements CanActivate {
   constructor(private currentStateService: CurrentStateService, private router: Router) {}

   public canActivate(route: ActivatedRouteSnapshot): boolean {
      if (!get(route, 'data.permissions')) {
         this.router.navigate(['/403']);
         return false;
      }

      const permissions: string[] = get(route, 'data.permissions') || [];

      if (this.currentStateService.hasPermissions(permissions, true)) {
         return true;
      }

      this.router.navigate(['/403']);
      return false;
   }
}
