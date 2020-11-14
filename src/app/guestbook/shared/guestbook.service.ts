import { Injectable } from '@angular/core';

import { environment } from '@env';
import { GuestbookMessage } from '@models/guestbook-message.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
/**
 * @deprecated
 */
export class GuestbookService {
   private guestbookUrl = environment.apiUrl + 'guestbookmessages';
   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   public createGuestbookMessage(message: GuestbookMessage): Observable<GuestbookMessage> {
      return this.headersWithToken.post(this.guestbookUrl, message).pipe(
         map(response => response.guestbookMessage),
         catchError(this.errorHandlerService.handle)
      );
   }
}
