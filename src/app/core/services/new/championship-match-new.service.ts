import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { ChampionshipMatchStatistic } from '@models/new/championship-match-statistic.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { isNil } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ChampionshipMatchNewService {
   public readonly championshipMatchesUrl: string = `${environment.apiUrl}v2/championship/matches`;

   constructor(private httpClient: HttpClient) {}

   public createChampionshipMatch(championshipMatch: Partial<ChampionshipMatchNew>): Observable<ChampionshipMatchNew> {
      return this.httpClient
         .post<{ championship_match: ChampionshipMatchNew }>(this.championshipMatchesUrl, championshipMatch)
         .pipe(map(response => response.championship_match));
   }

   public deleteChampionshipMatch(championshipMatchId: number): Observable<void> {
      return this.httpClient.delete<void>(`${this.championshipMatchesUrl}/${championshipMatchId}`);
   }

   public getChampionshipMatch(championshipMatchId: number): Observable<ChampionshipMatchNew> {
      return this.httpClient
         .get<{ championship_match: ChampionshipMatchNew }>(`${this.championshipMatchesUrl}/${championshipMatchId}`)
         .pipe(map(response => response.championship_match));
   }

   public getChampionshipMatchStatistic(championshipMatchId: number): Observable<ChampionshipMatchStatistic> {
      return this.httpClient.get<ChampionshipMatchStatistic>(`${this.championshipMatchesUrl}/${championshipMatchId}/statistic`);
   }

   public getChampionshipMatches(search: ChampionshipMatchSearch): Observable<PaginatedResponse<ChampionshipMatchNew>> {
      let params: HttpParams = new HttpParams();

      if (!isNil(search.active)) {
         params = params.append('active', (search.active as unknown) as string);
      }

      if (!isNil(search.ended)) {
         params = params.append('ended', (search.ended as unknown) as string);
      }

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      if (!isNil(search.soon)) {
         params = params.append('soon', (search.soon as unknown) as string);
      }

      if (search.competitionId) {
         params = params.append('competition_id', search.competitionId.toString());
      }

      if (search.userId) {
         params = params.set('user_id', search.userId.toString());
      }

      const url: string = search.userId ? `${this.championshipMatchesUrl}/predictions` : this.championshipMatchesUrl;

      return this.httpClient.get<PaginatedResponse<ChampionshipMatchNew>>(url, { params });
   }

   public updateChampionshipMatch(
      championshipMatchId: number,
      championshipMatch: Partial<ChampionshipMatchNew>
   ): Observable<ChampionshipMatchNew> {
      return this.httpClient
         .put<{ championship_match: ChampionshipMatchNew }>(`${this.championshipMatchesUrl}/${championshipMatchId}`, championshipMatch)
         .pipe(map(response => response.championship_match));
   }
}
