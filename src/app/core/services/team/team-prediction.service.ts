import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpParams } from '@angular/common/http';

import { environment } from '@env';
import { ErrorHandlerService } from '@services/error-handler.service';
import { HeadersWithToken } from '@services/headers-with-token.service';
import { RequestParams } from '@models/request-params.model';
import { TeamPrediction } from '@models/team/team-prediction.model';

@Injectable()
export class TeamPredictionService {
    constructor(private errorHandlerService: ErrorHandlerService, private headersWithToken: HeadersWithToken) {}

    private teamPredictionUrl = environment.apiUrl + 'team/predictions';

    /**
     * Update or create team prediction
     * @param teamPrediction
     * @returns {Observable<TeamPrediction>}
     */
    updateTeamPrediction(teamPrediction: TeamPrediction): Observable<TeamPrediction> {
        const url = teamPrediction.id ? `${this.teamPredictionUrl}/${teamPrediction.id}` : this.teamPredictionUrl;
        return this.headersWithToken.put(url, teamPrediction).catch(this.errorHandlerService.handle);
    }

    /**
     * Get team predictions
     * @param requestParams
     * @returns {Observable<any>}
     */
    getTeamPredictions(requestParams?: RequestParams[]): Observable<any> {
        let params: HttpParams = new HttpParams();
        if (requestParams) {
            for (const requestParam of requestParams) {
                params = params.append(requestParam.parameter, requestParam.value);
            }
        }
        return this.headersWithToken.get(this.teamPredictionUrl, params).catch(this.errorHandlerService.handle);
    }
}
