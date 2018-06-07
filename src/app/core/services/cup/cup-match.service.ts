import { Injectable }               from '@angular/core';
import { HttpClient, HttpParams }   from '@angular/common/http';

import { CupMatch }                 from '../../../shared/models/cup-match.model';
import { environment }              from '../../../../environments/environment';
import { ErrorHandlerService }      from '../../error-handler.service';
import { HeadersWithToken }         from '../../headers-with-token.service';
import { isNullOrUndefined }        from 'util';
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
     * @param {number} page
     * @param {boolean} active
     * @param {boolean} ended
     * @param {string} order
     * @param {string} sequence
     * @param {string} cupStageId
     * @returns {Observable<CupMatch[]>}
     */
    getCupMatches(
        page?: number,
        active?: boolean,
        ended?: boolean,
        order?: string,
        sequence?: 'asc' | 'desc',
        cupStageId?: number
    ): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (page) {
            params = params.append('page', page.toString());
        }
        if (!isNullOrUndefined(active)) {
            params = params.append('active', active ? '1' : '0');
        }
        if (!isNullOrUndefined(ended)) {
            params = params.append('ended', ended ? '1' : '0');
        }
        if (!isNullOrUndefined(order)) {
            params = params.append('order', order);
        }
        if (!isNullOrUndefined(sequence)) {
            params = params.append('sequence', sequence);
        }
        if (!isNullOrUndefined(cupStageId)) {
            params = params.append('cup_stage_id', cupStageId.toString());
        }
        return this.httpClient
            .get(this.cupMatchUrl, {params})
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Get predictable cup matches
     * @returns {Observable<CupMatch[]>}
     */
    getCupMatchesPredictable(): Observable<CupMatch[]> {
        return this.headersWithToken
            .get(`${this.cupMatchUrl}-predictable`)
            .map(response => response['cup_matches'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Get cup match
     * @param {number} cupMatchId
     * @returns {Observable<CupMatch>}
     */
    getCupMatch(cupMatchId: number): Observable<CupMatch> {
        return this.httpClient
            .get(`${this.cupMatchUrl}/${cupMatchId}`)
            .map(response => response['cup_match'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Create cup match
     * @param {CupMatch} cupMatch
     * @returns {Observable<CupMatch>}
     */
    createCupMatch(cupMatch: CupMatch): Observable<CupMatch> {
        return this.headersWithToken
            .post(this.cupMatchUrl, cupMatch)
            .map(response => response['cup_match'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Update cup match
     * @param {CupMatch} cupMatch
     * @param {number} cupMatchId
     * @returns {Observable<CupMatch>}
     */
    updateCupMatch(cupMatch: CupMatch, cupMatchId: number): Observable<CupMatch> {
        return this.headersWithToken
            .put(`${this.cupMatchUrl}/${cupMatchId}`, cupMatch)
            .map(response => response['cup_match'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Delete cup match
     * @param {number} cupMatchId
     * @returns {Observable<void>}
     */
    deleteCupMatch(cupMatchId: number): Observable<void> {
        return this.headersWithToken
            .delete(`${this.cupMatchUrl}/${cupMatchId}`)
            .catch(this.errorHandlerService.handle);
    }
}