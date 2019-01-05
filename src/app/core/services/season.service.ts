import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Season } from '@models/season.model';

@Injectable()
export class SeasonService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private seasonsUrl = environment.apiUrl + 'seasons';

    /**
     * Get all seasons
     * @returns {Observable<any>}
     */
    getSeasons(): Observable<any> {
        return this.httpClient.get<any>(this.seasonsUrl).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Get season
     * @param id
     * @returns {Observable<Season>}
     */
    getSeason(id: number): Observable<Season> {
        return this.httpClient.get(`${this.seasonsUrl}/${id}`).pipe(
            map(response => response['season']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Create season
     * @param season
     * @returns {Observable<Season>}
     */
    createSeason(season: Season): Observable<Season> {
        return this.headersWithToken.post(this.seasonsUrl, season).pipe(
            map(response => response['season']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Update season
     * @param season
     * @returns {Observable<Season>}
     */
    updateSeason(season: Season): Observable<Season> {
        return this.headersWithToken.put(`${this.seasonsUrl}/${season.id}`, season).pipe(
            map(response => response['season']),
            catchError(this.errorHandlerService.handle)
        );
    }
}
