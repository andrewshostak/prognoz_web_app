import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupCupMatchNew } from '@models/new/cup-cup-match-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupCupMatchSearch } from '@models/search/cup-cup-match-search.model';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CupCupMatchNewService {
   public readonly cupCupMatchesUrl: string = `${environment.apiUrl}/v2/cup/cup-matches`;

   constructor(private httpClient: HttpClient) {}

   public getCupCupMatch(cupCupMatchId: number): Observable<CupCupMatchNew> {
      return this.httpClient
         .get<{ cup_cup_match: CupCupMatchNew }>(`${this.cupCupMatchesUrl}/${cupCupMatchId}`)
         .pipe(map(response => response.cup_cup_match));
   }

   public getCupCupMatches(search: CupCupMatchSearch): Observable<PaginatedResponse<CupCupMatchNew>> {
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

      if (!isNil(search.active)) {
         params = params.append('active', (search.active as unknown) as string);
      }

      if (!isNil(search.ended)) {
         params = params.append('ended', (search.ended as unknown) as string);
      }

      if (search.cupStageId) {
         params = params.set('cup_stage_id', search.cupStageId.toString());
      }

      return this.httpClient.get<PaginatedResponse<CupCupMatchNew>>(this.cupCupMatchesUrl, { params });
   }
}
