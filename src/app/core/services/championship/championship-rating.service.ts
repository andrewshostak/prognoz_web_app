import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { environment } from '@env';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { RequestParams } from '@models/request-params.model';

@Injectable()
export class ChampionshipRatingService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private championshipRatingUrl = environment.apiUrl + 'championship/rating';

    /**
     * Get championship rating
     * @param requestParams
     * @returns {Observable<any>}
     */
    getChampionshipRatingItems(requestParams?: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.httpClient.get(this.championshipRatingUrl, { params: params }).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Get championship rating item
     * @param userId
     * @param competitionId
     * @returns {Observable<ChampionshipRating>}
     */
    getChampionshipRatingItem(userId: number, competitionId?: number): Observable<ChampionshipRating> {
        let params: HttpParams = new HttpParams();
        if (competitionId) {
            params = params.append('competition_id', competitionId.toString());
        }
        return this.httpClient.get(`${this.championshipRatingUrl}/${userId}`, { params: params }).pipe(
            map(response => response['championship_rating']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Update positions and moving
     * @returns {Observable<void>}
     */
    updateChampionshipRatingItems(): Observable<void> {
        return this.headersWithToken.put(this.championshipRatingUrl, {}).pipe(catchError(this.errorHandlerService.handle));
    }
}
