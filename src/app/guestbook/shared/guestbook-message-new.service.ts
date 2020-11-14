import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { GuestbookMessageNew } from '@models/new/guestbook-message-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { GuestbookMessageSearch } from '@models/search/guestbook-message-search.model';
import { Observable } from 'rxjs';

@Injectable()
export class GuestbookMessageNewService {
   public readonly guestbookMessagesUrl: string = `${environment.apiUrl}v2/guestbook-messages`;

   constructor(private httpClient: HttpClient) {}

   public getGuestbookMessages(search: GuestbookMessageSearch): Observable<PaginatedResponse<GuestbookMessageNew>> {
      let params: HttpParams = new HttpParams();

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
}
