import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamTeamMatchNew } from '@models/new/team-team-match-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamTeamMatchSearch } from '@models/search/team-team-match-search.model';
import { Observable } from 'rxjs';

@Injectable()
export class TeamTeamMatchNewService {
   public readonly teamTeamMatchesUrl: string = `${environment.apiUrl}v2/team/team-matches`;

   constructor(private httpClient: HttpClient) {}

   public getTeamTeamMatches(search: TeamTeamMatchSearch): Observable<PaginatedResponse<TeamTeamMatchNew>> {
      let params: HttpParams = new HttpParams({ fromObject: { 'relations[]': search.relations || [] } });

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (search.teamStageId) {
         params = params.set('team_stage_id', search.teamStageId.toString());
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      return this.httpClient.get<PaginatedResponse<TeamTeamMatchNew>>(this.teamTeamMatchesUrl, { params });
   }
}
