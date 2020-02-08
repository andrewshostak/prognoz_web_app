import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { RequestParams } from '@models/request-params.model';
import { Team } from '@models/team/team.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TeamService {
   private teamInfoUrl = environment.apiUrl + 'team/teams';
   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   /**
    * @deprecated
    */
   public getTeams(requestParams?: RequestParams[]): Observable<any> {
      let params: HttpParams = new HttpParams();
      if (requestParams) {
         for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
         }
      }
      return this.httpClient.get(this.teamInfoUrl, { params }).pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * @deprecated
    */
   public getTeam(id?: number, requestParams?: RequestParams[]): Observable<Team> {
      const url = id ? `${this.teamInfoUrl}/${id}` : `${this.teamInfoUrl}/search`;
      let params: HttpParams = new HttpParams();
      if (requestParams) {
         for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
         }
      }
      return this.httpClient.get<{ team: Team }>(url, { params }).pipe(
         map(response => response.team),
         catchError(this.errorHandlerService.handle)
      );
   }
}
