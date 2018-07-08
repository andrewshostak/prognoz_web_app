import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { CupRating } from '@models/cup/cup-rating.model';
import { CupRatingGroup } from '@models/cup/cup-rating-group.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { environment } from '@env';

@Injectable()
export class CupRatingService {
    constructor(private errorHandlerService: ErrorHandlerService, private httpClient: HttpClient) {}

    private cupRatingUrl = environment.apiUrl + 'cup/rating';

    /**
     * Get summary cup rating
     * @returns {Observable<CupRating[]>}
     */
    getCupRating(): Observable<CupRating[]> {
        return this.httpClient.get(this.cupRatingUrl).catch(this.errorHandlerService.handle);
    }

    /**
     * Get user cup rating
     * @param {number} userId
     * @returns {Observable<CupRating>}
     */
    getCupRatingUser(userId: number): Observable<CupRating> {
        return this.httpClient.get(`${this.cupRatingUrl}/${userId}`).catch(this.errorHandlerService.handle);
    }

    /**
     * Get group rating
     * @param {number} competitionId
     * @param {number} groupNumber
     * @returns {Observable<CupRatingGroup[]>}
     */
    getCupRatingGroup(competitionId: number, groupNumber: number): Observable<CupRatingGroup[]> {
        return this.httpClient
            .get(`${environment.apiUrl}cup/${competitionId}/rating-group/${groupNumber}`)
            .catch(this.errorHandlerService.handle);
    }
}
