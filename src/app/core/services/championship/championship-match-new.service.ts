import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { ChampionshipMatchNew } from '@models/championship/championship-match-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { Observable } from 'rxjs';

@Injectable()
export class ChampionshipMatchNewService {
   public readonly championshipMatchesUrl: string = `${environment.apiUrl}v2/championship/matches`;

   constructor(private httpClient: HttpClient) {}

   public getChampionshipMatches(search: ChampionshipMatchSearch): Observable<PaginatedResponse<ChampionshipMatchNew>> {
      let params: HttpParams = new HttpParams();

      if (search.limit) {
         params = params.set('limit', search.limit.toString());
      }

      if (search.page) {
         params = params.set('page', search.page.toString());
      }

      if (search.order_by && search.sequence) {
         params = params.set('order_by', search.order_by);
         params = params.set('sequence', search.sequence);
      }

      return this.httpClient.get<PaginatedResponse<ChampionshipMatchNew>>(this.championshipMatchesUrl, { params });
   }
}
