import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { UserNew } from '@models/new/user-new.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InitService {
   constructor(private httpClient: HttpClient, private authService: AuthNewService) {}

   public initializeUser(): Promise<UserNew> {
      return new Promise((resolve: (u: UserNew) => void) => {
         if (!this.isToken()) {
            resolve(null);
            return;
         }

         this.getUser().subscribe(
            response => {
               resolve(response);
               this.authService.setUser(response);
            },
            () => {
               resolve(null);
            }
         );
      });
   }

   private getUser(): Observable<UserNew> {
      return this.httpClient.get<{ user: UserNew }>(`${environment.apiUrl}v2/auth/user`).pipe(map(response => response.user));
   }

   private isToken(): boolean {
      return !!localStorage.getItem('auth_token');
   }
}
