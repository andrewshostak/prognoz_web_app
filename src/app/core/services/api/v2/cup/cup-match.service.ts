import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupMatch } from '@models/v2/cup/cup-match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupMatchSearch } from '@models/search/cup/cup-match-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CupMatchService {
   public readonly cupMatchesUrl: string = `${environment.apiBaseUrl}/v2/cup/matches`;

   constructor(private httpClient: HttpClient) {}

   public createCupMatch(cupMatch: Partial<CupMatch>): Observable<CupMatch> {
      return this.httpClient.post<{ cup_match: CupMatch }>(this.cupMatchesUrl, cupMatch).pipe(map(response => response.cup_match));
   }

   public deleteCupMatch(cupMatchId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.cupMatchesUrl}/${cupMatchId}`);
   }

   public getCupMatch(cupMatchId: number): Observable<CupMatch> {
      return this.httpClient.get<{ cup_match: CupMatch }>(`${this.cupMatchesUrl}/${cupMatchId}`).pipe(map(response => response.cup_match));
   }

   public getCupMatches(search: CupMatchSearch): Observable<PaginatedResponse<CupMatch>> {
      let params: HttpParams = new HttpParams({ fromObject: { 'relations[]': search.relations || [] } });

      if (search.states) {
         search.states.forEach(relation => {
            params = params.append('states[]', relation);
         });
      }

      if (search.cupCupMatchIds) {
         search.cupCupMatchIds.forEach(cupCupMatchId => {
            params = params.append('cup_cup_match_ids[]', cupCupMatchId.toString());
         });
      }

      if (search.userId) {
         params = params.set('user_id', search.userId.toString());
      }

      if (search.showPredictability) {
         params = params.append('show_predictability', (search.showPredictability as unknown) as string);
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

      return this.httpClient.get<PaginatedResponse<CupMatch>>(this.cupMatchesUrl, { params });
   }

   public updateCupMatch(cupMatchId: number, cupMatch: Partial<CupMatch>): Observable<CupMatch> {
      return this.httpClient
         .put<{ cup_match: CupMatch }>(`${this.cupMatchesUrl}/${cupMatchId}`, cupMatch)
         .pipe(map(response => response.cup_match));
   }
}
