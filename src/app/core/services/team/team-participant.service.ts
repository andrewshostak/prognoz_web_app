import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { RequestParams } from '@models/request-params.model';
import { TeamParticipant } from '@models/team/team-participant.model';

@Injectable()
export class TeamParticipantService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private teamParticipantUrl = environment.apiUrl + 'team/participants';

    /**
     * Get team participants
     * @param requestParams
     * @returns {Observable<any>}
     */
    getTeamParticipants(requestParams?: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.headersWithToken.get(this.teamParticipantUrl, params).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Get Team participant
     * @param {number} teamParticipantId
     * @returns {Observable<TeamParticipant>}
     */
    getTeamParticipant(teamParticipantId: number): Observable<TeamParticipant> {
        return this.httpClient.get(`${this.teamParticipantUrl}/${teamParticipantId}`).pipe(
            map(response => response['team_participant']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Get participants for captain
     * @param requestParams
     * @returns {Observable<any>}
     */
    getCurrentTeamParticipants(requestParams: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
        }
        return this.headersWithToken.get(this.teamParticipantUrl, params).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Create team participant
     * @param teamParticipant
     * @returns {Observable<TeamParticipant>}
     */
    createTeamParticipant(teamParticipant: TeamParticipant): Observable<TeamParticipant> {
        return this.headersWithToken.post(this.teamParticipantUrl, teamParticipant).pipe(
            map(response => response['team_participant']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Update team participant
     * @param teamParticipant
     * @returns {Observable<TeamParticipant>}
     */
    updateTeamParticipant(teamParticipant: TeamParticipant): Observable<TeamParticipant> {
        return this.headersWithToken.put(`${this.teamParticipantUrl}/${teamParticipant.id}`, teamParticipant).pipe(
            map(response => response['team_participant']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Delete team participant
     * @param {number} teamParticipantId
     * @returns {Observable<void>}
     */
    deleteTeamParticipant(teamParticipantId: number): Observable<void> {
        return this.headersWithToken
            .delete(`${this.teamParticipantUrl}/${teamParticipantId}`)
            .pipe(catchError(this.errorHandlerService.handle));
    }
}
