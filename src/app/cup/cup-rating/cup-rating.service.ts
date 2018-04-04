import { Injectable }           from '@angular/core';
import { HttpClient }           from '@angular/common/http';
import { Observable }           from 'rxjs/Observable';

import { CupRating }            from '../../shared/models/cup-rating.model';
import { ErrorHandlerService }  from '../../core/error-handler.service';
import { environment }          from '../../../environments/environment';

@Injectable()
export class CupRatingService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private httpClient: HttpClient
    ) { }

    private cupRatingUrl = environment.apiUrl + 'cup/rating';

    /**
     * Get summary cup rating
     * @returns {Observable<CupRating[]>}
     */
    getCupRating(): Observable<CupRating[]> {
        return this.httpClient
            .get(this.cupRatingUrl)
            .catch(this.errorHandlerService.handle);
    }

}
