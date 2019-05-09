import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@env';
import { Match } from '@models/match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { MatchSearch } from '@models/search/match-search.model';
import { Observable } from 'rxjs';

@Injectable()
export class MatchService {
   public readonly matchesUrl: string = `${environment.apiUrl}matches`;

   constructor(private httpClient: HttpClient) {}

   public getMatches(matchSearch: MatchSearch): Observable<PaginatedResponse<Match>> {
      let params: HttpParams = new HttpParams();

      if (matchSearch.limit) {
         params = params.set('limit', matchSearch.limit.toString());
      }

      if (matchSearch.offset) {
         params = params.set('offset', matchSearch.offset.toString());
      }

      return this.httpClient.get<PaginatedResponse<Match>>(this.matchesUrl, { params });
   }
}
