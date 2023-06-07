import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { ChampionshipPrediction } from '@models/v2/championship/championship-prediction.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipPredictionSearch } from '@models/search/championship-prediction-search.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ChampionshipPredictionNewService {
   public readonly championshipPredictionsUrl: string = `${environment.apiBaseUrl}/v2/championship/predictions`;

   constructor(private httpClient: HttpClient) {}

   public getPredictionsByChampionshipMatchId(search: ChampionshipPredictionSearch): Observable<PaginatedResponse<ChampionshipPrediction>> {
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

      return this.httpClient.get<PaginatedResponse<ChampionshipPrediction>>(`${this.championshipPredictionsUrl}/by/match`, { params });
   }

   public getPredictionsByUserId(search: ChampionshipPredictionSearch): Observable<PaginatedResponse<ChampionshipPrediction>> {
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

      return this.httpClient.get<PaginatedResponse<ChampionshipPrediction>>(`${this.championshipPredictionsUrl}/by/user`, { params });
   }

   public getLastDistinctPredictions(): Observable<Partial<ChampionshipPrediction[]>> {
      return this.httpClient
         .get<{ championship_predicts: Partial<ChampionshipPrediction[]> }>(`${this.championshipPredictionsUrl}/last`)
         .pipe(map(response => response.championship_predicts));
   }

   public upsertPredictions(predictions: Partial<ChampionshipPrediction>[]): Observable<ChampionshipPrediction[]> {
      return this.httpClient.put<ChampionshipPrediction[]>(this.championshipPredictionsUrl, predictions);
   }
}
