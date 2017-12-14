import { Injectable }               from '@angular/core';
import { HttpClient, HttpParams }   from '@angular/common/http';
import { Observable }               from 'rxjs/Observable';

import { environment }              from '../../../environments/environment';
import { ErrorHandlerService }      from '../../core/error-handler.service';
import { HeadersWithToken }         from '../../core/headers-with-token.service';
import { TeamMatch }                from '../../shared/models/team-match.model';
import { RequestParams }            from '../../shared/models/request-params.model';

@Injectable()
export class TeamMatchService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) { }

    private teamMatchUrl = environment.apiUrl + 'team/matches';

    /**
     * Create team match
     * @param teamMatch
     * @returns {Observable<TeamMatch>}
     */
    createTeamMatch(teamMatch: TeamMatch): Observable<TeamMatch> {
        return this.headersWithToken
            .post(this.teamMatchUrl, teamMatch)
            .map(response => response['team_match'])
            .catch(this.errorHandlerService.handle);
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
        return this.httpClient
            .get(this.teamMatchUrl, {params: params})
            .catch(this.errorHandlerService.handle);
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
        return this.headersWithToken
            .get(url, params)
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Update team match
     * @param teamMatch
     * @returns {Observable<TeamMatch>}
     */
    updateTeamMatch(teamMatch: TeamMatch): Observable<TeamMatch> {
        return this.headersWithToken
            .put(`${this.teamMatchUrl}/${teamMatch.id}`, teamMatch)
            .map(response => response['team_match'])
            .catch(this.errorHandlerService.handle);
    }
}
