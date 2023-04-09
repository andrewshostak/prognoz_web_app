import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupCupMatch } from '@models/cup/cup-cup-match.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CupCupMatchService {
   private cupCupMatchUrl = `${environment.apiUrl}cup/cup-matches`;
   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   public createCupCupMatchesAuto(params: { type: 'auto' | 'manual'; to: number; number_of_matches: number }): Observable<CupCupMatch[]> {
      return this.headersWithToken.post(this.cupCupMatchUrl, params).pipe(
         map(response => response.cup_cup_matches),
         catchError(this.errorHandlerService.handle)
      );
   }
}
