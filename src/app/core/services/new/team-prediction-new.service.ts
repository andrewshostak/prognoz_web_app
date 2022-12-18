import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamPredictionNew } from '@models/new/team-prediction-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamPredictionSearch } from '@models/search/team-prediction-search.model';
import { Observable } from 'rxjs';

@Injectable()
export class TeamPredictionNewService {
   public readonly teamPredictionsUrl: string = `${environment.apiUrl}v2/team/predictions`;

   constructor(private httpClient: HttpClient) {}

   public getTeamPredictions(search: TeamPredictionSearch): Observable<PaginatedResponse<TeamPredictionNew>> {
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

      if (search.teamIds) {
         search.teamIds.forEach(teamId => {
            params = params.append('team_ids[]', teamId.toString());
         });
      }

      if (search.teamMatchIds) {
         search.teamMatchIds.forEach(teamMatchId => {
            params = params.append('team_match_ids[]', teamMatchId.toString());
         });
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<TeamPredictionNew>>(this.teamPredictionsUrl, { params });
   }
}
