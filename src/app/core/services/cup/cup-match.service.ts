import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupMatch } from '@models/cup/cup-match.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CupMatchService {
   private cupMatchUrl = `${environment.apiUrl}cup/matches`;

   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   /**
    * Get predictable cup matches
    * @returns {Observable<CupMatch[]>}
    */
   public getCupMatchesPredictable(): Observable<CupMatch[]> {
      return this.headersWithToken.get(`${this.cupMatchUrl}-predictable`).pipe(
         map(response => response.cup_matches),
         catchError(this.errorHandlerService.handle)
      );
   }
}
