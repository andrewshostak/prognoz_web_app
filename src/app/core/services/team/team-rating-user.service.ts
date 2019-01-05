import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { TeamRatingUser } from '@models/team/team-rating-user.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { RequestParams } from '@models/request-params.model';
import { Observable } from 'rxjs';

@Injectable()
export class TeamRatingUserService {
    constructor(private errorHandlerService: ErrorHandlerService, private httpClient: HttpClient) {}

    private teamRatingUserUrl = environment.apiUrl + 'team/rating-user';

    /**
     * Get team rating user
     * @param requestParams
     * @returns {Observable<TeamRatingUser[]>}
     */
    getTeamRatingUser(requestParams?: RequestParams[]): Observable<TeamRatingUser[]> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.httpClient.get(this.teamRatingUserUrl, { params: params }).pipe(
            map(response => response['team_rating_users']),
            catchError(this.errorHandlerService.handle)
        );
    }
}
