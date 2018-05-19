import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CupCupMatch } from '../../../shared/models/cup-cup-match.model';
import { environment } from '../../../../environments/environment';
import { ErrorHandlerService } from '../../error-handler.service';
import { HeadersWithToken } from '../../headers-with-token.service';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CupCupMatchService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) { }

    private cupCupMatchUrl = `${environment.apiUrl}cup/cup-matches`;

    /**
     * Get cup cup matches
     * @param active
     * @param cupStageId
     * @returns {any}
     */
    getCupCupMatches(active?: boolean, cupStageId?: number): Observable<CupCupMatch[]> {
        let params: HttpParams = new HttpParams();
        if (!isNullOrUndefined(active)) {
            params = params.append('active', active ? '1' : '0');
        }
        if (!isNullOrUndefined(cupStageId)) {
            params = params.append('cup_stage_id', cupStageId.toString());
        }
        return this.httpClient
            .get(this.cupCupMatchUrl, {params: params})
            .map(response => response['cup_cup_matches'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Get cup cup match
     * @param {number} cupCupMatchId
     * @returns {Observable<CupCupMatch>}
     */
    getCupCupMatch(cupCupMatchId: number): Observable<CupCupMatch> {
        return this.httpClient
            .get(`${this.cupCupMatchUrl}/${cupCupMatchId}`)
            .map(response => response['cup_cup_match'])
            .catch(this.errorHandlerService.handle);
    }

}
