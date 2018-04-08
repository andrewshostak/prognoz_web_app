import { Injectable }           from '@angular/core';
import { HttpClient }           from '@angular/common/http';
import { Observable }           from 'rxjs/Observable';

import { CupApplication }       from '../../shared/models/cup-application.model';
import { ErrorHandlerService }  from '../../core/error-handler.service';
import { environment }          from '../../../environments/environment';
import { HeadersWithToken }     from '../../core/headers-with-token.service';

@Injectable()
export class CupApplicationService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) { }

    private cupApplicationUrl = environment.apiUrl + 'cup/applications';

    /**
     * Get cup applications
     * @returns {Observable<CupApplication[]>}
     */
    getCupApplications(): Observable<CupApplication[]> {
        return this.httpClient
            .get(this.cupApplicationUrl)
            .map(response => response['cup_applications'])
            .catch(this.errorHandlerService.handle);
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
            .catch(this.errorHandlerService.handle);
    }

}
