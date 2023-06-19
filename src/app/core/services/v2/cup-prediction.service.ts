import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupPrediction } from '@models/v2/cup/cup-prediction.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupPredictionSearch } from '@models/search/cup/cup-prediction-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CupPredictionService {
   public readonly cupPredictionsUrl: string = `${environment.apiBaseUrl}/v2/cup/predictions`;

   constructor(private httpClient: HttpClient) {}

   getCupPredictions(search: CupPredictionSearch): Observable<PaginatedResponse<CupPrediction>> {
      const params: HttpParams = new HttpParams({
         fromObject: {
            user_id: search.userId.toString(),
            'cup_cup_match_ids[]': search.cupCupMatchIds.map(id => id.toString())
         }
      });

      return this.httpClient.get<PaginatedResponse<CupPrediction>>(this.cupPredictionsUrl, { params });
   }

   getMyCupPredictions(cupCupMatchIds: number[]): Observable<PaginatedResponse<CupPrediction>> {
      const params: HttpParams = new HttpParams({ fromObject: { 'cup_cup_match_ids[]': cupCupMatchIds.map(id => id.toString()) } });
      return this.httpClient.get<PaginatedResponse<CupPrediction>>(`${this.cupPredictionsUrl}/my`, { params });
   }

   upsertPrediction(prediction: Partial<CupPrediction>): Observable<CupPrediction> {
      return this.httpClient
         .put<{ cup_prediction: CupPrediction }>(this.cupPredictionsUrl, prediction)
         .pipe(map(response => response.cup_prediction));
   }
}
