import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

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
        return this.httpClient.get(this.seasonsUrl).catch(this.errorHandlerService.handle);
    }

    /**
     * Get season
     * @param id
     * @returns {Observable<Season>}
     */
    getSeason(id: number): Observable<Season> {
        return this.httpClient
            .get(`${this.seasonsUrl}/${id}`)
            .map(response => response['season'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Create season
     * @param season
     * @returns {Observable<Season>}
     */
    createSeason(season: Season): Observable<Season> {
        return this.headersWithToken
            .post(this.seasonsUrl, season)
            .map(response => response['season'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Update season
     * @param season
     * @returns {Observable<Season>}
     */
    updateSeason(season: Season): Observable<Season> {
        return this.headersWithToken
            .put(`${this.seasonsUrl}/${season.id}`, season)
            .map(response => response['season'])
            .catch(this.errorHandlerService.handle);
    }
}
