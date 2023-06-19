import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '@services/v2/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(private authService: AuthService, private router: Router) {}

   public canActivate() {
      if (this.authService.getUser()) {
         return true;
      }

      this.router.navigate(['/signin']);
      return false;
   }
}
