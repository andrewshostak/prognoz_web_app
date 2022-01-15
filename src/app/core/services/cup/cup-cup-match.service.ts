import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupCupMatch } from '@models/cup/cup-cup-match.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isNil } from 'lodash';

@Injectable()
export class CupCupMatchService {
   private cupCupMatchUrl = `${environment.apiUrl}cup/cup-matches`;
   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   /**
    * @deprecated
    */
   public getCupCupMatches(cupStageId?: number, page?: number, order?: string, sequence?: 'asc' | 'desc'): Observable<any> {
      let params: HttpParams = new HttpParams();
      if (page) {
         params = params.append('page', page.toString());
      }
      if (!isNil(cupStageId)) {
         params = params.append('cup_stage_id', cupStageId.toString());
      }
      if (!isNil(order)) {
         params = params.append('order', order);
      }
      if (!isNil(sequence)) {
         params = params.append('sequence', sequence);
      }
      return this.httpClient.get(this.cupCupMatchUrl, { params }).pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * @deprecated
    */
   public getCupCupMatch(cupCupMatchId: number): Observable<CupCupMatch> {
      return this.httpClient.get<{ cup_cup_match: CupCupMatch }>(`${this.cupCupMatchUrl}/${cupCupMatchId}`).pipe(
         map(response => response.cup_cup_match),
         catchError(this.errorHandlerService.handle)
      );
   }

   public createCupCupMatchesAuto(params: { type: 'auto' | 'manual'; to: number; number_of_matches: number }): Observable<CupCupMatch[]> {
      return this.headersWithToken.post(this.cupCupMatchUrl, params).pipe(
         map(response => response.cup_cup_matches),
         catchError(this.errorHandlerService.handle)
      );
   }

   public createCupCupMatch(cupCupMatch: CupCupMatch): Observable<CupCupMatch> {
      return this.headersWithToken.post(this.cupCupMatchUrl, cupCupMatch).pipe(
         map(response => response.cup_cup_match),
         catchError(this.errorHandlerService.handle)
      );
   }

   public updateCupCupMatch(cupCupMatch: CupCupMatch, cupCupMatchId: number): Observable<CupCupMatch> {
      return this.headersWithToken.put(`${this.cupCupMatchUrl}/${cupCupMatchId}`, cupCupMatch).pipe(
         map(response => response.cup_cup_match),
         catchError(this.errorHandlerService.handle)
      );
   }

   public deleteCupCupMatch(cupCupMatchId: number): Observable<void> {
      return this.headersWithToken.delete(`${this.cupCupMatchUrl}/${cupCupMatchId}`).pipe(catchError(this.errorHandlerService.handle));
   }
}
