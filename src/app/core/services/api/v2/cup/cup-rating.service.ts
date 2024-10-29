import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupRatingCalculated } from '@models/v2/cup/cup-rating-calculated.model';
import { CupRatingGroup } from '@models/v2/cup/cup-rating-group.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupRatingGroupSearch } from '@models/search/cup/cup-rating-group-search.model';
import { CupRatingSearch } from '@models/search/cup/cup-rating-search.model';
import { CupRatingPositionSearch } from '@app/shared/models/v2/cup/cup-rating-position-search.model';
import { Observable } from 'rxjs';

@Injectable()
export class CupRatingService {
   public readonly cupRatingUrl: string = `${environment.apiBaseUrl}/v2/cup/rating`;

   constructor(private httpClient: HttpClient) {}

   getCupRating(search: CupRatingSearch): Observable<PaginatedResponse<CupRatingCalculated>> {
      let params: HttpParams = new HttpParams();

      if (search.userId) {
         params = params.set('user_id', search.userId.toString());
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<CupRatingCalculated>>(this.cupRatingUrl, { params });
   }

   getCupRatingGroup(search: CupRatingGroupSearch): Observable<PaginatedResponse<CupRatingGroup>> {
      const params: HttpParams = new HttpParams({
         fromObject: { competition_id: search.competitionId.toString(), group_number: search.groupNumber.toString() }
      });
      return this.httpClient.get<PaginatedResponse<CupRatingGroup>>(`${this.cupRatingUrl}-groups`, { params });
   }

   getCupRatingPositionInGroups(search: CupRatingPositionSearch): Observable<CupRatingGroup> {
      const params: HttpParams = new HttpParams({
         fromObject: {
            competition_id: search.competitionId.toString(),
            position: search.position.toString()
         }
      });
      return this.httpClient.get<CupRatingGroup>(`${this.cupRatingUrl}/rating-position-in-groups`, { params });
   }

   getCupGroupFurtheranceByPosition(search: CupRatingPositionSearch): Observable<PaginatedResponse<number>> {
      const params: HttpParams = new HttpParams()
         .set('competition_id', search.competitionId.toString())
         .set('position', search.position.toString());

      return this.httpClient.get<PaginatedResponse<number>>(`${this.cupRatingUrl}/group-furtherance-by-position`, { params });
   }
}
