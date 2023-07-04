import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { CurrentStateService } from '@services/current-state.service';

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(private currentStateService: CurrentStateService, private router: Router) {}

   public canActivate() {
      if (this.currentStateService.getUser()) {
         return true;
      }

      this.router.navigate(['/signin']);
      return false;
   }
}
