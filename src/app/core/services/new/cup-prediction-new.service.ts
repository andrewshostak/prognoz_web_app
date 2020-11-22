import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { CupPredictionNew } from '@models/new/cup-prediction-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupPredictionSearch } from '@models/search/cup-prediction-search.model';
import { Observable } from 'rxjs';

@Injectable()
export class CupPredictionNewService {
   public readonly cupPredictionsUrl: string = `${environment.apiUrl}v2/cup/predictions`;

   constructor(private httpClient: HttpClient) {}

   public getCupPredictions(search: CupPredictionSearch): Observable<PaginatedResponse<CupPredictionNew>> {
      const params: HttpParams = new HttpParams({
         fromObject: {
            user_id: search.userId.toString(),
            cup_cup_match_id: search.cupCupMatchId.toString()
         }
      });

      return this.httpClient.get<PaginatedResponse<CupPredictionNew>>(this.cupPredictionsUrl, { params });
   }

   public getMyCupPredictions(cupCupMatchId: number): Observable<PaginatedResponse<CupPredictionNew>> {
      const params: HttpParams = new HttpParams({ fromObject: { cup_cup_match_id: cupCupMatchId.toString() } });
      return this.httpClient.get<PaginatedResponse<CupPredictionNew>>(`${this.cupPredictionsUrl}/my`, { params });
   }
}
