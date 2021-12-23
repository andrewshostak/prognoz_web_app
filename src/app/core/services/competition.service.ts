import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { Competition } from '@models/competition.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isNil } from 'lodash';

@Injectable()
export class CompetitionService {
   private competitionUrl = environment.apiUrl + 'competitions';
   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   /**
    * @deprecated
    */
   public getCompetitions(
      page?: number,
      tournament?: number,
      season?: number,
      state?: boolean,
      stated?: boolean,
      active?: boolean,
      ended?: boolean,
      limit?: number
   ): Observable<any> {
      let params: HttpParams = new HttpParams();
      if (page) {
         params = params.append('page', page.toString());
      }
      if (tournament) {
         params = params.append('tournament', tournament.toString());
      }
      if (season) {
         params = params.append('season', season.toString());
      }
      if (state) {
         params = params.append('state', state.toString());
      }
      if (!isNil(stated)) {
         params = params.append('stated', (stated ? 1 : 0).toString());
      }
      if (!isNil(active)) {
         params = params.append('active', (active ? 1 : 0).toString());
      }
      if (!isNil(ended)) {
         params = params.append('ended', (ended ? 1 : 0).toString());
      }
      if (limit) {
         params = params.append('limit', limit.toString());
      }
      return this.httpClient.get(this.competitionUrl, { params }).pipe(catchError(this.errorHandlerService.handle));
   }

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
