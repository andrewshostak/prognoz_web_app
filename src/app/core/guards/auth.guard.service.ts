import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthNewService } from '@services/v2/auth-new.service';

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(private authService: AuthNewService, private router: Router) {}

   public canActivate() {
      if (this.authService.getUser()) {
         return true;
      }

      this.router.navigate(['/signin']);
      return false;
   }
}
