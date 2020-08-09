import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { AuthReset } from '@models/new/auth/auth-reset.model';
import { AuthSignIn } from '@models/new/auth/auth-sign-in.model';
import { AuthSignUp } from '@models/new/auth/auth-sign-up.model';
import { UserNew } from '@models/new/user-new.model';
import { get, omit, uniq } from 'lodash';
import { Observable } from 'rxjs';

@Injectable()
export class AuthNewService {
   private user: UserNew = null;
   private authURL = environment.apiUrl + 'v2/auth';

   constructor(private httpClient: HttpClient) {}

   public getPermissions(): string[] {
      const user = this.getUser();
      if (!get(user, 'roles.length')) {
         return [];
      }

      const permissions: string[] = [];
      user.roles.forEach(role => {
         if (!role.permissions) {
            return;
         }

         role.permissions.forEach(permission => {
            permissions.push(permission.slug);
         });
      });

      return uniq(permissions);
   }

   public hasPermissions(permissions: string[], or?: boolean): boolean {
      const userPermissions = this.getPermissions();

      return or
         ? permissions.some(permission => userPermissions.includes(permission))
         : permissions.every(permission => userPermissions.includes(permission));
   }

   public hasRoles(roles: string[], or?: boolean): boolean {
      const user = this.getUser();
      if (!get(user, 'roles.length')) {
         return false;
      }

      const userRoleSlugs = user.roles.map(role => role.slug);

      return or ? roles.some(role => userRoleSlugs.includes(role)) : roles.every(role => userRoleSlugs.includes(role));
   }

   public logout(): Observable<any> {
      return this.httpClient.delete(`${this.authURL}/logout`);
   }

   public recovery(email: string): Observable<void> {
      return this.httpClient.post<void>(`${this.authURL}/recovery`, { email });
   }

   public reset(authReset: AuthReset): Observable<void> {
      return this.httpClient.post<void>(`${this.authURL}/reset`, authReset);
   }

   public signIn(authSignIn: AuthSignIn): Observable<{ token: string; user: UserNew }> {
      const httpOptions = { headers: new HttpHeaders({ 'x-device-id': authSignIn.deviceId }) };
      return this.httpClient.post<{ token: string; user: UserNew }>(
         `${this.authURL}/sign-in`,
         omit(authSignIn, 'fingerprint'),
         httpOptions
      );
   }

   public signUp(authSignUp: AuthSignUp): Observable<{ token: string; user: UserNew }> {
      return this.httpClient.post<{ token: string; user: UserNew }>(`${this.authURL}/sign-up`, authSignUp);
   }

   public getUser(): UserNew {
      return this.user;
   }

   public setUser(user: UserNew): void {
      this.user = user;
   }

   public setToken(token: string): void {
      localStorage.setItem('auth_token', token);
   }
}
