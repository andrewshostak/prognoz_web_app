import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { CurrentStateService } from '@services/current-state.service';
import { get } from 'lodash';

@Injectable()
export class ManageGuard implements CanActivate {
   constructor(private currentStateService: CurrentStateService, private router: Router) {}

   public canActivate(): boolean {
      const user = this.currentStateService.getUser();
      if (get(user, 'roles.length')) {
         return true;
      }

      this.router.navigate(['/403']);
      return false;
   }
}
