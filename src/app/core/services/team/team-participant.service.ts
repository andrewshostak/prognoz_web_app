import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TeamParticipant } from '@models/team/team-participant.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { RequestParams } from '@models/request-params.model';

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
        return this.httpClient.get(this.teamParticipantUrl, { params: params }).catch(this.errorHandlerService.handle);
    }

    /**
     * Get Team participant
     * @param {number} teamParticipantId
     * @returns {Observable<TeamParticipant>}
     */
    getTeamParticipant(teamParticipantId: number): Observable<TeamParticipant> {
        return this.httpClient
            .get(`${this.teamParticipantUrl}/${teamParticipantId}`)
            .map(response => response['team_participant'])
            .catch(this.errorHandlerService.handle);
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
        return this.headersWithToken.get(this.teamParticipantUrl, params).catch(this.errorHandlerService.handle);
    }

    /**
     * Create team participant
     * @param teamParticipant
     * @returns {Observable<TeamParticipant>}
     */
    createTeamParticipant(teamParticipant: TeamParticipant): Observable<TeamParticipant> {
        return this.headersWithToken
            .post(this.teamParticipantUrl, teamParticipant)
            .map(response => response['team_participant'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Update team participant
     * @param teamParticipant
     * @returns {Observable<TeamParticipant>}
     */
    updateTeamParticipant(teamParticipant: TeamParticipant): Observable<TeamParticipant> {
        return this.headersWithToken
            .put(`${this.teamParticipantUrl}/${teamParticipant.id}`, teamParticipant)
            .map(response => response['team_participant'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Delete team participant
     * @param {number} teamParticipantId
     * @returns {Observable<void>}
     */
    deleteTeamParticipant(teamParticipantId: number): Observable<void> {
        return this.headersWithToken.delete(`${this.teamParticipantUrl}/${teamParticipantId}`).catch(this.errorHandlerService.handle);
    }
}
