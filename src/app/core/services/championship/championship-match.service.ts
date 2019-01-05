import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';
import { RequestParams } from '@models/request-params.model';

@Injectable()
export class ChampionshipMatchService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private championshipMatchUrl = environment.apiUrl + 'championship/matches';

    /**
     * Create championship match
     * @param championshipMatch
     * @returns {Observable<ChampionshipMatch>}
     */
    createChampionshipMatch(championshipMatch: ChampionshipMatch): Observable<ChampionshipMatch> {
        return this.headersWithToken.post(this.championshipMatchUrl, championshipMatch).pipe(
            map(response => response['championship_match']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Update championship match
     * @param championshipMatch
     * @returns {Observable<ChampionshipMatch>}
     */
    updateChampionshipMatch(championshipMatch: ChampionshipMatch): Observable<ChampionshipMatch> {
        return this.headersWithToken.put(`${this.championshipMatchUrl}/${championshipMatch.id}`, championshipMatch).pipe(
            map(response => response['championship_match']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Get match info
     * @param id
     * @param requestParams
     * @returns {Observable<any>}
     */
    getChampionshipMatch(id: number, requestParams?: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.httpClient
            .get(`${this.championshipMatchUrl}/${id}`, { params: params })
            .pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Get championship matches
     * @param requestParams
     * @returns {Observable<any>}
     */
    getChampionshipMatches(requestParams?: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.httpClient.get(this.championshipMatchUrl, { params: params }).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Get matches with current user prediction.
     * It has to be a separate method with separate backend path
     * Because backend can't get current authenticated user if we don't use HeadersWithToken service.
     * @param requestParams
     * @returns {Observable<any>}
     */
    getChampionshipPredictableMatches(requestParams: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        const url = `${this.championshipMatchUrl}-predictable`;
        for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
        }
        return this.headersWithToken.get(url, params).pipe(catchError(this.errorHandlerService.handle));
    }
}
