import { Injectable }               from '@angular/core';
import { HttpClient, HttpParams }   from '@angular/common/http';

import { CupStage }                 from '../../../shared/models/cup-stage.model';
import { environment }              from 'environments/environment';
import { ErrorHandlerService }      from '../../error-handler.service';
import { HeadersWithToken }         from '../../headers-with-token.service';
import { isNullOrUndefined }        from 'util';
import { Observable }               from 'rxjs/Observable';

@Injectable()
export class CupStageService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) { }

    private cupStageUrl = `${environment.apiUrl}cup/stages`;

    /**
     * Get cup stages
     * @param {number} page
     * @param {boolean} active
     * @param {boolean} ended
     * @param {number} competitionId
     * @returns {Observable<any>}
     */
    getCupStages(
        page?: number,
        active?: boolean,
        ended?: boolean,
        competitionId?: number
    ): Observable<any> {
        let params = new HttpParams();
        if (page) {
            params = params.append('page', page.toString());
        }
        if (!isNullOrUndefined(active)) {
            params = params.append('active', active ? '1' : '0');
        }
        if (!isNullOrUndefined(ended)) {
            params = params.append('ended', ended ? '1' : '0');
        }
        if (!isNullOrUndefined(competitionId)) {
            params = params.append('competition_id', competitionId.toString());
        }
        return this.httpClient
            .get(this.cupStageUrl, {params: params})
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Get cup stage by id
     * @param {number} cupStageId
     * @returns {Observable<CupStage>}
     */
    getCupStage(cupStageId: number): Observable<CupStage> {
        return this.httpClient
            .get(`${this.cupStageUrl}/${cupStageId}`)
            .map(response => response['cup_stage'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Create cup stage
     * @param {CupStage} cupStage
     * @returns {Observable<CupStage>}
     */
    createCupStage(cupStage: CupStage): Observable<CupStage> {
        return this.headersWithToken
            .post(this.cupStageUrl, cupStage)
            .map(response => response['cup_stage'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Update cup stage
     * @param {CupStage} cupStage
     * @param {number} cupStageId
     * @returns {Observable<CupStage>}
     */
    updateCupStage(cupStage: CupStage, cupStageId: number): Observable<CupStage> {
        return this.headersWithToken
            .put(`${this.cupStageUrl}/${cupStageId}`, cupStage)
            .map(response => response['cup_stage'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Delete cup stage
     * @param {number} cupStageId
     * @returns {Observable<void>}
     */
    deleteCupStage(cupStageId: number): Observable<void> {
        return this.headersWithToken
            .delete(`${this.cupStageUrl}/${cupStageId}`)
            .catch(this.errorHandlerService.handle);
    }
}
