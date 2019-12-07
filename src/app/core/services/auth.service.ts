import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UtilsService } from '@services/utils.service';

@Injectable()
export class AuthService {
   constructor(private router: Router) {}

   /**
    * Authenticated user has role
    * @param {string} role
    * @returns {boolean}
    */
   public hasRole(role: string): boolean {
      const userRoles = UtilsService.getItemFromLocalStorage('roles');
      if (userRoles && userRoles.length) {
         if (userRoles.includes(role)) {
            return true;
         }
      }
      return false;
   }

   // deprecated
   public canActivate(roles: string[]): boolean {
      if (!!localStorage.getItem('roles') && !!localStorage.getItem('auth_token')) {
         let userRoles: string[];

         try {
            userRoles = JSON.parse(localStorage.getItem('roles'));
         } catch (e) {
            this.router.navigate(['/403']);
            return false;
         }

         for (const role in userRoles) {
            if (roles.indexOf(userRoles[role]) > -1) {
               return true;
            }
         }
      }

      this.router.navigate(['/403']);
      return false;
   }
}
