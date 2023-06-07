import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamRatingNew } from '@models/v2/team-rating-new.model';
import { TeamRatingSearch } from '@models/search/team-rating-search.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { Observable } from 'rxjs';

@Injectable()
export class TeamRatingNewService {
   public readonly teamRatingUrl: string = `${environment.apiBaseUrl}/v2/team/rating`;

   constructor(private httpClient: HttpClient) {}

   public getTeamRating(search: TeamRatingSearch): Observable<PaginatedResponse<TeamRatingNew>> {
      let params: HttpParams = new HttpParams();

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
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

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<TeamRatingNew>>(this.teamRatingUrl, { params });
   }
}
