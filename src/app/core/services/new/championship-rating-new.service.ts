import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@env';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipRatingSearch } from '@models/search/championship-rating-search.model';
import { ChampionshipRating } from '@models/v2/championship/championship-rating.model';
import { Observable } from 'rxjs';
import { ChampionshipSeasonRatingItem } from '@models/v2/championship/championship-rating-season.model';

@Injectable()
export class ChampionshipRatingNewService {
   public readonly championshipRatingUrl: string = `${environment.apiBaseUrl}/v2/championship/rating`;

   constructor(private httpClient: HttpClient) {}

   public getChampionshipRating(search: ChampionshipRatingSearch): Observable<PaginatedResponse<ChampionshipRating>> {
      let params: HttpParams = new HttpParams();

      if (search.competitionId) {
         params = params.set('competition_id', search.competitionId.toString());
      }

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (search.userId) {
         params = params.set('user_id', search.userId.toString());
      }

      if (search.orderBy && search.sequence) {
         params = params.set('order_by', search.orderBy);
         params = params.set('sequence', search.sequence);
      }

      if (search.relations) {
         search.relations.forEach(relation => {
            params = params.append('relations[]', relation);
         });
      }

      return this.httpClient.get<PaginatedResponse<ChampionshipRating>>(this.championshipRatingUrl, { params });
   }

   public getChampionshipRatingSeason(seasonId: number): Observable<ChampionshipSeasonRatingItem[]> {
      return this.httpClient.get<ChampionshipSeasonRatingItem[]>(`${this.championshipRatingUrl}-season/${seasonId}`);
   }
}
