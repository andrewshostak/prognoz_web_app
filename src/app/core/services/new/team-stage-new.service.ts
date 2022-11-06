import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamStageSearch } from '@models/search/team-stage-search.model';
import { GenerateTeamStagesNew } from '@models/new/generate-team-stages-new.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TeamStageNewService {
   public readonly teamStagesUrl: string = `${environment.apiUrl}v2/team/stages`;

   constructor(private httpClient: HttpClient) {}

   public createTeamStage(teamStage: Partial<TeamStageNew>): Observable<TeamStageNew> {
      return this.httpClient.post<{ team_stage: TeamStageNew }>(this.teamStagesUrl, teamStage).pipe(map(response => response.team_stage));
   }

   public deleteTeamStage(teamStageId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.teamStagesUrl}/${teamStageId}`);
   }

   public generateTeamStages(generationOptions: GenerateTeamStagesNew): Observable<number> {
      return this.httpClient.post<number>(`${this.teamStagesUrl}/generate`, generationOptions);
   }

   public getTeamStage(teamStageId: number, relations: string[] = []): Observable<TeamStageNew> {
      const params = new HttpParams({ fromObject: { 'relations[]': relations } });
      return this.httpClient
         .get<{ team_stage: TeamStageNew }>(`${this.teamStagesUrl}/${teamStageId}`, { params })
         .pipe(map(response => response.team_stage));
   }

   public getTeamStages(search: TeamStageSearch): Observable<PaginatedResponse<TeamStageNew>> {
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

      if (search.state) {
         params = params.append('state', (search.state as unknown) as string);
      }

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      if (search.states) {
         search.states.forEach(state => {
            params = params.append('states[]', state);
         });
      }

      if (search.rounds) {
         search.rounds.forEach(round => {
            params = params.append('rounds[]', round.toString());
         });
      }

      return this.httpClient.get<PaginatedResponse<TeamStageNew>>(this.teamStagesUrl, { params });
   }

   public updateTeamStage(teamStageId: number, teamStage: Partial<TeamStageNew>): Observable<TeamStageNew> {
      return this.httpClient
         .put<{ team_stage: TeamStageNew }>(`${this.teamStagesUrl}/${teamStageId}`, teamStage)
         .pipe(map(response => response.team_stage));
   }
}
