import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';

import { AuthService } from '@services/auth.service';

@Injectable()
export class ManageCupGuard implements CanActivate, CanActivateChild {
   constructor(private authService: AuthService) {}

   public canActivate(): boolean {
      return this.authService.canActivate(['admin', 'cup_match_editor', 'cup_stage_editor', 'cup_cup_match_editor']);
   }

   public canActivateChild(): boolean {
      return this.authService.canActivate(['admin', 'cup_match_editor', 'cup_stage_editor', 'cup_cup_match_editor']);
   }
}
