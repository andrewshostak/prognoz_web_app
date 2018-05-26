import { Injectable }               from '@angular/core';
import { HttpClient, HttpParams }   from '@angular/common/http';

import { CupPrediction }            from '../../../shared/models/cup-prediction.model';
import { environment }              from '../../../../environments/environment';
import { ErrorHandlerService }      from '../../error-handler.service';
import { HeadersWithToken }         from '../../headers-with-token.service';
import { Observable }               from 'rxjs/Observable';

@Injectable()
export class CupPredictionService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) { }

    private cupPredictionUrl = `${environment.apiUrl}cup/predictions`;

    /**
     * Get cup predictions
     * @param {number} cupCupMatchId
     * @param {number} userId
     * @returns {Observable<CupPrediction[]>}
     */
    getCupPredictions(cupCupMatchId?: number, userId?: number): Observable<CupPrediction[]> {
        let params: HttpParams = new HttpParams();
        if (cupCupMatchId) {
            params = params.append('cup_cup_match_id', cupCupMatchId.toString());
        }
        if (userId) {
            params = params.append('user_id', userId.toString());
        }
        return this.httpClient
            .get(this.cupPredictionUrl, {params})
            .map(response => response['cup_predictions'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Update or create cup prediction
     * @param {CupPrediction} cupPrediction
     * @returns {Observable<CupPrediction>}
     */
    updateCupPrediction(cupPrediction: CupPrediction): Observable<CupPrediction> {
        return this.headersWithToken
            .put(this.cupPredictionUrl, cupPrediction)
            .map(response => response['cup_prediction'])
            .catch(this.errorHandlerService.handle);
    }
}
