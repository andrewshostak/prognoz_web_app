import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { RequestParams } from '@models/request-params.model';
import { TeamTeamMatch } from '@models/team/team-team-match.model';
import { Observable } from 'rxjs';

@Injectable()
export class TeamTeamMatchService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private teamTeamMatchUrl = environment.apiUrl + 'team/team-matches';

    /**
     * Get all matches
     * @returns {Observable<any>}
     * @param requestParams
     */
    getTeamTeamMatches(requestParams?: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.httpClient.get(this.teamTeamMatchUrl, { params: params }).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Update team-team match
     * @param teamTeamMatch
     * @returns {Observable<TeamTeamMatch>}
     */
    updateTeamTeamMatch(teamTeamMatch: TeamTeamMatch): Observable<TeamTeamMatch> {
        return this.headersWithToken.put(`${this.teamTeamMatchUrl}/${teamTeamMatch.id}`, teamTeamMatch).pipe(
            map(response => response['team_team_match']),
            catchError(this.errorHandlerService.handle)
        );
    }
}
