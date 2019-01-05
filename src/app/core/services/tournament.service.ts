import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { Observable } from 'rxjs';

@Injectable()
export class TournamentService {
    constructor(private errorHandlerService: ErrorHandlerService, private httpClient: HttpClient) {}

    private tournamentsUrl = environment.apiUrl + 'tournaments';

    /**
     * Get all tournaments
     * @returns {Observable<any>}
     */
    getTournaments(): Observable<any> {
        return this.httpClient.get(this.tournamentsUrl).pipe(catchError(this.errorHandlerService.handle));
    }
}
