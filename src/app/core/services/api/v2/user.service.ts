import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { User } from '@models/v2/user.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { UserSearch } from '@models/search/user-search.model';
import { serialize } from 'object-to-formdata';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
   public readonly usersUrl: string = `${environment.apiBaseUrl}/v2/users`;

   constructor(private httpClient: HttpClient) {}

   public getUser(id: number, relations: string[] = []): Observable<User> {
      const params = new HttpParams({ fromObject: { 'relations[]': relations } });
      return this.httpClient
         .get<{ user: User }>(`${this.usersUrl}/${id}`, { params })
         .pipe(map(response => response.user));
   }

   public getUsers(search: UserSearch): Observable<PaginatedResponse<User>> {
      let params: HttpParams = new HttpParams();

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.name) {
         params = params.set('name', search.name);
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      return this.httpClient.get<PaginatedResponse<User>>(this.usersUrl, { params });
   }

   public updateUser(userId: number, user: Partial<User>): Observable<User> {
      const body = user.image ? serialize(user, { indices: true }) : user;
      return this.httpClient.post<{ user: User }>(`${this.usersUrl}/${userId}`, body).pipe(map(response => response.user));
   }
}
