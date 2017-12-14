import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment }          from '../../environments/environment';
import { ErrorHandlerService }  from './error-handler.service';

@Injectable()

export class TournamentService {

    constructor(
        private errorHandlerService: ErrorHandlerService,
        private httpClient: HttpClient
    ) {}

    private tournamentsUrl = environment.apiUrl + 'tournaments';

    /**
     * Get all tournaments
     * @returns {Observable<any>}
     */
    getTournaments(): Observable<any> {
        return this.httpClient
            .get(this.tournamentsUrl)
            .catch(this.errorHandlerService.handle);
    }
}