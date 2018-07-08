import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Team } from '@models/team/team.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { RequestParams } from '@models/request-params.model';

@Injectable()
export class TeamService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private teamInfoUrl = environment.apiUrl + 'team/teams';

    /**
     * Get teams info (with participants)
     * @param requestParams
     * @returns {Observable<any>}
     */
    getTeams(requestParams?: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.httpClient.get(this.teamInfoUrl, { params: params }).catch(this.errorHandlerService.handle);
    }

    /**
     * Get team
     * @param id
     * @param requestParams
     * @returns {Observable<Team>}
     */
    getTeam(id?: number, requestParams?: RequestParams[]): Observable<Team> {
        const url = id ? `${this.teamInfoUrl}/${id}` : `${this.teamInfoUrl}/search`;
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.httpClient
            .get(url, { params: params })
            .map(response => response['team'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Create new team
     * @param team
     * @returns {Observable<Team>}
     */
    createTeam(team: Team): Observable<Team> {
        return this.headersWithToken
            .post(this.teamInfoUrl, team)
            .map(response => response['team'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Update team
     * @param team
     * @returns {Observable<Team>}
     */
    updateTeam(team: Team): Observable<Team> {
        return this.headersWithToken
            .put(`${this.teamInfoUrl}/${team.id}`, team)
            .map(response => response['team'])
            .catch(this.errorHandlerService.handle);
    }
}
