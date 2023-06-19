import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { GenerateTeamTeamMatches } from '@models/v2/team/generate-team-team-matches.model';
import { TeamTeamMatch } from '@models/v2/team/team-team-match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamTeamMatchSearch } from '@models/search/team/team-team-match-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TeamTeamMatchNewService {
   public readonly teamTeamMatchesUrl: string = `${environment.apiBaseUrl}/v2/team/team-matches`;

   constructor(private httpClient: HttpClient) {}

   public createTeamTeamMatch(teamTeamMatch: Partial<TeamTeamMatch>): Observable<TeamTeamMatch> {
      return this.httpClient
         .post<{ team_team_match: TeamTeamMatch }>(this.teamTeamMatchesUrl, teamTeamMatch)
         .pipe(map(response => response.team_team_match));
   }

   public deleteTeamTeamMatch(teamTeamMatchId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.teamTeamMatchesUrl}/${teamTeamMatchId}`);
   }

   public generateTeamTeamMatches(generationOptions: GenerateTeamTeamMatches): Observable<number> {
      return this.httpClient.post<number>(`${this.teamTeamMatchesUrl}/generate`, generationOptions);
   }

   public getTeamTeamMatch(teamTeamMatchId: number, relations: string[] = []): Observable<TeamTeamMatch> {
      const params = new HttpParams({ fromObject: { 'relations[]': relations } });
      return this.httpClient
         .get<{ team_team_match: TeamTeamMatch }>(`${this.teamTeamMatchesUrl}/${teamTeamMatchId}`, { params })
         .pipe(map(response => response.team_team_match));
   }

   public getTeamTeamMatches(search: TeamTeamMatchSearch): Observable<PaginatedResponse<TeamTeamMatch>> {
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

      if (search.states) {
         search.states.forEach(state => {
            params = params.append('states[]', state);
         });
      }

      return this.httpClient.get<PaginatedResponse<TeamTeamMatch>>(this.teamTeamMatchesUrl, { params });
   }

   updateGoalkeeper(teamTeamMatchId: number, goalkeeperId: number): Observable<void> {
      return this.httpClient.put<void>(`${this.teamTeamMatchesUrl}/${teamTeamMatchId}/goalkeeper`, { goalkeeper_id: goalkeeperId });
   }

   public updateTeamTeamMatch(teamTeamMatchId: number, teamTeamMatch: Partial<TeamTeamMatch>): Observable<TeamTeamMatch> {
      return this.httpClient
         .put<{ team_team_match: TeamTeamMatch }>(`${this.teamTeamMatchesUrl}/${teamTeamMatchId}`, teamTeamMatch)
         .pipe(map(response => response.team_team_match));
   }
}
