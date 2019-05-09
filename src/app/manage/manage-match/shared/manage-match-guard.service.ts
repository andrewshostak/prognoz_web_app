import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';

import { AuthService } from '@services/auth.service';

@Injectable()
export class ManageMatchGuard implements CanActivate, CanActivateChild {
   constructor(private authService: AuthService) {}

   public canActivate(): boolean {
      return this.authService.canActivate(['admin', 'match_editor']);
   }

   public canActivateChild(): boolean {
      return this.authService.canActivate(['admin', 'match_editor']);
   }
}
