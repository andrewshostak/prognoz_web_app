import { Injectable }                       from '@angular/core';
import { Http, Response }                   from '@angular/http';
import { Observable }                       from 'rxjs/Observable';

import { API_URL }                          from '../../../shared/app.settings';
import { HeadersWithToken }                 from '../../../shared/headers-with-token.service';
import { ChampionshipMatch }                from '../shared/championship-match.model';

@Injectable()

export class ManageChampionshipService {

    constructor(
        private http: Http,
        private headersWithToken: HeadersWithToken
    ) {}

    private championshipMatchUrl = API_URL + 'championship/matches';
    
    /**
     * Create championship match
     *
     * @param championshipMatch
     * @returns {Observable<R>}
     */
    create(championshipMatch: ChampionshipMatch): Observable<any> {
        return this.headersWithToken
            .post(this.championshipMatchUrl, championshipMatch)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Transforms to json
     *
     * @param res
     * @returns {any}
     */
    private extractData(res: Response) {
        if (res && res.status !== 204) {
            let body = res.json();
            return body || {};
        }

        return res;
    }

    /**
     * Error handling
     *
     * @param error
     * @returns {ErrorObservable}
     */
    private handleError(error: Response | any) {
        let errorObject: any;
        let errorMessage: Array<any> = [];
        if (error instanceof Response) {
            errorObject = error.json();
            if (errorObject.status_code !== 422) {
                errorMessage.push(errorObject.message);
            } else {
                if (errorObject.errors.t1_id) errorMessage.push(errorObject.errors.t1_id);
                if (errorObject.errors.t2_id) errorMessage.push(errorObject.errors.t2_id);
                if (errorObject.errors.r1) errorMessage.push(errorObject.errors.r1);
                if (errorObject.errors.r2) errorMessage.push(errorObject.errors.r2);
                if (errorObject.errors.starts_at) errorMessage.push(errorObject.errors.starts_at);
                if (errorObject.errors.predicts) errorMessage.push(errorObject.errors.predicts);
                if (errorObject.errors.points) errorMessage.push(errorObject.errors.points);
                if (errorObject.errors.dc) errorMessage.push(errorObject.errors.dc);
                if (errorObject.errors.active) errorMessage.push(errorObject.errors.active);
                if (errorObject.errors.ended) errorMessage.push(errorObject.errors.ended);
            }
        } else {
            errorMessage.push('Невідома помилка');
        }

        return Observable.throw(errorMessage);
    }
}