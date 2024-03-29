import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { User } from '@models/v2/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InitService {
   constructor(private httpClient: HttpClient, private currentStateService: CurrentStateService) {}

   public initializeUser(): Promise<User> {
      return new Promise((resolve: (u: User) => void) => {
         if (!this.isToken()) {
            resolve(null);
            return;
         }

         this.getUser().subscribe(
            response => {
               resolve(response);
               this.currentStateService.setUser(response);
               this.currentStateService.getOnlineUsers(this.currentStateService.getUser());
            },
            () => {
               resolve(null);
            }
         );
      });
   }

   private getUser(): Observable<User> {
      return this.httpClient.get<{ user: User }>(`${environment.apiBaseUrl}/v2/auth/user`).pipe(map(response => response.user));
   }

   private isToken(): boolean {
      return !!localStorage.getItem('auth_token');
   }
}
