import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { CupApplication } from '@models/cup/cup-application.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { environment } from '@env';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { Observable } from 'rxjs';

@Injectable()
export class CupApplicationService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private cupApplicationUrl = environment.apiUrl + 'cup/applications';

    /**
     * Get cup applications
     * @returns {Observable<CupApplication[]>}
     */
    getCupApplications(): Observable<CupApplication[]> {
        return this.httpClient.get(this.cupApplicationUrl).pipe(
            map(response => response['cup_applications']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Update cup application
     * @param cupApplication
     * @param cupApplicationId
     * @returns {Observable<CupApplication>}
     */
    updateCupApplication(cupApplication, cupApplicationId: number): Observable<CupApplication> {
        return this.headersWithToken
            .put(`${this.cupApplicationUrl}/${cupApplicationId}`, cupApplication)
            .pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Create cup application
     * @param {CupApplication} cupApplication
     * @returns {Observable<CupApplication>}
     */
    createCupApplication(cupApplication: CupApplication): Observable<CupApplication> {
        return this.headersWithToken.post(this.cupApplicationUrl, cupApplication).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Delete cup application
     * @param {number} cupApplicationId
     * @returns {Observable<void>}
     */
    deleteCupApplication(cupApplicationId: number): Observable<void> {
        return this.headersWithToken
            .delete(`${this.cupApplicationUrl}/${cupApplicationId}`)
            .pipe(catchError(this.errorHandlerService.handle));
    }
}
