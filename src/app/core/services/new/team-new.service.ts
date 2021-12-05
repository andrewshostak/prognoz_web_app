import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamNew } from '@models/new/team-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamSearch } from '@models/search/team-search.model';
import { isNil } from 'lodash';
import { serialize } from 'object-to-formdata';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TeamNewService {
   public readonly teamsUrl: string = `${environment.apiUrl}v2/team/teams`;

   constructor(private httpClient: HttpClient) {}

   // todo: add to postman collection
   public createTeam(team: Partial<TeamNew>): Observable<TeamNew> {
      const body = team.image ? serialize(team, { booleansAsIntegers: true }) : team;
      return this.httpClient.post<{ team: TeamNew }>(this.teamsUrl, body).pipe(map(response => response.team));
   }

   public deleteTeam(teamId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.teamsUrl}/${teamId}`);
   }

   public getTeam(teamId: number): Observable<TeamNew> {
      return this.httpClient.get<{ team: TeamNew }>(`${this.teamsUrl}/${teamId}`).pipe(map(response => response.team));
   }

   public getTeams(search: TeamSearch): Observable<PaginatedResponse<TeamNew>> {
      let params: HttpParams = new HttpParams();

      if (search.captainId) {
         params = params.set('captain_id', search.captainId.toString());
      }

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
      }

      if (!isNil(search.confirmed)) {
         params = params.set('confirmed', (search.confirmed as unknown) as string);
      }

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.name) {
         params = params.set('name', search.name);
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (!isNil(search.stated)) {
         params = params.set('stated', (search.stated as unknown) as string);
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      if (search.teamParticipantId) {
         params = params.set('team_participant_id', search.teamParticipantId.toString());
      }

      if (search.teamStageId) {
         params = params.set('team_stage_id', search.teamStageId.toString());
      }

      return this.httpClient.get<PaginatedResponse<TeamNew>>(this.teamsUrl, { params });
   }

   // todo: add to postman collection
   public updateTeam(teamId: number, team: Partial<TeamNew>): Observable<TeamNew> {
      const body = team.image ? serialize(team, { booleansAsIntegers: true }) : team;
      return this.httpClient.post<{ team: TeamNew }>(`${this.teamsUrl}/${teamId}`, body).pipe(map(response => response.team));
   }
}
