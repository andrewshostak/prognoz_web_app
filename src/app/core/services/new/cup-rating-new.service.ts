import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupRatingCalculatedNew } from '@models/new/cup-rating-calculated-new.model';
import { CupRatingGroupNew } from '@models/new/cup-rating-group-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupRatingGroupSearch } from '@models/search/cup-rating-group-search.model';
import { CupRatingSearch } from '@models/search/cup-rating-search.model';
import { Observable } from 'rxjs';

@Injectable()
export class CupRatingNewService {
   public readonly cupRatingUrl: string = `${environment.apiUrl}v2/cup/rating`;

   constructor(private httpClient: HttpClient) {}

   getCupRating(search: CupRatingSearch): Observable<PaginatedResponse<CupRatingCalculatedNew>> {
      let params: HttpParams = new HttpParams();

      if (search.userId) {
         params = params.set('user_id', search.userId.toString());
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<CupRatingCalculatedNew>>(this.cupRatingUrl, { params });
   }

   getCupRatingGroup(search: CupRatingGroupSearch): Observable<PaginatedResponse<CupRatingGroupNew>> {
      const params: HttpParams = new HttpParams({
         fromObject: { competition_id: search.competitionId.toString(), group_number: search.groupNumber.toString() }
      });
      return this.httpClient.get<PaginatedResponse<CupRatingGroupNew>>(`${this.cupRatingUrl}-groups`, { params });
   }
}
