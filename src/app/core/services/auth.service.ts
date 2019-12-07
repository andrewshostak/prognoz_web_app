import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { UtilsService } from '@services/utils.service';
import { Observable } from 'rxjs';
import { catchError, share } from 'rxjs/operators';

@Injectable()
export class AuthService {
   public getUser: Observable<any>;
   private authUrl = environment.apiUrl + 'auth/';
   private userObserver: any;

   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient,
      private router: Router
   ) {
      this.getUser = new Observable(observer => {
         this.userObserver = observer;
      }).pipe(share());
   }

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

   // todo: use this method in all guards
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

   /**
    * Update user data if token and old user data is present in localStorage.
    * If response error happens, it will clear user data and roles.
    */
   public initializeUser() {
      if (this.isUserAndTokenInLocalStorage()) {
         this.refresh().subscribe(
            response => {
               this.updateItemInLocalStorage('user', response.user);
               this.updateItemInLocalStorage('roles', response.roles);
               this.userObserver.next(response.user);
            },
            () => {
               this.updateItemInLocalStorage('user');
               this.updateItemInLocalStorage('roles');
               this.updateItemInLocalStorage('auth_token');
            }
         );
      }
   }

   /**
    * Check if token and user data exists in localStorage
    * @returns {boolean}
    */
   public isUserAndTokenInLocalStorage() {
      return !!localStorage.getItem('auth_token') && !!localStorage.getItem('user');
   }

   private refresh(): Observable<any> {
      return this.headersWithToken.get(this.authUrl + 'refresh').pipe(catchError(this.errorHandlerService.handle));
   }

   private updateItemInLocalStorage(key: string, value?: any): void {
      if (!!value) {
         localStorage.setItem(key, JSON.stringify(value));
      } else {
         localStorage.removeItem(key);
      }
   }

   /**
    * Set token to localStorage
    * @param token
    */
   private setTokenToLocalStorage(token) {
      localStorage.setItem('auth_token', token);
   }
}
