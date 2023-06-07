import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { GuestbookMessageNew } from '@models/v2/guestbook-message-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { GuestbookMessageSearch } from '@models/search/guestbook-message-search.model';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GuestbookMessageNewService {
   public readonly guestbookMessagesUrl: string = `${environment.apiBaseUrl}/v2/guestbook-messages`;

   constructor(private httpClient: HttpClient) {}

   public createGuestbookMessage(message: Partial<GuestbookMessageNew>): Observable<GuestbookMessageNew> {
      return this.httpClient
         .post<{ guestbook_message: GuestbookMessageNew }>(this.guestbookMessagesUrl, message)
         .pipe(map(response => response.guestbook_message));
   }

   public deleteGuestbookMessage(id: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.guestbookMessagesUrl}/${id}`);
   }

   public getGuestbookMessages(search: GuestbookMessageSearch): Observable<PaginatedResponse<GuestbookMessageNew>> {
      let params: HttpParams = new HttpParams();

      if (!isNil(search.trashed)) {
         params = params.set('trashed', (search.trashed as unknown) as string);
      }

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      if (search.userId) {
         params = params.set('user_id', search.userId.toString());
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<GuestbookMessageNew>>(this.guestbookMessagesUrl, { params });
   }

   public updateGuestbookMessage(id: number, message: Partial<GuestbookMessageNew>): Observable<GuestbookMessageNew> {
      return this.httpClient
         .put<{ guestbook_message: GuestbookMessageNew }>(`${this.guestbookMessagesUrl}/${id}`, message)
         .pipe(map(response => response.guestbook_message));
   }
}
