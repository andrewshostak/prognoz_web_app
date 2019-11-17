import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { TeamNew } from '@models/new/team-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamSearch } from '@models/search/team-search.model';
import { UtilsService } from '@services/utils.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TeamNewService {
   public readonly teamsUrl: string = `${environment.apiUrl}v2/team/teams`;

   constructor(private httpClient: HttpClient) {}

   public createTeam(team: Partial<TeamNew>): Observable<TeamNew> {
      const body = team.image ? UtilsService.toFormData(team) : team;
      return this.httpClient.post<{ team: TeamNew }>(this.teamsUrl, body).pipe(map(response => response.team));
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
         params = params.set('competitionId', search.competitionId.toString());
      }

      if (search.confirmed) {
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

      if (search.stated) {
         params = params.set('stated', (search.stated as unknown) as string);
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      return this.httpClient.get<PaginatedResponse<TeamNew>>(this.teamsUrl, { params });
   }

   public updateTeam(teamId: number, team: Partial<TeamNew>): Observable<TeamNew> {
      if (team.image) {
         const data: FormData = UtilsService.toFormData(team);
         data.append('_method', 'PUT'); // because of laravel bug
         const stated = data.get('stated') === 'true' ? '1' : '0';
         const confirmed = data.get('confirmed') === 'true' ? '1' : '0';
         data.set('stated', stated); // because form data does not accept boolean values
         data.set('confirmed', confirmed);
         return this.httpClient.post<{ team: TeamNew }>(`${this.teamsUrl}/${teamId}`, data).pipe(map(response => response.team));
      }

      return this.httpClient.put<{ team: TeamNew }>(`${this.teamsUrl}/${teamId}`, team).pipe(map(response => response.team));
   }
}
