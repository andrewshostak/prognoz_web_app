import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CupStageType } from '@models/cup/cup-stage-type.model';
import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CupStageTypeService {
    constructor(private errorHandlerService: ErrorHandlerService, private httpClient: HttpClient) {}

    private cupStageTypeUrl = `${environment.apiUrl}cup/stage-types`;

    /**
     * Get cup stage types
     * @returns {Observable<CupStageType[]>}
     */
    getCupStageTypes(): Observable<CupStageType[]> {
        return this.httpClient
            .get(this.cupStageTypeUrl)
            .map(response => response['cup_stage_types'])
            .catch(this.errorHandlerService.handle);
    }
}
