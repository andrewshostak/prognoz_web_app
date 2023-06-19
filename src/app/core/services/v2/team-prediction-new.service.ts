import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamPrediction } from '@models/v2/team/team-prediction.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamPredictionSearch } from '@models/search/team/team-prediction-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TeamPredictionNewService {
   public readonly teamPredictionsUrl: string = `${environment.apiBaseUrl}/v2/team/predictions`;

   constructor(private httpClient: HttpClient) {}

   updatePrediction(id: number, data: { home: number; away: number }): Observable<TeamPrediction> {
      return this.httpClient
         .put<{ team_prediction: TeamPrediction }>(`${this.teamPredictionsUrl}/${id}`, data)
         .pipe(map(response => response.team_prediction));
   }

   updateUser(data: { user_id?: number; team_id: number; team_match_id: number }): Observable<TeamPrediction> {
      return this.httpClient
         .put<{ team_prediction: TeamPrediction }>(`${this.teamPredictionsUrl}/user`, data)
         .pipe(map(response => response.team_prediction));
   }

   updateBlock(data: { team_team_match_id: number; team_id: number; predictions: { team_match_id: number }[] }): Observable<void> {
      return this.httpClient.put<void>(`${this.teamPredictionsUrl}/block`, data);
   }

   public getTeamPredictions(search: TeamPredictionSearch): Observable<PaginatedResponse<TeamPrediction>> {
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

      return this.httpClient.get<PaginatedResponse<TeamPrediction>>(this.teamPredictionsUrl, { params });
   }
}
