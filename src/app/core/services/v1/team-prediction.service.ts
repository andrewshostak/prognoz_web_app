import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@env';
import { RequestParams } from '@models/request-params.model';
import { TeamPrediction } from '@models/v1/team-prediction.model';
import { Observable } from 'rxjs';

@Injectable()
export class TeamPredictionService {
   constructor(private httpClient: HttpClient) {}

   private teamPredictionUrl = environment.apiBaseUrl + '/team/predictions';

   /**
    * @deprecated
    * TODO: create and use v2 endpoint instead of this
    */
   getTeamPredictions(requestParams?: RequestParams[]): Observable<{ team_predictions: TeamPrediction[] }> {
      let params: HttpParams = new HttpParams();
      if (requestParams) {
         for (const requestParam of requestParams) {
            params = params.append(requestParam.parameter, requestParam.value);
         }
      }
      return this.httpClient.get<{ team_predictions: TeamPrediction[] }>(this.teamPredictionUrl, { params });
   }
}
