import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { AuthReset } from '@models/v2/auth/auth-reset.model';
import { AuthSignIn } from '@models/v2/auth/auth-sign-in.model';
import { AuthSignUp } from '@models/v2/auth/auth-sign-up.model';
import { User } from '@models/v2/user.model';
import { omit } from 'lodash';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
   public static readonly tokenExpired = 'Token has expired';

   private authURL = environment.apiBaseUrl + '/v2/auth';

   constructor(private httpClient: HttpClient) {}

   public logout(): Observable<void> {
      return this.httpClient.delete<void>(`${this.authURL}/logout`);
   }

   public recovery(email: string): Observable<void> {
      return this.httpClient.post<void>(`${this.authURL}/recovery`, { email });
   }

   public reset(authReset: AuthReset): Observable<void> {
      return this.httpClient.post<void>(`${this.authURL}/reset`, authReset);
   }

   public signIn(authSignIn: AuthSignIn): Observable<{ token: string; user: User }> {
      const httpOptions = { headers: new HttpHeaders({ 'x-device-id': authSignIn.deviceId }) };
      return this.httpClient.post<{ token: string; user: User }>(`${this.authURL}/sign-in`, omit(authSignIn, 'deviceId'), httpOptions);
   }

   public signUp(authSignUp: AuthSignUp): Observable<void> {
      return this.httpClient.post<void>(`${this.authURL}/sign-up`, authSignUp);
   }
}
