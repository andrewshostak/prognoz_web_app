import { Injectable }               from '@angular/core';
import { HttpClient, HttpParams }   from '@angular/common/http';
import { Observable }               from 'rxjs/Observable';

import { Competition }          from '../shared/models/competition.model';
import { ErrorHandlerService }  from './error-handler.service';
import { environment }          from '../../environments/environment';
import { HeadersWithToken }     from './headers-with-token.service';
import { isNullOrUndefined }    from 'util';

@Injectable()

export class CompetitionService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private headersWithToken: HeadersWithToken,
        private httpClient: HttpClient
    ) {}

    private competitionUrl = environment.apiUrl + 'competitions';

    /**
     * Get competitions list
     * @param page
     * @param season
     * @param tournament
     * @param state
     * @param stated
     * @param active
     * @param ended
     * @returns {Observable<any>}
     */
    getCompetitions(
        page?: number,
        tournament?: number,
        season?: number,
        state?: boolean,
        stated?: boolean,
        active?: boolean,
        ended?: boolean
    ): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (page) {
            params = params.append('page', page.toString());
        }
        if (tournament) {
            params = params.append('tournament', tournament.toString());
        }
        if (season) {
            params = params.append('season', season.toString());
        }
        if (state) {
            params = params.append('state', state.toString());
        }
        if (!isNullOrUndefined(stated)) {
            params = params.append('stated', (stated ? 1 : 0).toString());
        }
        if (!isNullOrUndefined(active)) {
            params = params.append('active', (active ? 1 : 0).toString());
        }
        if (!isNullOrUndefined(ended)) {
            params = params.append('ended', (ended ? 1 : 0).toString());
        }
        return this.httpClient
            .get(this.competitionUrl, {params: params})
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Get competition by id
     * @param id
     * @returns {Competition}
     */
    getCompetition(id: number): Observable<Competition> {
        return this.httpClient
            .get(`${this.competitionUrl}/${id}`)
            .map(response => response['competition'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Create competition
     * @param competition
     * @returns {Observable<Competition>}
     */
    createCompetition(competition: Competition): Observable<Competition> {
        return this.headersWithToken
            .post(this.competitionUrl, competition)
            .map(response => response['competition'])
            .catch(this.errorHandlerService.handle);
    }

    /**
     * Update competition
     * @param competition
     * @returns {Observable<Competition>}
     */
    updateCompetition(competition: Competition, competitionId: number): Observable<Competition> {
        return this.headersWithToken
            .put(`${this.competitionUrl}/${competitionId}`, competition)
            .map(response => response['competition'])
            .catch(this.errorHandlerService.handle);
    }
}
