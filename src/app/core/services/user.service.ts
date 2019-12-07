import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { User } from '@models/user.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class UserService {
   private usersUrl = environment.apiUrl + 'users';
   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   /**
    * Get users
    * @param order
    * @param limit
    * @param sequence
    * @returns {Observable<any>}
    */
   public getUsers(limit?: number, order?: string, sequence?: 'asc' | 'desc'): Observable<any> {
      let params: HttpParams = new HttpParams();
      if (limit) {
         params = params.append('limit', limit.toString());
      }
      if (order) {
         params = params.append('order', order);
      }
      if (sequence) {
         params = params.append('sequence', sequence);
      }
      return this.httpClient.get(this.usersUrl, { params }).pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * Get user by id
    * @param id
    * @returns {Observable<User>}
    */
   public getUser(id: number): Observable<User> {
      return this.httpClient.get<{ user: User }>(`${this.usersUrl}/${id}`).pipe(
         map(response => response.user),
         catchError(this.errorHandlerService.handle)
      );
   }

   public updateUser(user: User): Observable<{ user: User }> {
      return this.headersWithToken.put(`${this.usersUrl}/${user.id}`, user).pipe(catchError(this.errorHandlerService.handle));
   }
}
