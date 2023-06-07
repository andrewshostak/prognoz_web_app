import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamRatingUser } from '@models/v2/team/team-rating-user.model';
import { TeamRatingUserSearch } from '@models/search/team/team-rating-user-search.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { Observable } from 'rxjs';

@Injectable()
export class TeamRatingUserNewService {
   public readonly teamRatingUserUrl: string = `${environment.apiBaseUrl}/v2/team/rating-user`;

   constructor(private httpClient: HttpClient) {}

   public getTeamRatingUser(search: TeamRatingUserSearch): Observable<PaginatedResponse<TeamRatingUser>> {
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

      return this.httpClient.get<PaginatedResponse<TeamRatingUser>>(this.teamRatingUserUrl, { params });
   }
}
