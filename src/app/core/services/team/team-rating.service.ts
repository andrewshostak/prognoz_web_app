import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { TeamRating } from '@models/team/team-rating.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { Observable } from 'rxjs';
import { RequestParams } from '@models/request-params.model';

@Injectable()
export class TeamRatingService {
    constructor(private errorHandlerService: ErrorHandlerService, private httpClient: HttpClient) {}

    private teamRatingUrl = environment.apiUrl + 'team/rating';

    /**
     * Get team rating
     * @param requestParams
     * @returns {Observable<TeamRating[]>}
     */
    getTeamRating(requestParams?: RequestParams[]): Observable<TeamRating[]> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.httpClient.get(this.teamRatingUrl, { params: params }).pipe(
            map(response => response['team_ratings']),
            catchError(this.errorHandlerService.handle)
        );
    }
}
