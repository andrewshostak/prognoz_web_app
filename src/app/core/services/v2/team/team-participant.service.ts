import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamParticipant } from '@models/v2/team/team-participant.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamParticipantSearch } from '@models/search/team/team-participant-search.model';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TeamParticipantService {
   public readonly teamParticipantsUrl: string = `${environment.apiBaseUrl}/v2/team/participants`;

   public static readonly participantsInTeam: number = 4;

   constructor(private httpClient: HttpClient) {}

   public createTeamParticipant(
      teamParticipant: Partial<TeamParticipant>,
      deviceId?: string,
      deviceInfo?: { [key: string]: any }
   ): Observable<TeamParticipant> {
      if (deviceId && deviceInfo) {
         const httpOptions = { headers: new HttpHeaders({ 'x-device-id': deviceId }) };
         return this.httpClient
            .post<{ team_participant: TeamParticipant }>(this.teamParticipantsUrl, { ...teamParticipant, deviceInfo }, httpOptions)
            .pipe(map(response => response.team_participant));
      }

      return this.httpClient
         .post<{ team_participant: TeamParticipant }>(this.teamParticipantsUrl, teamParticipant)
         .pipe(map(response => response.team_participant));
   }

   public deleteTeamParticipant(teamParticipantId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.teamParticipantsUrl}/${teamParticipantId}`);
   }

   public getTeamParticipant(teamParticipantId: number): Observable<TeamParticipant> {
      return this.httpClient
         .get<{ team_participant: TeamParticipant }>(`${this.teamParticipantsUrl}/${teamParticipantId}`)
         .pipe(map(response => response.team_participant));
   }

   public getTeamParticipants(search: TeamParticipantSearch): Observable<PaginatedResponse<TeamParticipant>> {
      let params: HttpParams = new HttpParams();

      if (search.captain) {
         params = params.set('captain', (search.captain as unknown) as string);
      }

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
      }

      if (search.confirmed) {
         params = params.set('confirmed', (search.confirmed as unknown) as string);
      }

      if (!isNil(search.ended)) {
         params = params.set('ended', (search.ended as unknown) as string);
      }

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (!isNil(search.refused)) {
         params = params.set('refused', (search.refused as unknown) as string);
      }

      if (search.sequence) {
         params = params.set('sequence', search.sequence);
      }

      if (search.teamId) {
         params = params.set('team_id', search.teamId.toString());
      }

      if (search.teamStageId) {
         params = params.set('team_stage_id', search.teamStageId.toString());
      }

      if (search.userId) {
         params = params.set('user_id', search.userId.toString());
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }
      return this.httpClient.get<PaginatedResponse<TeamParticipant>>(this.teamParticipantsUrl, { params });
   }

   public updateTeamParticipant(teamParticipantId: number, teamParticipant: Partial<TeamParticipant>): Observable<TeamParticipant> {
      return this.httpClient
         .put<{ team_participant: TeamParticipant }>(`${this.teamParticipantsUrl}/${teamParticipantId}`, teamParticipant)
         .pipe(map(response => response.team_participant));
   }
}
