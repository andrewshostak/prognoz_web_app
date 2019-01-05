import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { CupCupMatch } from '@models/cup/cup-cup-match.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs';

@Injectable()
export class CupCupMatchService {
    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private cupCupMatchUrl = `${environment.apiUrl}cup/cup-matches`;

    /**
     * Get cup cup matches
     * @param active
     * @param cupStageId
     * @param page
     * @param ended
     * @param order
     * @param sequence
     * @returns {any}
     */
    getCupCupMatches(
        active?: boolean,
        cupStageId?: number,
        page?: number,
        ended?: boolean,
        order?: string,
        sequence?: 'asc' | 'desc'
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
        if (!isNullOrUndefined(cupStageId)) {
            params = params.append('cup_stage_id', cupStageId.toString());
        }
        if (!isNullOrUndefined(order)) {
            params = params.append('order', order);
        }
        if (!isNullOrUndefined(sequence)) {
            params = params.append('sequence', sequence);
        }
        return this.httpClient.get(this.cupCupMatchUrl, { params: params }).pipe(catchError(this.errorHandlerService.handle));
    }

    /**
     * Get cup cup match
     * @param {number} cupCupMatchId
     * @returns {Observable<CupCupMatch>}
     */
    getCupCupMatch(cupCupMatchId: number): Observable<CupCupMatch> {
        return this.httpClient.get(`${this.cupCupMatchUrl}/${cupCupMatchId}`).pipe(
            map(response => response['cup_cup_match']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Cup cup matches auto creation
     * @param {type: 'auto' | 'manual'; to: number; number_of_matches: number} params
     * @returns {Observable<CupCupMatch[]>}
     */
    createCupCupMatchesAuto(params: { type: 'auto' | 'manual'; to: number; number_of_matches: number }): Observable<CupCupMatch[]> {
        return this.headersWithToken.post(this.cupCupMatchUrl, params).pipe(
            map(response => response['cup_cup_matches']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Create cup cup match
     * @param {CupCupMatch} cupCupMatch
     * @returns {Observable<CupCupMatch>}
     */
    createCupCupMatch(cupCupMatch: CupCupMatch): Observable<CupCupMatch> {
        return this.headersWithToken.post(this.cupCupMatchUrl, cupCupMatch).pipe(
            map(response => response['cup_cup_match']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Update cup cup match
     * @param {CupCupMatch} cupCupMatch
     * @param {number} cupCupMatchId
     * @returns {Observable<CupCupMatch>}
     */
    updateCupCupMatch(cupCupMatch: CupCupMatch, cupCupMatchId: number): Observable<CupCupMatch> {
        return this.headersWithToken.put(`${this.cupCupMatchUrl}/${cupCupMatchId}`, cupCupMatch).pipe(
            map(response => response['cup_cup_match']),
            catchError(this.errorHandlerService.handle)
        );
    }

    /**
     * Delete cup cup match
     * @param {number} cupCupMatchId
     * @returns {Observable<void>}
     */
    deleteCupCupMatch(cupCupMatchId: number): Observable<void> {
        return this.headersWithToken.delete(`${this.cupCupMatchUrl}/${cupCupMatchId}`).pipe(catchError(this.errorHandlerService.handle));
    }
}
