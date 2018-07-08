import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ChampionshipPrediction } from '@models/championship/championship-prediction.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { RequestParams } from '@models/request-params.model';

@Injectable()
export class ChampionshipPredictionService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private championshipPredictionUrl = environment.apiUrl + 'championship/predictions';

    /**
     * Update championship predictions
     * @returns {Observable<any>}
     */
    updateChampionshipPredictions(championshipPredictions: ChampionshipPrediction[]): Observable<any> {
        return this.headersWithToken.put(this.championshipPredictionUrl, championshipPredictions).catch(this.errorHandlerService.handle);
    }

    /**
     * Get championship predictions
     * @param requestParams
     * @returns {Observable<any>}
     */
    getChampionshipPredictions(requestParams?: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.httpClient.get(this.championshipPredictionUrl, { params: params }).catch(this.errorHandlerService.handle);
    }
}
