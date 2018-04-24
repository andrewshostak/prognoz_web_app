import { Injectable }               from '@angular/core';
import { HttpClient, HttpParams }   from '@angular/common/http';

import { CupMatch }                 from '../../../shared/models/cup-match.model';
import { environment }              from '../../../../environments/environment';
import { ErrorHandlerService }      from '../../error-handler.service';
import { HeadersWithToken }         from '../../headers-with-token.service';
import { isNull }                   from 'util';
import { Observable }               from 'rxjs/Observable';

@Injectable()
export class CupMatchService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) { }

    private cupMatchUrl = `${environment.apiUrl}cup/matches`;

    /**
     * Get cup matches
     * @param {any} active
     * @param {any} ended
     * @returns {Observable<CupMatch[]>}
     */
    getCupMatches(active: boolean = null, ended: boolean = null): Observable<CupMatch[]> {
        let params: HttpParams = new HttpParams();
        if (!isNull(active)) {
            params = params.append('active', (active ? 1 : 0).toString());
        }
        if (!isNull(ended)) {
            params = params.append('ended', (ended ? 1 : 0).toString());
        }
        return this.httpClient
            .get(this.cupMatchUrl, {params: params})
            .map(response => response['cup_matches'])
            .catch(this.errorHandlerService.handle);
    }

}
