import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamStageSearch } from '@models/search/team-stage-search.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TeamStageNewService {
   public readonly teamStagesUrl: string = `${environment.apiUrl}v2/team/stages`;

   constructor(private httpClient: HttpClient) {}

   public getTeamStage(teamStageId: number): Observable<TeamStageNew> {
      return this.httpClient
         .get<{ team_stage: TeamStageNew }>(`${this.teamStagesUrl}/${teamStageId}`)
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

      return this.httpClient.get<PaginatedResponse<TeamStageNew>>(this.teamStagesUrl, { params });
   }
}
