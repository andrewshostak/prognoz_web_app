import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { ChampionshipPredictionNew } from '@models/new/championship-prediction-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipPredictionSearch } from '@models/search/championship-prediction-search.model';
import { Observable } from 'rxjs';

@Injectable()
export class ChampionshipPredictionNewService {
   public readonly championshipPredictionsUrl: string = `${environment.apiUrl}v2/championship/predictions`;

   constructor(private httpClient: HttpClient) {}

   public getPredictionsByChampionshipMatchId(
      search: ChampionshipPredictionSearch
   ): Observable<PaginatedResponse<ChampionshipPredictionNew>> {
      let params: HttpParams = new HttpParams();

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (search.championshipMatchId) {
         params = params.set('championship_match_id', search.championshipMatchId.toString());
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      return this.httpClient.get<PaginatedResponse<ChampionshipPredictionNew>>(`${this.championshipPredictionsUrl}/by/match`, { params });
   }

   public getPredictionsByUserId(search: ChampionshipPredictionSearch): Observable<PaginatedResponse<ChampionshipPredictionNew>> {
      let params: HttpParams = new HttpParams();

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (search.userId) {
         params = params.set('user_id', search.userId.toString());
      }

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      return this.httpClient.get<PaginatedResponse<ChampionshipPredictionNew>>(`${this.championshipPredictionsUrl}/by/user`, { params });
   }
}
