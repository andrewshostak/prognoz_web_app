import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamMatch } from '@models/v2/team/team-match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamMatchSearch } from '@models/search/team/team-match-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TeamMatchService {
   public readonly teamMatchesUrl: string = `${environment.apiBaseUrl}/v2/team/matches`;

   constructor(private httpClient: HttpClient) {}

   public createTeamMatch(teamMatch: Partial<TeamMatch>): Observable<TeamMatch> {
      return this.httpClient.post<{ team_match: TeamMatch }>(this.teamMatchesUrl, teamMatch).pipe(map(response => response.team_match));
   }

   public deleteTeamMatch(teamMatchId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.teamMatchesUrl}/${teamMatchId}`);
   }

   public getTeamMatch(teamMatchId: number): Observable<TeamMatch> {
      return this.httpClient
         .get<{ team_match: TeamMatch }>(`${this.teamMatchesUrl}/${teamMatchId}`)
         .pipe(map(response => response.team_match));
   }

   public getTeamMatches(search: TeamMatchSearch): Observable<PaginatedResponse<TeamMatch>> {
      let params: HttpParams = new HttpParams();

      if (search.states) {
         search.states.forEach(relation => {
            params = params.append('states[]', relation);
         });
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

      if (search.teamStageId) {
         params = params.set('team_stage_id', search.teamStageId.toString());
      }

      if (search.showPredictionsViewability) {
         params = params.set('show_predictions_viewability', Number(search.showPredictionsViewability).toString());
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<TeamMatch>>(this.teamMatchesUrl, { params });
   }

   public updateTeamMatch(teamMatchId: number, teamMatch: Partial<TeamMatch>): Observable<TeamMatch> {
      return this.httpClient
         .put<{ team_match: TeamMatch }>(`${this.teamMatchesUrl}/${teamMatchId}`, teamMatch)
         .pipe(map(response => response.team_match));
   }
}
