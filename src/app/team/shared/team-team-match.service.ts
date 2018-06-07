import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { HeadersWithToken } from '../../core/headers-with-token.service';
import { TeamTeamMatch } from '../../shared/models/team-team-match.model';

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
     * @param page
     * @returns {Observable<any>}
     */
    getTeamTeamMatches(page?: number): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (page) {
            params = params.append('page', page.toString());
        }
        return this.httpClient.get(this.teamTeamMatchUrl, { params: params }).catch(this.errorHandlerService.handle);
    }

    /**
     * Update team-team match
     * @param teamTeamMatch
     * @returns {Observable<TeamTeamMatch>}
     */
    updateTeamTeamMatch(teamTeamMatch: TeamTeamMatch): Observable<TeamTeamMatch> {
        return this.headersWithToken
            .put(`${this.teamTeamMatchUrl}/${teamTeamMatch.id}`, teamTeamMatch)
            .map(response => response['team_team_match'])
            .catch(this.errorHandlerService.handle);
    }
}
