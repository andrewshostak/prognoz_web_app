import { Injectable } from '@angular/core';

import { environment } from '@env';
import { Competition } from '@models/competition.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CompetitionService {
   private competitionUrl = environment.apiUrl + 'competitions';
   constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

   /**
    * @deprecated
    */
   public createCompetition(competition: Competition): Observable<Competition> {
      return this.headersWithToken.post(this.competitionUrl, competition).pipe(
         map(response => response.competition),
         catchError(this.errorHandlerService.handle)
      );
   }

   /**
    * @deprecated
    */
   public updateCompetition(competition: Competition, competitionId: number): Observable<Competition> {
      return this.headersWithToken.put(`${this.competitionUrl}/${competitionId}`, competition).pipe(
         map(response => response.competition),
         catchError(this.errorHandlerService.handle)
      );
   }
}
