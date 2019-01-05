import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { TeamMatch } from '@models/team/team-match.model';
import { RequestParams } from '@models/request-params.model';
import { Observable } from 'rxjs';

@Injectable()
export class TeamMatchService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private teamMatchUrl = environment.apiUrl + 'team/matches';

    /**
     * Create team match
     * @param teamMatch
     * @returns {Observable<TeamMatch>}
     */
    createTeamMatch(teamMatch: TeamMatch): Observable<TeamMatch> {
        return this.headersWithToken.post(this.teamMatchUrl, teamMatch).pipe(
            map(response => response['team_match']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Get team matches
     * @param requestParams
     * @returns {Observable<any>}
     */
    getTeamMatches(requestParams?: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.httpClient.get(this.teamMatchUrl, { params: params }).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Get matches with current team predictions
     * @param requestParams
     * @returns {Observable<any>}
     */
    getTeamMatchesAuthUser(requestParams: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        const url = `${this.teamMatchUrl}-predictable`;
        for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
        }
        return this.headersWithToken.get(url, params).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Get team match
     * @param {number} teamMatchId
     * @returns {Observable<TeamMatch>}
     */
    getTeamMatch(teamMatchId: number): Observable<TeamMatch> {
        return this.httpClient.get(`${this.teamMatchUrl}/${teamMatchId}`).pipe(
            map(response => response['team_match']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Update team match
     * @param teamMatch
     * @returns {Observable<TeamMatch>}
     */
    updateTeamMatch(teamMatch: TeamMatch): Observable<TeamMatch> {
        return this.headersWithToken.put(`${this.teamMatchUrl}/${teamMatch.id}`, teamMatch).pipe(
            map(response => response['team_match']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Delete team match
     * @param {number} teamMatchId
     * @returns {Observable<void>}
     */
    deleteTeamMatch(teamMatchId: number): Observable<void> {
        return this.headersWithToken.delete(`${this.teamMatchUrl}/${teamMatchId}`).pipe(catchError(this.errorHandlerService.handle));
    }
}
