import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupMatchNew } from '@models/new/cup-match-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupMatchSearch } from '@models/search/cup-match-search.model';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CupMatchNewService {
   public readonly cupMatchesUrl: string = `${environment.apiUrl}v2/cup/matches`;

   constructor(private httpClient: HttpClient) {}

   public createCupMatch(cupMatch: Partial<CupMatchNew>): Observable<CupMatchNew> {
      return this.httpClient.post<{ cup_match: CupMatchNew }>(this.cupMatchesUrl, cupMatch).pipe(map(response => response.cup_match));
   }

   public deleteCupMatch(cupMatchId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.cupMatchesUrl}/${cupMatchId}`);
   }

   public getCupMatch(cupMatchId: number): Observable<CupMatchNew> {
      return this.httpClient
         .get<{ cup_match: CupMatchNew }>(`${this.cupMatchesUrl}/${cupMatchId}`)
         .pipe(map(response => response.cup_match));
   }

   public getCupMatches(search: CupMatchSearch): Observable<PaginatedResponse<CupMatchNew>> {
      let params: HttpParams = new HttpParams({ fromObject: { 'relations[]': search.relations || [] } });

      if (search.cupCupMatchId) {
         params = params.set('cup_cup_match_id', search.cupCupMatchId.toString());
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

      if (!isNil(search.active)) {
         params = params.append('active', (search.active as unknown) as string);
      }

      if (!isNil(search.ended)) {
         params = params.append('ended', (search.ended as unknown) as string);
      }

      if (search.states) {
         search.states.forEach(relation => {
            params = params.append('states[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<CupMatchNew>>(this.cupMatchesUrl, { params });
   }

   public updateCupMatch(cupMatchId: number, cupMatch: Partial<CupMatchNew>): Observable<CupMatchNew> {
      return this.httpClient
         .put<{ cup_match: CupMatchNew }>(`${this.cupMatchesUrl}/${cupMatchId}`, cupMatch)
         .pipe(map(response => response.cup_match));
   }
}
