import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { RequestParams } from '@models/request-params.model';
import { TeamParticipant } from '@models/team/team-participant.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TeamParticipantService {
   private teamParticipantUrl = environment.apiUrl + 'team/participants';
   constructor(
      private errorHandlerService: ErrorHandlerService,
      private headersWithToken: HeadersWithToken,
      private httpClient: HttpClient
   ) {}

   /**
    * @deprecated
    */
   public getTeamParticipant(teamParticipantId: number): Observable<TeamParticipant> {
      return this.httpClient.get<{ team_participant: TeamParticipant }>(`${this.teamParticipantUrl}/${teamParticipantId}`).pipe(
         map(response => response.team_participant),
         catchError(this.errorHandlerService.handle)
      );
   }

   /**
    * @deprecated
    */
   public getCurrentTeamParticipants(requestParams: RequestParams[]): Observable<any> {
      let params: HttpParams = new HttpParams();
      for (const requestParam of requestParams) {
         params = params.append(requestParam.parameter, requestParam.value);
      }
      return this.headersWithToken.get(this.teamParticipantUrl, params).pipe(catchError(this.errorHandlerService.handle));
   }

   /**
    * @deprecated
    */
   public createTeamParticipant(teamParticipant: TeamParticipant): Observable<TeamParticipant> {
      return this.headersWithToken.post(this.teamParticipantUrl, teamParticipant).pipe(
         map(response => response.team_participant),
         catchError(this.errorHandlerService.handle)
      );
   }

   /**
    * @deprecated
    */
   public updateTeamParticipant(teamParticipant: TeamParticipant): Observable<TeamParticipant> {
      return this.headersWithToken.put(`${this.teamParticipantUrl}/${teamParticipant.id}`, teamParticipant).pipe(
         map(response => response.team_participant),
         catchError(this.errorHandlerService.handle)
      );
   }
}
