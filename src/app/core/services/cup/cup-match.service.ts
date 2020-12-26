import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupMatch } from '@models/cup/cup-match.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isNil } from 'lodash';

@Injectable()
export class CupMatchService {
   private cupMatchUrl = `${environment.apiUrl}cup/matches`;

   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   /**
    * Get cup matches
    * @param {number} page
    * @param {boolean} active
    * @param {boolean} ended
    * @param {string} order
    * @param {string} sequence
    * @param {string} cupStageId
    * @returns {Observable<CupMatch[]>}
    */
   public getCupMatches(
      page?: number,
      active?: boolean,
      ended?: boolean,
      order?: string,
      sequence?: 'asc' | 'desc',
      cupStageId?: number
   ): Observable<any> {
      let params: HttpParams = new HttpParams();
      if (page) {
         params = params.append('page', page.toString());
      }
      if (!isNil(active)) {
         params = params.append('active', active ? '1' : '0');
      }
      if (!isNil(ended)) {
         params = params.append('ended', ended ? '1' : '0');
      }
      if (!isNil(order)) {
         params = params.append('order', order);
      }
      if (!isNil(sequence)) {
         params = params.append('sequence', sequence);
      }
      if (!isNil(cupStageId)) {
         params = params.append('cup_stage_id', cupStageId.toString());
      }
      return this.httpClient.get(this.cupMatchUrl, { params }).pipe(catchError(this.errorHandlerService.handle));
   }

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
